# Testing the Study Repository UI (Loaded / Running buttons)

This guide describes how to test the **Loaded** (green light) and **Running** (spinner) status indicators and related buttons using the **example study container** (`darwin-eu-dev/examplestudy`).

## Prerequisites

- **Docker** running (Docker Desktop or engine with socket available).
- **Full stack** running: `make start` (or `make run-docker-db` + `make run-backend` and `make run-datanode-ui` in separate terminals).
- **Registry credentials** for the study catalog (e.g. GitHub Container Registry). Copy `datanode/config/datanode.env.example` to `datanode/config/datanode.env` and set:
  - `ARACHNE_DOCKER_REGISTRY_URL` (e.g. `https://ghcr.io`)
  - `ARACHNE_DOCKER_REGISTRY_USER` (e.g. your GitHub username)
  - `ARACHNE_DOCKER_REGISTRY_TOKEN` (e.g. a GitHub PAT with `read:packages`)

## 1. Get the example study image

Either pull via the UI (step 2 below) or pre-pull from the repo root:

```bash
make install-test
```

This runs the same integration test that pulls `darwin-eu-dev/examplestudy:main` from the registry (uses `datanode/config/datanode.env`). It may take several minutes the first time. On **Apple Silicon (ARM)** the backend pulls the `linux/amd64` image so the pull succeeds; Docker runs it with emulation (QEMU/Rosetta).

## 2. Configure the Study catalog (if not already)

1. Open the app at **http://localhost:3000**.
2. Go to **Settings**.
3. Set **Study catalog address** to your registry URL (e.g. `https://ghcr.io`).
4. Set username and token if the registry is private.
5. Click **Check connection**, then **Save**.

## 3. Install the example study (if not already)

1. Go to **Study Repository**.
2. In **Install New Study**, enter: `darwin-eu-dev/examplestudy`.
3. Click **Install** and wait for the image to pull. The study appears in the list with status **Idle** (grey circle).

## 4. Test the “Loaded” indicator (green light)

1. In the list, find **examplestudy** and click **Run** (play icon). The run view opens.
2. Wait for **“Study environment ready”** (green) in the run view header.
3. Go **Back to Repository**.
4. In the list, the same study should now show a **green light** and **“Loaded”** (Docker image is on; container is running).

## 5. Test the “Running” indicator (spinner)

1. Click **Run** on **examplestudy** again to open the run view.
2. Leave the default `codeToRun.R` (or edit if you like). Click **Run study**.
3. **In the list**: switch back to the repository view (e.g. click “Study Repository” in the sidebar or open the list in another tab). You should see **“Running”** with the **spinner** for that study while R is executing.
4. When the run finishes, the list updates: **“Running”** disappears and you see **“Loaded”** again (or **“Results ready”** if the run produced results).

## 6. Test Shutdown

1. With the study **Loaded** (or **Running**), click **Shutdown** (square icon) for that study.
2. Confirm. The status should return to **Idle** (grey circle).

## Summary of status indicators

| Status    | Icon           | Meaning                                      |
|----------|----------------|----------------------------------------------|
| Idle     | Grey circle    | Container not running                        |
| Loaded   | Green circle   | Docker container is running (image “on”)     |
| Running  | Spinner        | R code (`codeToRun.R`) is currently executing|
| Results ready | Green check | Study has produced results                   |

The example study’s `codeToRun.R` uses Eunomia (small DuckDB) and runs a short pipeline, so a full “Run study” usually completes in one to two minutes.
