# Artifacts Required from External Repositories

When these repositories are unreachable (timeout/blocked), Maven cannot download the artifacts listed below. Build from the **project root** so local modules (`datanode-ui`, `arachne-commons`, `execution-engine-commons`, etc.) are built first; only the **OHDSI** and **Redshift** artifacts must come from remote repos.

---

## OHDSI (repo.ohdsi.org)

Used for OHDSI libraries. **All of these are required** for a full backend build.

| groupId        | artifactId                    | version   | Repo (releases / thirdparty / snapshots) |
|---------------|--------------------------------|-----------|------------------------------------------|
| org.ohdsi.sql | SqlRender                     | 1.9.0     | releases                                 |
| org.ohdsi     | circe                         | 1.9.4     | releases                                 |
| org.ohdsi     | hydra                         | 0.2.0     | releases                                 |
| org.ohdsi     | standardized-analysis-specs   | 1.3.1     | releases                                 |
| org.ohdsi     | standardized-analysis-utils  | 1.4.0     | releases                                 |
| org.ohdsi     | authenticator                 | 0.0.3-QA  | releases or snapshots                     |

Some **JDBC drivers** may also be resolved from OHDSI thirdparty (if not on Maven Central):

- `net.sourceforge.jtds:jtds` (SQL Server)
- `mysql:mysql-connector-java`
- `com.microsoft.sqlserver:sqljdbc4`
- `com.oracle:ojdbc6`

---

## Odysseus (nexus.odysseusinc.com)

Used for `com.odysseusinc.arachne` artifacts. **Most are built locally** when you build from the repo root.

| groupId                 | artifactId           | version      | Notes                          |
|-------------------------|----------------------|--------------|--------------------------------|
| com.odysseusinc.arachne | datanode-ui          | 2.x-SNAPSHOT | **Built locally** (datanode-ui) |
| com.odysseusinc.arachne | arachne-commons      | 2.x-SNAPSHOT | **Built locally** (commons)     |
| com.odysseusinc.arachne | arachne-common-types | 2.x-SNAPSHOT | **Built locally** (commons)     |
| com.odysseusinc.arachne | arachne-sys-settings | 2.x-SNAPSHOT | **Built locally** (commons)     |
| com.odysseusinc.arachne | execution-engine-commons | 2.x-SNAPSHOT | **Built locally** (executionengine/commons) |

The full Execution Engine application has been removed. execution-engine-commons is built from `commons/execution-engine-commons/` (used by datanode and docker-runner).

---

## Redshift (s3.amazonaws.com/redshift-maven-repository)

The Redshift repository is declared in `datanode/pom.xml`. The **exact artifact** that requires it is often a **transitive dependency** (e.g. Amazon Redshift JDBC driver). To see which dependency pulls it in:

```bash
cd datanode
mvn dependency:tree -Dverbose | grep -i redshift
```

Or:

```bash
mvn dependency:tree | grep -E "redshift|amazon"
```

If the build fails when Redshift repo is down, the dependency tree output will show the missing artifact (groupId:artifactId:version).

---

## What you can do when repos are down

1. **Build from root**  
   `mvn install` from the project root so all in-tree modules (including `datanode-ui` and `execution-engine-commons`) are installed to your local `~/.m2`. That removes the need for Odysseus for all Arachne artifacts.

2. **OHDSI / Redshift**  
   There is no in-tree replacement. You need the repos to be reachable, or to obtain the same artifacts (e.g. OHDSI JARs, Redshift JDBC) from another source and install them locally with `mvn install:install-file`.

3. **Check reachability**  
   Run `./scripts/check-repos.sh` to see which repos are currently reachable.
