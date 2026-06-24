# Four-VM Arachne Deployment

Use this for the demo layout with:

- 1 Central VM
- 3 DataNode VMs

The same deployment bundle can be copied to all four VMs. The VM role is chosen by which script you run.

## Build The Bundle

From the repository root:

```sh
install/docker/package-deployment-bundle.sh
```

This creates:

```text
install/docker/dist/arachne-local-deployment.tar.gz
```

The default bundle includes:

- Central and DataNode Docker Compose files
- DataNode local image tar
- CDM PostgreSQL 16 local image tar
- CDM Docker build context
- Central registration scripts
- federated worker scripts
- worker env examples for three DataNodes
- smoke/demo SQL submissions

It does not include CDM database contents, Athena vocabulary zips, existing Docker volumes, or Central/DataNode database state.

## Optional Larger Bundle

For VMs with unreliable internet, include upstream images too:

```sh
INCLUDE_UPSTREAM_IMAGES=true install/docker/package-deployment-bundle.sh
```

That also saves:

- `postgres:15.5-alpine`
- `odysseusinc/execution_engine:2.7.1`
- `odysseusinc/arachne-central-ce:latest`
- `odysseusinc/r-hades:latest`

## Central VM

Copy and extract the bundle:

```sh
tar -xzf arachne-local-deployment.tar.gz
cd arachne-local-deployment
```

Start Central:

```sh
./start-central.sh
```

Open:

```text
https://CENTRAL_VM_IP:8443
```

Login:

- `admin@odysseusinc.com` / `password`

## Each DataNode VM

Copy and extract the same bundle:

```sh
tar -xzf arachne-local-deployment.tar.gz
cd arachne-local-deployment
```

Start DataNode:

```sh
./start-datanode.sh
```

If the VM has an existing PostgreSQL data directory for the CDM, map it before startup:

```sh
CDM_POSTGRES_DATA=/data/arachne-cdm-postgres ./start-datanode.sh
```

Register the DataNode with Central. Use a unique name for each VM:

```sh
CENTRAL_URL=https://CENTRAL_VM_IP:8443 CENTRAL_DATANODE_NAME="Site 1 DataNode" ./register-datanode.sh
```

Repeat with `Site 2 DataNode` and `Site 3 DataNode` on the other DataNode VMs.

Open:

```text
http://DATANODE_VM_IP:8080
```

Login:

- `admin` / `ohdsi`

## Workers On Central VM

On the Central VM, create one worker env file per DataNode:

```sh
cp workers/site1.env.example workers/site1.env
cp workers/site2.env.example workers/site2.env
cp workers/site3.env.example workers/site3.env
```

Edit each file:

- `CENTRAL_URL=https://CENTRAL_VM_IP:8443`
- `CENTRAL_DATANODE_NAME=Site N DataNode`
- `DATANODE_URL=http://DATANODE_N_VM_IP:8080`
- `DATANODE_DATASOURCE_ID=1`

Start all configured workers:

```sh
./start-workers.sh
```

Logs are written to `logs/site1.log`, `logs/site2.log`, and `logs/site3.log`.
Stop workers with:

```sh
./stop-workers.sh
```

You can also run a single worker in the foreground:

```sh
./run-worker.sh workers/site1.env
```

## Demo Flow

1. Central user creates a `Custom` analysis.
2. Central user uploads an executable SQL file.
3. Central user submits it to one or more DataNode datasources.
4. The matching Central-side worker stages it on the target DataNode.
5. DataNode admin logs into their DataNode and approves or rejects it.
6. Approved analyses run against that DataNode VM's own CDM Postgres data.
7. The worker uploads results back to Central.

## CDM Database

Each DataNode VM owns its own CDM Postgres data.

Default Docker volume:

```text
arachne-cdm-pg-data:/var/lib/postgresql/data
```

Host-directory override:

```sh
CDM_POSTGRES_DATA=/data/arachne-cdm-postgres ./start-datanode.sh
```

Connection details from the DataNode VM:

- Host: `127.0.0.1`
- Port: `5435`
- Database: `cdm54`
- Schema: `omop`
- User: `cdm-user`
- Password: `cdm-password`
