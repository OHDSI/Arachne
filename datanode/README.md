# DataNode

### Prerequisites
To build and run the Data Node, please install the following applications:

- [Apache Maven 3](https://maven.apache.org/download.cgi)
- [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [PostgreSQL 15.5](https://www.postgresql.org/download/)

## Running locally

To launch from maven, use the following command line 
```
mvn spring-boot:run
```

To run from IDE, add the following under "Program arguments"
`--spring.config.additional-location=file:config/config-dev.yml,optional:file:config/config-local.yml`

In either case, `config/config-dev.yml` is used. An optional **git-ignored** `config/config-local.yml` is loaded if present (copy from `config/config-local.example.yml` to set local overrides and secrets, e.g. Study Repository default registry URL and token). Alternatively, put `ARACHNE_DOCKER_REGISTRY_TOKEN` and optionally `ARACHNE_DOCKER_REGISTRY_URL` in `config/datanode.env` (git-ignored; copy from `config/datanode.env.example`); when using `make run-backend`, that file is sourced so the app receives the variables.

Example `config/datanode.env.example`:

```bash
# DataNode local environment variables (git-ignored).
# Copy to datanode.env in this directory. Source before running: source config/datanode.env
# Or use config-local.yml (copy from config-local.example.yml) to set the same values in YAML.
#
# Study Repository default token (picked up by application.yml when set)
# ARACHNE_DOCKER_REGISTRY_TOKEN=your-registry-token
# ARACHNE_DOCKER_REGISTRY_URL=https://registry.example.com
``` 
It assumes that application database 'datanode' is available on `localhost:5432` for user 'ohdsi' granted permissions to use it.
If this is not your case, make sure to update connection properties or create a separate configuration file and specify it
via `--spring.config.additional-location`

## Important Configuration Properties

| Property                     | Default Value                 | Descrition                                                                                            |
|------------------------------|-------------------------------|-------------------------------------------------------------------------------------------------------|
| `files.store.path`           | `/var/arachne/files`          | Location to store files. In case of docker container, must be mounted to ensure files are persisted   |
| `spring.datasource.url`      | -                             | Application database JDBC connection string                                                           |
| `spring.datasource.username` | -                             | Application database username                                                                         |
| `spring.datasource.password` | -                             | Application database password                                                                         |
| `docker.host`                | `unix:///var/run/docker.sock` | Docker host url, used to manipulate docker containers (e.g. Achilles). Default is only good for local |
