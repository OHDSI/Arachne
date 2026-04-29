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
3. Run docker copose command:
```commandline
docker compose -d up
```
4. Open browser and navigate to `http://localhost:8080`
5. The default credentials are:
- Username: admin
- Password: ohdsi

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
   

