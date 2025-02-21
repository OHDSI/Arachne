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

To run from IDE, add the following unger "Program arguments"
`--spring.config.additional-location=file:config/config-dev.yml`

In either case, configuration file `config/config-dev.yml` will be used. 
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
