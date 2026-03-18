# Installation

This page covers **technical details** for installing and configuring Arachne (datanode and related components) so you can use the Study Repository.

---

## Prerequisites

- **Docker** installed and running on the machine where studies will run.
  Arachne Study Repository depends on Docker for pull/start/execute flows. The backend now fails fast at startup when Docker daemon is unreachable (default behavior via `datanode.studyRepository.requireDocker=true`).
- **Java 17**.
  The Maven build targets Java 17. On machines with multiple JDKs installed, the project scripts and `Makefile` now prefer `openjdk@17` when available.
- **Node.js/npm** (or equivalent) if you build the datanode UI from source.

---

## Building from source

1. **Clone the repository** and open the project root.

2. **Build the full stack** (recommended so local modules are installed first):
   ```bash
   mvn clean install
   ```
   From the project root, this builds `arachne-commons`, `execution-engine-commons`, `datanode-ui`, and the datanode. If external repos (OHDSI, Redshift) are required, see `docs/REPOSITORY-ARTIFACTS.md` in the repository.

3. **Run the datanode:**
   - From `datanode/`: run the Spring Boot application (e.g. via your IDE or `mvn spring-boot:run`).
   - Or use the **Docker Compose** setup under `install/docker/` (see below).

---

## Docker Compose (optional)

For a full stack run including database and services:

- Use the Compose file and env files in **`install/docker/`**.
- Copy `datanode.env.example` to `datanode.env` and set variables as needed.
- Ensure the host has Docker available for the Study Repository (pulling and running study images).

See `install/docker/README.md` for exact commands and port mapping.

---

## Configuration relevant to Study Repository

- **Study catalog (registry) URL**  
  Set in Arachne under **Settings** (or via system setting `study.repo.registryUrl` / equivalent). This is the Docker registry used as the study catalog.

- **Docker access**  
  The backend (datanode or a dedicated study runner) must be able to run `docker pull` and `docker run` against the configured registry. If the registry is private, configure registry credentials (e.g. in system settings or environment).

- **Execution**  
  Study execution may be handled by the datanode (with Docker client access) or by a separate minimal runner process; see `docs/MINIMAL_DOCKER_EXECUTION_DESIGN.md` in the repository for design options.

---

## Verifying installation

1. Start the datanode (and UI).
2. Log in and open **Settings**; set the **Study catalog address** to your Docker registry URL and save.
3. In Arachne, open **Study Repository**; you should see the list of installed studies (initially empty). Use **Install** with a study name from the catalog to pull your first study.

If pulls or runs fail, check Docker daemon access, registry URL, and credentials.

From the repo root, you can also run:

```bash
make env-test
make install-test
```

Both commands now fail fast when Docker is unavailable, so they are useful as hard preflight checks for production-like local environments.

If you need to run non-Docker unit tests in a special environment, you can explicitly disable startup enforcement with `datanode.studyRepository.requireDocker=false` (not recommended for real deployments).
