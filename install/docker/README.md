# Installation with Docker

This folder contains ARACHNE DataNode deployment scripts for released versions.

## Prerequisites 
* Installed Docker 
  * Windows - https://docs.docker.com/desktop/install/windows-install/
  * Linux - https://docs.docker.com/desktop/install/linux-install/
  * Mac - https://docs.docker.com/desktop/install/mac-install/
* Enabled "Hyper-V Windows Features" for Windows systems

### Deployment steps
1. Clone the repository
2. Navigate to local repository directory `install/docker` in console
3. Run docker compose command:
```commandline
docker compose up -d
```
4. Open browser and navigate to `http://localhost:8080`
5. The default credentials are:
- Username: admin
- Password: ohdsi

## Included Arachne Central service

This compose stack also includes Arachne Central Community Edition from the public `odysseusinc/arachne-central-ce:latest` image.

- Central UI/API: `https://localhost:8443` or `https://127.0.0.1:8443`
- Central bundled PostgreSQL from your machine: `127.0.0.1:5436`
- Central bundled Solr from your machine: `127.0.0.1:8983`

The Central image starts its own PostgreSQL, Solr, ClamAV and LibreOffice inside the same container. Its data persists in named Docker volumes:

- `arachne-central-postgres-data`
- `arachne-central-postgres-config`
- `arachne-central-postgres-logs`
- `arachne-central-files`
- `arachne-central-solr-data`
- `arachne-central-clamav-data`

The Central container uses `JASYPT_ENCRYPTOR_PASSWORD=arachne`, which is required by the bundled encrypted datasource password. The portal whitelist is configured for local browser access and the local DataNode service.

### Registering the local DataNode in Central

After the stack is running, register the local DataNode and its `Local CDM` datasource in Central:

```commandline
./register-local-central.sh
```

The script logs in to Central with the seeded admin account, creates `Local Docker DataNode` and `Local CDM` if they do not already exist, and links the local DataNode datasource to Central's datasource id.

DataNode is configured with `datanode.runMode=NETWORK` for this compose stack so Central can treat it as a network DataNode.

### Running local federated submissions

This repository's local DataNode app can execute submissions, but it does not include the original Central polling worker. For local federated testing, run the bridge worker from the host while the compose stack is up:

```commandline
./federated-worker.sh
```

The worker:

- polls Central for pending submissions assigned to `Local Docker DataNode`
- downloads the Central submission group archive
- maps the Central datasource id to the local DataNode datasource through `datasource.central_id`
- stages the archive in DataNode as a Central-origin submission with `PENDING_APPROVAL`
- waits until a DataNode admin approves or rejects the submission
- uploads completed DataNode result files back into Central
- marks successful Central submissions as `EXECUTED`, which Central displays as `AWAITING APPROVAL (SUCCESS)`
- marks rejected or failed Central submissions as `FAILED`

For multiple local DataNodes, run one worker per DataNode and set:

```commandline
CENTRAL_DATANODE_NAME="My DataNode Name" DATANODE_URL=http://localhost:8081 ./federated-worker.sh
```

For a one-shot poll, useful in smoke tests:

```commandline
RUN_ONCE=true ./federated-worker.sh
```

The default local credentials are:

- Central: `admin@odysseusinc.com` / `password`
- DataNode: `admin` / `ohdsi`

The normal UI flow is:

1. Log in to Central at `https://localhost:8443`.
2. Open or create a workspace/study.
3. Add `Local CDM` as a datasource.
4. Create a `Custom` analysis and upload an executable query file, for example `run.sql`.
5. Submit the analysis to `Local CDM`.
6. Keep `./federated-worker.sh` running until the submission appears in DataNode as `Pending approval`.
7. Log in to DataNode at `http://localhost:8080`.
8. Open Submissions and approve or reject the Central-origin submission.
9. Keep `./federated-worker.sh` running until approved submissions reach `AWAITING APPROVAL (SUCCESS)` in Central.

### ATLAS cohort to Arachne package

For a no-code cohort demo, the analyst builds the cohort in ATLAS and exports the generated cohort SQL. A local packaging helper wraps that SQL in a reusable HADES runner that returns aggregate CSV outputs to Central.

```commandline
./build-atlas-cohort-analysis.py \
  --cohort-sql /path/to/atlas-exported-cohort.sql \
  --cohort-id 3 \
  --name "Blood EHR Cohort Summary"
```

Upload the generated zip from `atlas-cohort-packages/` to Central as a `Files in archive` / `CUSTOM` analysis. The package writes cohort membership to `results.cohort` on each DataNode and returns aggregate files under `my_results/`; it does not export patient-level rows.

## Included local OMOP CDM database

This compose stack now also includes a local PostgreSQL database with an empty OMOP CDM v5.4 schema.

- Host from your machine: `127.0.0.1`
- Port: `5435`
- Database: `cdm54`
- Schema: `omop`
- Username: `cdm-user`
- Password: `cdm-password`

When configuring this datasource inside Arachne, use the service hostname from inside Docker:

- JDBC URL: `jdbc:postgresql://arachne-cdm-postgres:5432/cdm54`
- DBMS type: `PostgreSQL`
- CDM schema: `omop`
- Username: `cdm-user`
- Password: `cdm-password`

The CDM schema is created on first startup by downloading the official OHDSI CommonDataModel v5.4.2 PostgreSQL DDLs. The bootstrap also creates the `microbiology_infection` and `microbiology_test` extension tables in the same schema.

The database contents persist across `docker compose down` because Postgres uses the named volume `arachne-cdm-pg-data`. To force a fresh CDM instance and rerun initialization from scratch, remove that volume:

```commandline
docker compose down -v
```

### Loading vocabularies and demo patients

Full OMOP vocabularies are not bundled here. Download an Athena vocabulary zip yourself and place it in:

- `install/docker/cdm-imports/athena/`

Then rebuild the CDM container image and recreate the service:

```commandline
docker compose up -d --build --force-recreate arachne-cdm-postgres
```

Import the Athena vocabulary:

```commandline
docker compose exec arachne-cdm-postgres /opt/arachne-cdm/tools/load-athena-vocab.sh
```

After the vocabulary is loaded, you can seed a few synthetic demo patients:

```commandline
docker compose exec arachne-cdm-postgres /opt/arachne-cdm/tools/load-sample-patients.sh
```

This demo patient seed is intentionally tiny. It is only for smoke testing the stack.
   
