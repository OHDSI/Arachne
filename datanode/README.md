# ArachneNodeAPI
Arachne Data Node is a component that facilitates connection and communication between local databases and Arachne Central

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


## Installation
### Prerequisites
For building and run the Data Node please install following applications:
- [Apache Maven 3](https://maven.apache.org/download.cgi)
- [JDK8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)
- [Postgres DBMS 9.6+](https://www.postgresql.org/download/)

## Running with Authenticator in a standalone mode

- Create database to store users (or use another authentication provided by Authenticator)
- Create users table and populate it (or use database from the ArachneCentralAPI)
- Apply create if not exists user registration strategy by (see about strategies below)
```
-Dauthenticator.user.registrationStrategy=CREATE_IF_NOT_EXISTS
```
- Run application applying the following parameters:

```
-Dauthenticator.methods.db.service=org.ohdsi.authenticator.service.jdbc.JdbcAuthService
-Dauthenticator.methods.db.config.jdbcUrl=jdbc:postgresql://localhost:5432/arachne_portal
-Dauthenticator.methods.db.config.username=user
-Dauthenticator.methods.db.config.password=secret
-Dauthenticator.methods.db.config.query="select password, id, firstname, lastname, email from users_data where email=:username"
-Dauthenticator.methods.db.config.passwordEncoder=org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
-Dauthenticator.methods.db.config.fieldsToExtract.firstName=firstname
-Dauthenticator.methods.db.config.fieldsToExtract.lastName=lastname
-Dauthenticator.methods.db.config.fieldsToExtract.id=T(com.odysseusinc.arachne.commons.utils.UserIdUtils).idToUuid(T(java.lang.Long).valueOf(id))
-Dauthenticator.methods.db.config.fieldsToExtract.email=email
-Dsecurity.method=db
```

## Stand-alone mode

The configuration parameter `datanode.runMode` is used to set Data Node running mode.
There are two value supported:
- **NETWORK** which is default, sets running in network mode and requires communication with *Central*
- **STANDALONE** sets running in standalone mode when communication with *Central* is not supported
and some functions become unavailable

### Features disabled in Stand-alone mode
- All operations related to Atlas
- Data Source publishing
- Removal of Data Sources of Data Sources which have been published before
- Import and Re-import of Achilles results
- Adding new users from Central

**Note:** it's prohibited to switch from *Standalone* to *Network* mode when there are some
offline entities, such as users, has been created in standalone mode. 

## User registration strategies

There are two user registration strategies:
- **CREATE_IF_FIRST** - means first user succcesfully logged in registered by system 
and became Data Node administrator. Other users should be added by administrator manually
using Admin section.
- **CREATE_IF_NOT_EXISTS** - means any user who logged in would be registered if one's not
registered before. This useful when using external authentication source like Active Directory.
When external authentication source is used then Admin page could not be used to add users
since don't know where to find users.  