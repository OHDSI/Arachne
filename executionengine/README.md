# Execution Engine Commons

This directory contains only **execution-engine-commons**: shared DTOs and types for the execution contract between the Data Node and any execution runner.

- **Used by:** Data Node and [docker-runner](../docker-runner/README.md) (the minimal Docker-only runner in this repo).
- **Artifact:** `com.odysseusinc.arachne:execution-engine-commons`

The full Execution Engine application (SQL/R/tarball) has been removed from this project. For running analyses, use the in-repo [docker-runner](../docker-runner/README.md).

## Build

From the repository root:

```bash
mvn -pl executionengine/commons install -DskipTests
```

Or build with dependents:

```bash
mvn -pl executionengine/commons,docker-runner,datanode -am install -DskipTests
```
