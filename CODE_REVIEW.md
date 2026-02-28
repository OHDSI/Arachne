# Arachne DataNode v2 - Comprehensive Code Review

**Date:** 2026-02-19
**Reviewer:** Senior Full Stack Developer (Automated Review)
**Scope:** Full codebase — backend (Java/Spring Boot), frontend (TypeScript/React/Next.js), infrastructure (Docker, Maven, SQL, scripts)

---

## Executive Summary

Arachne DataNode v2 is a well-structured multi-module Maven project for executing containerized OHDSI studies. The codebase demonstrates solid architectural choices (Spring Boot 3, Next.js, Docker orchestration, Flyway migrations) and good separation of concerns. However, the review uncovered **1 critical bug**, several **high-severity security issues**, and numerous opportunities for improvement across code quality, dead code removal, and operational hardening.

**Overall Rating: 6/10** — Functional but has significant bugs and security issues that should be addressed before production use.

---

## Table of Contents

1. [Critical Bugs](#1-critical-bugs)
2. [Security Vulnerabilities](#2-security-vulnerabilities)
3. [High-Severity Issues](#3-high-severity-issues)
4. [Medium-Severity Issues](#4-medium-severity-issues)
5. [Low-Severity / Code Quality Issues](#5-low-severity--code-quality-issues)
6. [Dead Code](#6-dead-code)
7. [Architecture & Design Improvements](#7-architecture--design-improvements)
8. [Frontend-Specific Issues](#8-frontend-specific-issues)
9. [Infrastructure & DevOps Issues](#9-infrastructure--devops-issues)
10. [Positive Observations](#10-positive-observations)

---

## 1. Critical Bugs

### BUG-01: Kerberos password update writes to entity name instead of password

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/datasource/DataSourceService.java:133`

```java
Optional.ofNullable(dto.getKrbPassword()).filter(this::isNotDummyPassword).ifPresent(entity::setName);
```

**Expected:** `entity::setKrbPassword`
**Actual:** `entity::setName`

**Impact:** When updating a data source with Kerberos authentication enabled, the Kerberos password overwrites the data source name, corrupting the entity. The actual Kerberos password is never saved. This will break both the data source display and Kerberos authentication for any affected source.

**Fix:**
```java
Optional.ofNullable(dto.getKrbPassword()).filter(this::isNotDummyPassword).ifPresent(entity::setKrbPassword);
```

### BUG-02: NullPointerException in `markExecuted()` — `resultDir.listFiles()` can return null

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/AnalysisResultsService.java:186-187`

```java
File[] files = resultDir.listFiles();
Stream.of(files).map(file -> ...
```

`File.listFiles()` returns `null` when the path is not a directory or an I/O error occurs. `Stream.of(null)` will throw `NullPointerException`. This crashes the result processing for any analysis where the result directory is missing or invalid.

**Fix:** Add null check: `Stream.of(files != null ? files : new File[0])`

### BUG-03: NullPointerException in `ensureCancellable()` when `currentState` is null

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/AnalysisService.java:126-127`

```java
AnalysisStateEntry state = find(id).getCurrentState();
String stage = state.getStage(); // NPE if currentState is null
```

`getCurrentState()` can return `null` for newly created analyses that haven't been started yet. Attempting to cancel such an analysis will crash.

### BUG-04: Logic bug in `ensureCancellable()` — inverted condition

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/AnalysisService.java:131-133`

```java
if (Objects.equals(stage, Stage.ABORT) && !TERMINAL_STAGES.contains(stage)) {
    throw new ValidationException("Analysis not running: ...");
}
```

`Stage.ABORT` is never in `TERMINAL_STAGES` (which contains `ABORTED` and `COMPLETED`), so `!TERMINAL_STAGES.contains(stage)` is always true when stage is `ABORT`. More importantly, the condition does NOT reject analyses in terminal stages (`COMPLETED`, `ABORTED`), which should not be cancellable. The logic appears inverted.

### BUG-05: `NullPointerException` in `toUnsecuredDto()` — Boolean unboxing

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/datasource/DataSourceService.java:244`

```java
if (source.getUseKerberos()) {
```

`getUseKerberos()` returns `Boolean` (wrapper), which is `null` for non-Kerberos data sources. Unboxing `null` throws `NullPointerException`. This affects every non-Impala data source sent to the execution engine.

**Fix:** `if (Boolean.TRUE.equals(source.getUseKerberos())) {`

---

## 2. Security Vulnerabilities

### SEC-01: CSRF disabled globally with stateless sessions

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/config/WebSecurityConfig.java:64-65`

```java
http.csrf(AbstractHttpConfigurer::disable)
```

CSRF is disabled because sessions are stateless (JWT). This is standard practice for pure-API backends. However, JWT tokens are delivered via **HttpOnly cookies** (`JwtTokens.java:78`), which means the browser automatically sends them on every request — making the app vulnerable to CSRF attacks just like session cookies would.

**Recommendation:** Enable CSRF protection with `CookieCsrfTokenRepository.withHttpOnly(false)` for cookie-based JWT, or switch to `Authorization: Bearer` header-based JWT delivery.

### SEC-02: JWT cookie missing `Secure` flag

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/auth/JwtTokens.java:69-81`

```java
cookie.setHttpOnly(true);
cookie.setAttribute("SameSite", "Strict");
// Missing: cookie.setSecure(true);
```

The JWT authentication cookie does not set the `Secure` flag. In production over HTTPS, the cookie will still be sent over unencrypted HTTP connections, allowing token theft via network sniffing.

**Fix:** Add `cookie.setSecure(true)` or make it configurable based on environment.

### SEC-03: Callback password exposed in URL path

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/analysis/AnalysisCallbackController.java:39-40`

```java
public static final String UPDATE_URI = "/api/v1/submissions/{id}/update/{password}";
public static final String RESULT_URI = "/api/v1/submissions/{id}/result/{password}";
```

Callback passwords are part of the URL path, meaning they appear in server access logs, proxy logs, browser history, and Referer headers. These endpoints are also configured as `permitAll()` in `WebSecurityConfig.java:106`.

**Recommendation:** Move the password to a request header (e.g., `X-Callback-Token`) or request body.

### SEC-04: Content-Disposition header injection

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:462-463`

```java
String filename = filePath.contains("/") ? filePath.substring(filePath.lastIndexOf('/') + 1) : filePath;
return ResponseEntity.ok()
    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
```

The `filePath` parameter comes directly from the user request (`@RequestParam("path")`). A crafted filename containing `"` or `\r\n` characters could inject additional HTTP headers.

**Fix:** Sanitize the filename — remove or encode special characters, or use `ContentDisposition.builder("attachment").filename(filename).build()`.

### SEC-05: Container path traversal possibility

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/study/StudyContainerService.java:392-403`

The `listContainerFiles` endpoint accepts a `path` parameter from the user. While `normalizePathUnderWorkdir()` does validate the path starts with `/code`, the validation uses `Paths.get().normalize()` which is OS-dependent. On Windows build environments, this could behave differently than the Linux container filesystem.

**Recommendation:** Add explicit check against `..` segments before normalization, and validate using Unix path semantics only.

### SEC-06: Catalog registry token returned in cleartext via Settings API

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:148-155`

```java
dto.setCatalogToken(studyService.getCatalogToken());
```

The `getSettings()` endpoint returns the Docker registry token in cleartext. Compare: database passwords are masked with `DUMMY_PASSWORD` in `DataSourceService.toDto()`. Registry tokens should receive the same treatment.

### SEC-07: Path traversal via unvalidated multipart filenames

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/util/AnalysisUtils.java:40-46`

`multipartFile.getOriginalFilename()` is used directly to construct file paths without sanitization. A crafted filename like `../../etc/passwd` could write files outside the intended directory.

### SEC-08: Stateless session conflicts with OAuth2 login flow

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/config/WebSecurityConfig.java:66-67`

```java
session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
```

OAuth2/OIDC login flow requires session storage for CSRF state parameters during the redirect-based flow. `STATELESS` sessions will cause intermittent OAuth login failures. Spring Security needs at least `IF_REQUIRED` for the OAuth2 login endpoints.

### SEC-09: Hardcoded JWT secret committed to repository

**File:** `datanode/src/main/resources/application.yml:91`

```yaml
datanode:
  jwt:
    secret: 129DF19C8A91AFD8375A2826A33539K01ACQ778QOJFAA9MGWLWH73PLXVFVHBR7860...
```

A production JWT secret is hardcoded in the application config and committed to git. Combined with test RSA keys (`testkeys/app.key`, `testkeys/app.pub`) used as production defaults (`jwt.key.private: classpath:testkeys/app.key`), **anyone with repository access can forge valid JWT tokens**.

**Fix:** Remove default secrets entirely. Require them via environment variables with no fallback.

### SEC-10: Weak Jasypt encryption — broken algorithm + committed password

**File:** `datanode/src/main/resources/application.yml:134-137` and `install/docker/datanode.env:24`

```yaml
jasypt:
  encryptor:
    algorithm: PBEWITHMD5ANDDES
    iv-generator-classname: org.jasypt.iv.NoIvGenerator
```
```
jasypt.encryptor.password=arachne
```

Three compounding issues: (1) `PBEWITHMD5ANDDES` is a cryptographically broken algorithm, (2) `NoIvGenerator` removes IV protection, (3) the encryption password `arachne` is committed to git. Any `ENC(...)` values in config are trivially decryptable.

### SEC-11: Docker-runner has zero authentication with arbitrary image execution

**File:** `docker-runner/src/main/java/com/odysseusinc/arachne/dockerrunner/api/AnalysisController.java`

The docker-runner REST API has no Spring Security dependency and no authentication whatsoever. The Docker image name comes directly from the request DTO with no validation or allowlist. Combined with no auth, this is an **arbitrary code execution vector** — any network-accessible client can run any Docker image.

### SEC-12: Default `loginDisabled=true` bypasses all API authentication

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/config/WebSecurityConfig.java:53,107-110`

```java
@Value("${security.loginDisabled:true}")
private boolean loginDisabled;
// ...
if (loginDisabled) {
    auth.requestMatchers("/api**").permitAll();
    auth.requestMatchers("/api/**").permitAll();
}
```

The default value is `true`, which makes **all API endpoints publicly accessible without authentication**. A misconfigured deployment will be wide open.

**Recommendation:** Default to `false`. Require explicit opt-in for disabled authentication.

---

## 3. High-Severity Issues

### HIGH-01: Unrestricted Docker container execution

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/study/StudyContainerService.java:123-138`

Study containers are started with no resource limits (CPU, memory, PID), no filesystem restrictions, and no network isolation. A malicious study image could consume all host resources, access the Docker socket, or attack the network.

**Recommendation:**
- Add resource limits (`.withMemory()`, `.withCpuCount()`)
- Run containers with `--network=none` or a restricted network
- Add `--read-only` where possible
- Consider using `--security-opt=no-new-privileges`

### HIGH-02: `AnalysisController.execute()` ignores path variable `{id}`

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/analysis/AnalysisController.java:95-98`

```java
@PostMapping(path = "/execute/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
public Long execute(Principal principal, String id, @Valid @RequestBody AnalysisRequestDTO request) {
```

The `id` parameter is missing `@PathVariable` annotation and will always be `null`. It is then passed to `orchestrator.run(user, request, id)` as a null upload ID. This endpoint is likely broken.

### HIGH-03: Unused but instantiated `ScheduledExecutorService` leaks a thread

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/AnalysisService.java:91`

```java
@SuppressWarnings("unused")
private final ScheduledExecutorService executor = new ScheduledThreadPoolExecutor(1);
```

A thread pool is created for every `AnalysisService` instance but never used, shut down, or managed by Spring. The `@SuppressWarnings("unused")` confirms awareness but the resource is still leaked.

**Fix:** Remove the field entirely.

### HIGH-04: `AnalysisController.downloadResults()` file copy bug

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/analysis/AnalysisController.java:163`

```java
Files.copy(Paths.get(f.getLink()), stdoutDir);
```

`Files.copy(Path source, Path target)` when `target` is a directory will fail with `FileAlreadyExistsException`. The correct call should be:
```java
Files.copy(Paths.get(f.getLink()), stdoutDir.resolve(Paths.get(f.getLink()).getFileName()));
```

### HIGH-05: Temp directory leak in `extractFileFromZip()`

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/AnalysisResultsService.java:127-132`

```java
Path extracted = Files.createTempDirectory("result_file");
zipFile.extractFile(filename, extracted.toString());
return new FileSystemResource(extracted.resolve(filename));
```

A temp directory is created for every result file download but **never deleted**. The `FileSystemResource` is returned to the caller, so the directory is leaked on every API call. Over time, this fills up the disk with orphaned temp directories.

### HIGH-06: DataSource UUID never set on create — constraint violation

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/model/datasource/DataSource.java:54-55`

```java
@Column(name = "sid", nullable = false)
private String uuid;
```

The `uuid` field is `nullable = false` in the DB, but the `toEntity()` method in `DataSourceService` never sets it. Creating a new DataSource will throw a DB constraint violation unless there's a `@PrePersist` hook (none visible).

### HIGH-07: `Boolean ==` reference comparison in OIDC credentials

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/auth/oidc/OidcCredentialsService.java:137`

```java
&& storedUser.get("emailVerified") == user.getEmailVerified()
```

Uses `==` (reference equality) on `Boolean` objects from deserialized JSON. Deserialized `Boolean` values may not be the same cached instances as `Boolean.TRUE`/`Boolean.FALSE`, causing this comparison to fail even when both values are `true`. Should use `Objects.equals()`.

### HIGH-08: Docker Compose exposes database port with weak credentials

**File:** `install/docker/docker-compose.yml:17,21-23`

```yaml
ports:
  - "127.0.0.1:5434:5432"
environment:
  POSTGRES_USER: ohdsi-user
  POSTGRES_PASSWORD: ohdsi-password
```

While bound to localhost, the default credentials `ohdsi-user/ohdsi-password` are hardcoded. Any local process can connect to the database. The `.env.example` file should use placeholder values and documentation should emphasize changing them.

---

## 4. Medium-Severity Issues

### MED-01: Duplicate semicolons (harmless but indicative of code quality)

**Files:**
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/AnalysisService.java:357` — `dto.setParameters(analysis.getParameters());;`
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/analysis/AnalysisController.java:97` — `User user = userService.getUser(principal);;`

### MED-02: Return type mismatch in `AnalysisController.get()`

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/analysis/AnalysisController.java:122-125`

```java
@GetMapping("{id}")
public AnalysisRequestDTO get(@PathVariable("id") Long id) {
    return analysisService.get(id); // Returns AnalysisDTO, not AnalysisRequestDTO
```

`AnalysisService.get()` returns `AnalysisDTO` but the controller declares `AnalysisRequestDTO`. This will compile if `AnalysisDTO` extends `AnalysisRequestDTO` or has compatible serialization, but it's misleading at minimum.

### MED-03: `toDTO()` in StudyRepositoryController makes N+1 Docker API calls

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:491-508`

When `localImages` is null (several call sites pass `null`), `toDTO` calls `containerService.hasImageLocally(imageName)` which calls `listLocalImageNames()` — making a full Docker API call for **each package**. The `listPackages()` method correctly pre-fetches, but individual getters and mutation endpoints don't.

**Fix:** Always pre-fetch `localImages` or cache the result.

### MED-04: Optimistic concurrency version ignored on first save

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:352`

```java
int version = body != null && body.get("version") != null ? numberVersion(body.get("version")) : 0;
```

When `version` is 0 (first save or malformed input), the version check in `updateContentIfVersionMatches` will always pass, potentially overwriting concurrent edits.

### MED-05: Silent exception swallowing in `executeStudy()`

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:319-321`

```java
} catch (Exception e) {
    // Logs and status already saved; result folder copy is best-effort
}
```

The exception is completely silenced — no logging, no feedback. If result extraction fails, the user will never know why results are missing.

### MED-06: `DataSourceController.removeKeytab()` has no authorization check

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/datasource/DataSourceController.java:132-136`

```java
@DeleteMapping("/{id}/keytab")
public void removeKeytab(@PathVariable("id") Long id) {
    dataSourceService.removeKeytab(id);
}
```

Unlike `add()`, `update()`, `list()`, `get()`, and `delete()` which all verify `principal` or admin status, `removeKeytab()` has no authentication check at all. Any authenticated user (or unauthenticated if `loginDisabled=true`) can delete any data source's Kerberos keytab.

### MED-07: Comment says "Argon2" but code uses BCrypt

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/auth/basic/DbBasicCredentialsService.java:50-55`

```java
/**
 * Current password encoders (such as Argon2 used here) built-in salt implementation
 */
private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
```

The comment is misleading and could confuse future maintainers into thinking the system uses a stronger hashing algorithm than it does.

### MED-08: Pagination bypassed with `Integer.MAX_VALUE`

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/admin/AdminController.java:65`

```java
PageRequest pageForList = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
```

This defeats pagination entirely, loading all records into memory. With a large user table, this causes OOM.

### MED-09: `numberVersion()` throws uncaught `NumberFormatException`

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:370-374`

```java
private static int numberVersion(Object v) {
    if (v instanceof Number) return ((Number) v).intValue();
    if (v instanceof String) return Integer.parseInt((String) v, 10);
    return 0;
}
```

If the string is not a valid integer (e.g., `"abc"`), `Integer.parseInt` throws `NumberFormatException` which will bubble up as a 500 error.

---

## 5. Low-Severity / Code Quality Issues

### LOW-01: Inconsistent dependency injection style
The codebase mixes `@Autowired` field injection (`DataSourceController`, `AnalysisService`) with constructor injection (`StudyRepositoryController`, `StudyContainerService`). Constructor injection is preferred for testability and immutability.

### LOW-02: Overuse of `Map<String, Object>` as API response types
Multiple controller methods return `Map<String, Object>` instead of typed DTOs:
- `StudyRepositoryController.startStudy()` → `Map<String, Object>`
- `StudyRepositoryController.executeStudy()` → `Map<String, Object>`
- `StudyRepositoryController.listRuns()` → `List<Map<String, Object>>`
- `StudyRepositoryController.listResultFiles()` → `List<Map<String, Object>>`
- `StudyRepositoryController.getCodeToRun()` → `Map<String, Object>`
- `StudyRepositoryController.putCodeToRun()` → `ResponseEntity<?>`

This bypasses compile-time type safety, makes API documentation generation impossible, and is error-prone.

### LOW-03: Hardcoded strings instead of constants
- `"ROLE_ADMIN"` in `DataSourceController.java:164`
- `"/code"` repeated across `StudyContainerService` and controller default params
- `"latest"` version default in `StudyRepositoryController.java:104`
- Error message strings duplicated across controllers

### LOW-04: `Collectors.toList()` vs `.toList()`
The codebase inconsistently uses both `stream().collect(Collectors.toList())` and `stream().toList()`. Since Java 17 is the target, prefer `.toList()` everywhere for immutable lists.

### LOW-05: Missing `@RequestBody` annotation
**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/datasource/DataSourceController.java:157`

```java
public CompletableFuture<CheckResult> check(DataSourceUnsecuredDTO dto) {
```

The `dto` parameter is missing `@RequestBody`, so Spring will try to bind it from query parameters instead of the request body.

### LOW-06: `ExceptionHandlingAdvice.exceptionHandler(Exception)` doesn't log stack trace

**File:** `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/ExceptionHandlingAdvice.java:74`

```java
log.error("[{}]: {}", token, ex.getMessage());
```

Only the message is logged, not the stack trace. For unhandled exceptions, this makes debugging extremely difficult. Should be:
```java
log.error("[{}]: {}", token, ex.getMessage(), ex);
```

### LOW-07: Double semicolons scattered in code
Files: `AnalysisService.java:357`, `AnalysisController.java:97` — indicates missing linting.

---

## 6. Dead Code

### DEAD-01: `ScheduledExecutorService executor` — never used
**File:** `AnalysisService.java:91` — Instantiated, suppressed, never referenced.

### DEAD-02: `ExecutionEngineClient engine` — injected but suppressed as unused
**File:** `AnalysisService.java:100-101` — `@SuppressWarnings("unused")` on the field.

### DEAD-03: `@Async` on `DataSourceController.check()` methods
**File:** `DataSourceController.java:149-158` — `@Async` on a controller method returning `CompletableFuture` is redundant when the service itself handles async. More importantly, `@Async` on a method that returns `CompletableFuture` from a service may cause the future to execute on the async thread pool while Spring wraps it in another, leading to unexpected behavior.

### DEAD-04: Multiple TODO items indicating incomplete implementation
- `AdminController.java:59` — "This method is not implemented properly"
- `User.java:48` — "TODO replace with UUID"
- `JwtTokens.java:84` — "TODO DEV Most likely, roles should not be here"

### DEAD-05: `defaultCohortTargetTable` field injected but usage unclear
**File:** `DataSourceService.java:58` — Only referenced in `toUnsecuredDto()` as a fallback value. If this property is not configured, the app will fail to start.

### DEAD-06: `Async` import in `DataSourceController`
**File:** `DataSourceController.java:34` — `org.springframework.scheduling.annotation.Async` is imported and used but the behavior is questionable (see DEAD-03).

---

## 7. Architecture & Design Improvements

### ARCH-01: Introduce a DTO layer for Study Repository API responses
Replace `Map<String, Object>` returns with proper response DTOs. This enables:
- OpenAPI/Swagger documentation generation
- Compile-time contract checking
- Easier frontend type synchronization

### ARCH-02: Extract Docker interaction into a dedicated abstraction
`StudyContainerService` directly uses `DockerClient` for container lifecycle, exec, and file operations. Extracting an interface would:
- Allow testing without Docker
- Support alternative container runtimes (Podman, containerd)
- Improve testability

### ARCH-03: Add request validation layer
Controllers perform manual null/blank checks on `@RequestBody Map<String, ...>` parameters. Use `@Valid` with Jakarta validation annotations on proper DTO classes instead.

### ARCH-04: Centralize credential/secret management
Catalog tokens, callback passwords, and database credentials are stored in various places (DB fields, application properties, env vars). Consider a unified secrets management approach.

### ARCH-05: Add API versioning strategy
The existing `/api/v1/` prefix suggests versioning intent, but there's no mechanism for maintaining backward compatibility or deprecating endpoints.

### ARCH-06: Study execution should be asynchronous
`StudyRepositoryController.executeStudy()` runs the R script synchronously in the HTTP request thread. Long-running studies will trigger HTTP timeouts. This should use async execution with a polling/webhook mechanism for status updates.

---

## 8. Frontend-Specific Issues

### FE-01: Missing error handling in API calls
**File:** `datanode-ui/src/api/study-repository.ts`

API functions have no error handling — they return raw promises. Callers use `.catch(() => setRuns([]))` which swallows error details. Implement a centralized error interceptor in the Axios instance.

### FE-02: Hardcoded default version
**File:** `datanode-ui/src/api/study-repository.ts:41`

```typescript
return api.post("/study-repository/packages", { name, version: version || "1.0.0" });
```

The frontend defaults to `"1.0.0"` while the backend defaults to `"latest"` (`StudyRepositoryController.java:104`). These should be consistent.

### FE-03: `useEffect` dependency on `study?.id` and `packageId`
**File:** `datanode-ui/src/studyRepository/components/output-browser-modal.tsx:235`

```typescript
useEffect(() => { ... }, [open, study?.id, packageId])
```

`packageId` is derived from `study.id` (`const packageId = study ? Number(study.id) : 0`), so both `study?.id` and `packageId` change together. This is redundant but harmless.

### FE-04: Download All downloads files sequentially
**File:** `datanode-ui/src/studyRepository/components/output-browser-modal.tsx:291-312`

The "Download All" function downloads files one at a time in a `for` loop. For many files, this is very slow. Consider using `Promise.all` with a concurrency limit, or better yet, implement a server-side zip endpoint.

### FE-05: Non-functional user profile button
**File:** `datanode-ui/src/studyRepository/components/sidebar.tsx:71-76`

The user profile button in the sidebar has no `onClick` handler — it renders but does nothing.

### FE-06: Hardcoded "Researcher" username
**File:** `datanode-ui/src/studyRepository/components/header.tsx:38`

```tsx
<span>Researcher</span>
```

The username is hardcoded as "Researcher" instead of displaying the actual logged-in user.

### FE-07: TypeScript strict mode disabled + build errors ignored

**File:** `datanode-ui/tsconfig.json:32` and `datanode-ui/next.config.js:13`

```json
"strict": false,
```
```javascript
typescript: { ignoreBuildErrors: true },
```

TypeScript strict mode is disabled (`strict: false`, `noImplicitAny: false`) AND the Next.js build ignores TypeScript errors entirely. This means type errors silently reach production — TypeScript provides zero safety.

### FE-08: Dual styling systems (Tailwind + MUI/Emotion)
The frontend uses both Tailwind CSS and Material-UI with Emotion CSS-in-JS. The `studyRepository/` module uses Tailwind + Radix UI while the legacy modules use MUI. This doubles the CSS bundle size and creates inconsistent UX.

### FE-09: `collectFilePaths` function defined but never called
**File:** `datanode-ui/src/studyRepository/components/output-browser-modal.tsx:205-208`

```typescript
function collectFilePaths(file: OutputFile): string[] {
```

This utility function is defined but never used anywhere in the component.

---

## 9. Infrastructure & DevOps Issues

### INFRA-01: Only one GitHub Actions workflow (docs deployment)
**File:** `.github/workflows/deploy-docs.yml`

There is no CI/CD pipeline for building, testing, or deploying the application. No automated tests run on pull requests.

### INFRA-02: SQL migrations use VARCHAR without length limits

**Files in:** `datanode/src/main/resources/db/migration/`

Multiple migrations add `VARCHAR` columns without length constraints:
```sql
ALTER TABLE analyses ADD COLUMN stage VARCHAR;
ALTER TABLE analyses ADD COLUMN error VARCHAR;
ALTER TABLE analyses ADD COLUMN source_folder VARCHAR;
ALTER TABLE environment_descriptor ADD COLUMN type VARCHAR;
```

While PostgreSQL treats unbounded `VARCHAR` efficiently, this allows unlimited data insertion which could cause issues if the app is ever ported to another DBMS.

### INFRA-03: No SQL migration for indexes on foreign keys
The `study_packages`, `study_runs`, and `study_run_result_files` tables likely have foreign key relationships but the migrations don't include explicit indexes. PostgreSQL does not auto-create indexes on foreign keys, leading to slow JOINs at scale.

### INFRA-04: Test keys committed to repository
**File:** `datanode/src/main/resources/testkeys/app.key`

RSA private key is committed to the repository. Even if only for testing, this is a security concern if these keys are accidentally used in production.

### INFRA-05: Dockerfile runs as root with no health check or JVM tuning

**File:** `datanode/Dockerfile`

```dockerfile
USER root
ADD target/datanode.jar /datanode.jar
ENTRYPOINT java -jar datanode.jar
```

Issues: (1) Container runs JVM as root, (2) uses `ADD` instead of `COPY`, (3) deprecated `MAINTAINER` directive, (4) no `HEALTHCHECK`, (5) no JVM memory flags (`-XX:MaxRAMPercentage`), (6) no non-root user created.

### INFRA-06: Flyway migration version anomalies (fake dates)

**Files:** `V20231290000000__*`, `V20231291100000__*`, `V20231292000000__*`

Migration versions use impossible dates (December 90th, 91st, 92nd) to force ordering. While Flyway treats these as sortable strings, it's fragile and confusing. Combined with `validate-on-migrate: false` in application.yml, silent schema drift is possible.

### INFRA-07: `upload` table missing primary key

**File:** `datanode/src/main/resources/db/migration/V20241018000000__upload-dirs.sql`

```sql
CREATE TABLE upload (
  name VARCHAR NOT NULL,
  analysis_id BIGINT NULL REFERENCES analyses(id),
  user_id BIGINT NULL REFERENCES users(id)
);
```

No primary key, no unique constraint, no index. Rows cannot be uniquely identified or efficiently queried.

### INFRA-08: Multiple severely outdated dependencies with known CVEs

Key vulnerable dependencies:
- `commons-compress:1.21` — CVE-2024-25710, CVE-2024-26308
- `tika-core:1.22` (released 2019) — multiple CVEs
- `bcprov-jdk15on:1.67` — known CVEs, artifact is end-of-life
- `json:20170516` (from 2017) — CVE fixes in newer versions
- `google-auth-library:0.20.0` — ancient, 1.x is current
- `guava:30.1-jre` — several versions behind

### INFRA-09: Flyway version mismatch — `flyway-database-postgresql:10.0.0` vs BOM-managed core

**File:** `datanode/pom.xml:173-176`

`flyway-core` uses Spring Boot BOM version (9.x for Boot 3.2.7) but `flyway-database-postgresql` is pinned to `10.0.0`. Major version mismatch may cause runtime errors.

### INFRA-10: `install/docker/datanode.env` committed with credentials

The `.gitignore` only ignores `datanode/config/datanode.env`, not `install/docker/datanode.env`. The latter is committed to git containing DB password and Jasypt encryption password.

### INFRA-11: Insecure Maven repository URL (HTTP)

**File:** `datanode/pom.xml:626-635`

```xml
<url>http://repo.springsource.org/release</url>
```

Uses `http://` (not `https://`), vulnerable to MITM during dependency resolution. The URL has also been dead for years.

### INFRA-12: Makefile `stop` target may leave orphaned processes
Scripts in `scripts/` use `kill` commands that may not clean up all child processes. Consider using process groups or `pkill -P`.

### INFRA-06: No health check endpoint configuration for frontend
The Docker Compose file has a health check for PostgreSQL but not for the application itself. The Spring Actuator dependency is included but no health endpoint is documented.

---

## 10. Positive Observations

1. **Well-structured multi-module Maven project** — Clear separation between commons, backend, frontend, and Docker runner modules.

2. **Good use of Flyway migrations** — 61 ordered migrations with consistent naming conventions.

3. **Comprehensive BDD test scenarios** — Cucumber features (`analysis-status.feature`, `analysis-sync.feature`) cover complex state machine transitions with creative historical science narratives.

4. **Proper JWT implementation** — `JwtTokens` uses Spring Security's `JwtEncoder`, proper claims, configurable expiry, and time-manipulable `Clock` for testing.

5. **Thoughtful error handling architecture** — `ExceptionHandlingAdvice` with error tokens for production debugging is a good pattern.

6. **Optimistic concurrency for code editing** — The `codeToRun` versioning system prevents lost updates during collaborative editing.

7. **Container lifecycle management** — `StudyContainerService` handles creation, reuse, stale container cleanup, and graceful shutdown.

8. **Good use of constructor injection** in newer code (StudyRepositoryController, StudyContainerService) vs field injection in older code.

9. **Frontend API layer is well-typed** — `study-repository.ts` has comprehensive TypeScript types for all DTOs and API functions.

10. **Idempotent container operations** — `stopContainer()` handles already-stopped and already-removed containers gracefully.

---

## Summary of Findings by Severity

| Severity | Count | Key Examples |
|----------|-------|-------------|
| **Critical Bugs** | 5 | Kerberos password→setName, NPE in markExecuted, NPE in toUnsecuredDto, inverted cancel logic, NPE in ensureCancellable |
| **Security** | 12 | Hardcoded JWT secret, broken Jasypt encryption, docker-runner no auth, CSRF+cookie JWT, auth bypass default, callback passwords in URLs, cleartext token, path traversal |
| **High** | 8 | Missing @PathVariable, Files.copy bug, unrestricted containers, thread leak, temp file leak, UUID not set, Boolean ==, weak DB creds |
| **Medium** | 9 | N+1 Docker queries, silent exception swallowing, missing auth on keytab delete, wrong comment (Argon2/BCrypt), pagination bypass |
| **Low** | 7 | Inconsistent DI, Map returns, hardcoded strings, missing stack traces, double semicolons |
| **Dead Code** | 6 | Unused executor, suppressed fields, TODO stubs, deprecated fields still used |
| **Frontend** | 9 | TS strict disabled + errors ignored, hardcoded username, missing error handling, dual styling, dead function |
| **Infra** | 14 | No CI/CD, Dockerfile as root, Flyway version mismatch, outdated CVE deps, committed credentials, dead Maven repos |

**Total: 70 findings**

---

## Recommended Priority Actions

### Immediate (before any deployment)
1. **Fix SEC-09** — Remove hardcoded JWT secret; require via env var with no default
2. **Fix SEC-10** — Replace broken Jasypt algorithm; remove committed encryption password
3. **Fix SEC-11** — Add authentication to docker-runner
4. **Fix SEC-12** — Change default `loginDisabled` to `false`
5. **Fix BUG-01** — Kerberos password → setName data corruption

### High Priority (before production use)
6. **Fix BUG-02** — NPE in markExecuted crashes result processing
7. **Fix BUG-05** — NPE in toUnsecuredDto crashes non-Kerberos data sources
8. **Fix HIGH-02** — Missing @PathVariable makes endpoint non-functional
9. **Fix HIGH-04** — Files.copy target will throw at runtime
10. **Fix SEC-02** — Add Secure flag to JWT cookie
11. **Fix SEC-03** — Move callback password out of URL
12. **Fix INFRA-08** — Update dependencies with known CVEs

### Important (code quality & reliability)
13. **Fix HIGH-06** — UUID not set on DataSource create
14. **Fix SEC-08** — Stateless + OAuth2 conflict causes intermittent login failures
15. **Fix FE-07** — Enable TypeScript strict mode and build error checking
16. **Add CI/CD pipeline** (INFRA-01) — foundational for code quality
17. **Add container resource limits** (HIGH-01) — before running untrusted study images
18. **Fix INFRA-05** — Dockerfile: non-root user, HEALTHCHECK, JVM tuning
