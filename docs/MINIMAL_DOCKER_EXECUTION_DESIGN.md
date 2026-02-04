# Minimal Docker Execution: Embedding Without Full Execution Engine

## Your constraints (summary)

- **Need:** A Docker service to run analyses (e.g. R in containers).
- **Don’t need:** SQL execution, Hydra, Strategus, tarball runtimes.
- **Want to avoid:** Extra dependencies and code you don’t control (full EE).
- **Must have:** Execution must not block the datanode backend; must be async and run in a **separate process**.
- **Considering:** Embedding “EE” inside datanode in some form.

This doc works through how to get a minimal, Docker-only execution path that stays async and in a separate process, and when “embedding” still makes sense.

---

## 1. What “async in a separate process” means

- **Async:** The datanode request that triggers execution returns quickly (e.g. 202). No long-running work on the request thread. Status/results come back via callbacks.
- **Separate process:** The process that actually runs Docker (and possibly heavy work) is **not** the main datanode JVM. So a stuck or crashing run doesn’t block or kill the datanode app.

So: “embed EE inside datanode” can still satisfy “async + separate process” if “embed” means “we own and host the code in the datanode repo,” while execution itself runs in another process (see options below).

---

## 2. Why not embed the full Execution Engine

- You don’t control the EE code → hard to strip SQL, tarball, Hydra/Strategus, and trim dependencies.
- Full EE pulls in many JDBC drivers, Handlebars, descriptor parsing, CDM metadata, etc. You said you want to avoid that.
- So: **treat the full EE as an external black box you might keep using as-is, but don’t merge its full codebase into the datanode.**

---

## 3. Recommended direction: minimal Docker-only runner you own

Implement a **minimal “Docker execution” path** that:

- Accepts the **same contract** the datanode already uses: request payload (e.g. `AnalysisRequestDTO`) + zip of files; callbacks for status and result (so existing `AnalysisCallbackController` and `AnalysisService` stay unchanged).
- Does **only**: unpack files → run one Docker container (image from request or config) → collect stdout/result → POST status updates and final result to the datanode callbacks.
- **No:** SQL, tarball runtimes, Hydra/Strategus-specific logic, descriptor scanning, CDM metadata, multiple JDBC drivers.

Then you have two high-level deployment options that both keep execution **async** and in a **separate process**.

---

## 4. Option A: Minimal runner as a separate process (recommended)

**Idea:** A small, separate service (or subprocess) that only does Docker execution. Datanode continues to call “the engine” over HTTP (as today), but the engine is **your** minimal implementation, not the full EE.

- **Async:** Datanode sends HTTP request and returns; runner processes in the background and calls back.
- **Separate process:** Runner runs in its own JVM (or process), so it doesn’t block or crash the datanode.
- **Embedding:** You can still “embed” this in the **repo**: e.g. a new module `datanode-docker-runner` or `minimal-execution-engine` under the same repo, built and run as its own process (e.g. its own Spring Boot app or a simple main that starts a small HTTP server).

**Dependencies (minimal):**

- `docker-java` (Docker API client).
- `execution-engine-commons` (or the same DTOs the datanode already uses) so request/result and callback payloads stay compatible.
- HTTP client to POST to `updateStatusCallback` and `resultCallback`.
- Optional: small web framework (e.g. Spring Boot) for `/api/v1/analyze`, `/api/v1/abort/{id}`, `/api/v1/status` if you want to keep the same URL shape as EE; or a minimal server (e.g. JVM built-in or small lib).

**What you keep in the datanode:**

- Current flow: `AnalysisOrchestrator` → `ExecutionEngineClient` → HTTP to engine.
- `RemoteExecutionEngineClient` (or a config-driven client) points to this minimal runner’s URL instead of the full EE.
- No need to add SQL, tarball, or EE’s heavy deps to the datanode.

**Pros:** Clear separation; datanode stays thin; execution is definitely in another process; you control the whole runner; minimal surface area and deps.  
**Cons:** You still run and deploy two processes (datanode + runner); you implement a small HTTP API (can mirror EE’s analyze/abort/status if helpful).

---

## 5. Option B: Datanode spawns a “runner” subprocess (embed code, separate process)

**Idea:** The “execution engine” code lives inside the datanode repo (e.g. a module or package used only by datanode), but **execution** is done by a **child process** that the datanode spawns (e.g. a small Java main or script that runs Docker and performs callbacks).

- **Async:** Datanode receives “run analysis,” writes request + files to a temp dir (or queue), spawns the child process, and returns. No waiting for Docker to finish.
- **Separate process:** The child is a separate OS process; its lifecycle is independent of the datanode JVM.
- **Embedding:** The code that builds the request, spawns the process, and (optionally) polls or listens for completion lives in the datanode repo; the “runner” can be a small JAR or script that the datanode starts (e.g. `ProcessBuilder` to `java -jar docker-runner.jar …` or a script that runs Docker and curls the callbacks).

**Flow (conceptual):**

1. Datanode: persist analysis, build payload (same `AnalysisRequestDTO` + zip as today), write to temp dir.
2. Datanode: start subprocess with (analysis id, paths, callback URLs, docker image, etc.).
3. Datanode: return 202 to client.
4. Subprocess: unpack, run Docker, on exit POST status/result to datanode callbacks (same as today).
5. Optional: subprocess writes “done” to a file or queue so datanode can update state if you don’t want to rely only on callbacks.

**Pros:** Single repo; execution is in a separate process; datanode doesn’t need to run a separate long-lived “engine” service if you’re okay with one subprocess per run.  
**Cons:** More moving parts (process spawn, cleanup of temp dirs, handling subprocess crashes); you may want a small wrapper or queue so you don’t spawn unbounded processes.

---

## 6. What *not* to do for “async + separate process”

- **Don’t** run the full EE in the same JVM as the datanode and only “async” with a thread pool: that still puts Docker and all EE logic in the same process, so a runaway run can affect the datanode and you don’t get true process isolation.
- **Don’t** embed the full EE codebase into the datanode to “simplify deployment” if your requirement is “separate process” — that would push you toward in-process execution, which conflicts with that.

---

## 7. Contract to keep (so datanode doesn’t change)

So that the datanode’s existing flow and callbacks keep working, the minimal runner should:

- **Accept:** `POST /api/v1/analyze` (or equivalent) with multipart: `analysisRequest` (JSON, same shape as `AnalysisRequestDTO`) + `file` (zip of analysis files). Optional: same `/api/v1/status`, `POST /api/v1/abort/{id}` if you want cancel support.
- **Use from request:** `id`, `executableFileName`, `dockerImage` (or a default image from config), `updateStatusCallback`, `resultCallback`, `callbackPassword`, and optionally `dataSource` if you ever need to pass connection info into the container (you can ignore for a first version).
- **Callbacks:** POST to `updateStatusCallback` with `AnalysisExecutionStatusDTO` (id, stage, stdout, date); on completion POST to `resultCallback` with multipart: `AnalysisResultDTO` + result files (same as EE today). Datanode’s `AnalysisCallbackController` already implements these endpoints.

The datanode already has `AnalysisService.toEEDto(id)` and builds the zip; it just needs the client to point at your minimal runner’s URL instead of the full EE.

---

## 8. Minimal runner scope (what to implement)

- Unzip uploaded file to a temp dir (e.g. `analysis.dir`).
- Resolve Docker image (request or config default).
- Create container with that dir mounted (e.g. `/etc/analysis`), set entrypoint/command to run the requested executable (e.g. `Rscript main.R` or similar).
- Stream or collect stdout/stderr; periodically POST status to `updateStatusCallback`.
- On container exit: build result (success/failure, stdout, optional result files from the mounted dir), POST to `resultCallback` (multipart with `AnalysisResultDTO` + files).
- Optional: support `POST /api/v1/abort/{id}` (stop container by id) and `GET /api/v1/status?id=…` for compatibility.

No SQL, no tarball, no Hydra/Strategus, no CDM metadata unless you later add a tiny subset by choice.

---

## 9. Summary

- **Don’t** embed the full EE: too many deps, code you don’t control, and it doesn’t match “Docker only.”
- **Do** add a minimal Docker-only execution path you own, with the same request/callback contract the datanode already uses.
- To keep **async and separate process:** run that minimal path in a **separate process** — either as a small standalone service (Option A) or as a subprocess spawned by the datanode (Option B). “Embedding” can mean “code lives in the datanode repo,” not “runs in the same JVM.”
- Datanode keeps using `ExecutionEngineClient` (e.g. HTTP) so it never blocks; the actual execution happens in the other process. You can still call this “embedding EE inside datanode” in the sense of “we replaced the external EE with our own minimal runner that we ship and maintain in the same repo.”

If you want, next step can be a concrete list of classes/modules and API shapes for Option A (minimal runner service) or Option B (subprocess runner) in this repo.
