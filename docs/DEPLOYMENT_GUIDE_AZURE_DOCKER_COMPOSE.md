# Deployment Guide: Arachne DataNode to Production (Docker Compose + Azure)

This guide walks through deploying the full Arachne app (DataNode + Study Repository, optional docker-runner) to **production on Azure** using **Docker Compose**. It covers Azure resources, building and pushing images, production Compose configuration, and step-by-step commands.

---

## 1. Overview

### What gets deployed

| Component | Role | In Compose |
|-----------|------|------------|
| **PostgreSQL** | Database (auth, analyses, study_packages, study_runs, settings) | `arachne-datanode-postgres` |
| **Arachne DataNode** | Backend API + embedded UI (port 8080); talks to DB and optional execution engine | `arachne-datanode` |
| **Docker Runner** (optional) | Minimal execution engine: runs study containers, callbacks to DataNode | `arachne-docker-runner` |

The DataNode JAR already includes the built datanode-ui; a single DataNode container serves both API and UI.

### Azure options for running Compose

| Option | Best for | Notes |
|--------|----------|--------|
| **Azure VM (Linux) + Docker + Compose** | Full control, Docker socket for runner | Recommended when you need the docker-runner to run study containers on the same host. |
| **Azure Container Apps (Compose)** | Managed containers, no VM | DataNode + Postgres work; docker-runner needs Docker socket, so not suitable for running studies unless you run the runner elsewhere. |
| **Azure Container Registry (ACR)** | All options | Use ACR to store your built images and pull from VM or Container Apps. |

This guide uses **Azure Container Registry** plus **an Azure Linux VM with Docker and Docker Compose** so that the docker-runner can access the host Docker daemon to run study containers.

---

## 2. Prerequisites

- **Azure CLI** ([Install](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)) logged in: `az login`
- **Docker** and **Docker Compose** (v2) on your build machine (to build and push images)
- **Git** (to clone the repo)
- **Maven** and **Java 17** (to build DataNode and docker-runner JARs if building from source)

---

## 3. Azure setup

### 3.1 Create a resource group

```bash
export RESOURCE_GROUP=arachne-prod-rg
export LOCATION=eastus

az group create --name $RESOURCE_GROUP --location $LOCATION
```

### 3.2 Create Azure Container Registry (ACR)

```bash
export ACR_NAME=arachneprodacr   # must be globally unique, alphanumeric only

az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Standard \
  --admin-enabled true
```

Get ACR login server and credentials (used later to push/pull images):

```bash
export ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query loginServer -o tsv)
export ACR_USER=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query username -o tsv)
export ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "passwords[0].value" -o tsv)

echo "ACR_LOGIN_SERVER=$ACR_LOGIN_SERVER"
```

### 3.3 (Optional) Azure Database for PostgreSQL

For production you may prefer a managed database instead of Postgres in Docker.

- Create a server and database: [Azure Database for PostgreSQL - Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/quickstart-create-server-portal).
- Note: **Host**, **Database name**, **User**, **Password**, **Port** (usually 5432).
- Configure firewall to allow your VM (or VNet) and, if needed, Azure services.

Skip this if you want to run PostgreSQL as a container on the VM (simpler; data is on the VM disk).

### 3.4 Create an Azure Linux VM (for Docker Compose + runner)

Use a VM size that has enough memory for Postgres, DataNode, and the docker-runner (e.g. Standard_D2s_v3 or larger).

```bash
export VM_NAME=arachne-vm
export VM_IMAGE=Ubuntu2204
export VM_SIZE=Standard_D2s_v3
export ADMIN_USER=azureuser

az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --image $VM_IMAGE \
  --size $VM_SIZE \
  --admin-username $ADMIN_USER \
  --generate-ssh-keys \
  --public-ip-sku Standard
```

Open port 8080 (and 22 for SSH) so you can reach the DataNode:

```bash
az vm open-port --resource-group $RESOURCE_GROUP --name $VM_NAME --port 8080 --priority 1000
az vm open-port --resource-group $RESOURCE_GROUP --name $VM_NAME --port 22 --priority 1010
```

Get the VM public IP:

```bash
az vm show -d --resource-group $RESOURCE_GROUP --name $VM_NAME --query publicIps -o tsv
```

SSH into the VM to install Docker and Docker Compose (see Section 5).

---

## 4. Build and push Docker images

Build and push from your **build machine** (where the repo and Maven are).

### 4.1 Clone and build from source

```bash
git clone <your-repo-url> arachne && cd arachne
```

Build the DataNode (includes datanode-ui) and the docker-runner:

```bash
# DataNode JAR (includes UI)
mvn -q clean package -DskipTests -pl datanode -am

# Docker-runner JAR
mvn -q package -DskipTests -pl commons/execution-engine-commons,docker-runner -am
```

### 4.2 Build Docker images

**DataNode image** (from repo root; datanode/Dockerfile expects `target/datanode.jar`):

```bash
docker build -t $ACR_LOGIN_SERVER/arachne-datanode:latest -f datanode/Dockerfile datanode
```

**Docker-runner image** – the repo has no Dockerfile for the runner; create one and build. Example:

```bash
# Create docker-runner/Dockerfile (see below), then:
docker build -t $ACR_LOGIN_SERVER/arachne-docker-runner:latest docker-runner
```

Example **docker-runner/Dockerfile**:

```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
# Build with: mvn -q package -DskipTests -pl commons/execution-engine-commons,docker-runner -am
COPY target/docker-runner-*.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build the runner JAR first (from repo root), then from `docker-runner/`:

```bash
# From repo root
mvn -q package -DskipTests -pl commons/execution-engine-commons,docker-runner -am

# Copy JAR into docker-runner for Docker build (or use multi-stage build)
cp docker-runner/target/docker-runner-*.jar docker-runner/

# Build image (from repo root, context docker-runner)
docker build -t $ACR_LOGIN_SERVER/arachne-docker-runner:latest -f docker-runner/Dockerfile docker-runner
```

(Alternatively use a multi-stage Dockerfile in `docker-runner/` that runs Maven inside the build stage.)

### 4.3 Log in to ACR and push

```bash
docker login $ACR_LOGIN_SERVER -u $ACR_USER -p $ACR_PASSWORD

docker push $ACR_LOGIN_SERVER/arachne-datanode:latest
docker push $ACR_LOGIN_SERVER/arachne-docker-runner:latest
```

PostgreSQL uses the official image; no need to push it to ACR unless you want to use your own.

---

## 5. VM setup: Docker and Docker Compose

SSH into the VM (use the public IP from Section 3.4):

```bash
ssh $ADMIN_USER@<VM_PUBLIC_IP>
```

On the VM, install Docker and Docker Compose (example for Ubuntu 22.04):

```bash
# Docker
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
# Log out and back in for group to apply, or run next commands with sudo
```

Verify:

```bash
docker --version
docker compose version
```

Log in to ACR from the VM so it can pull your images:

```bash
az acr login --name $ACR_NAME
# Or: docker login <ACR_LOGIN_SERVER> -u <ACR_USER> -p <ACR_PASSWORD>
```

(If Azure CLI is not installed on the VM, use `docker login` with ACR credentials.)

---

## 6. Production Docker Compose and configuration

On the VM, create a directory for deployment (e.g. `/opt/arachne` or `~/arachne-deploy`) and add the following files.

### 6.1 Production docker-compose file

Save as `docker-compose.yml` (adjust image names and env file name as needed):

```yaml
version: '3'
services:
  arachne-datanode-postgres:
    image: postgres:15.5-alpine
    pull_policy: always
    container_name: arachne-datanode-postgres
    restart: always
    logging:
      options:
        max-size: 100m
    shm_size: "4g"
    networks:
      - arachne-network
    volumes:
      - arachne-pg-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-ohdsi-user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-arachne_datanode}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-ohdsi-user} -d ${POSTGRES_DB:-arachne_datanode}"]
      interval: 5s
      timeout: 5s
      retries: 5

  arachne-datanode:
    image: ${ACR_LOGIN_SERVER}/arachne-datanode:latest
    pull_policy: always
    container_name: arachne-datanode
    platform: linux/amd64
    restart: always
    networks:
      - arachne-network
    ports:
      - "8080:8080"
    volumes:
      - arachne-datanode-files:/var/arachne/files
    env_file:
      - datanode.env
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://arachne-datanode-postgres:5432/${POSTGRES_DB:-arachne_datanode}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-ohdsi-user}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      DATANODE_BASE_URL: ${DATANODE_BASE_URL:-http://localhost:8080}
    depends_on:
      arachne-datanode-postgres:
        condition: service_healthy

  arachne-docker-runner:
    image: ${ACR_LOGIN_SERVER}/arachne-docker-runner:latest
    pull_policy: always
    container_name: arachne-docker-runner
    platform: linux/amd64
    restart: always
    networks:
      - arachne-network
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - runner-exec:/tmp/docker-runner-executions
    environment:
      SERVER_PORT: 8888
      ANALYSIS_DIR: /tmp/docker-runner-executions
      ANALYSIS_MOUNT: /tmp/docker-runner-executions
      DOCKER_HOST: unix:///var/run/docker.sock
    # No port published if only datanode talks to runner; if you need external access, add: ports: - "8888:8888"

volumes:
  arachne-pg-data:
  arachne-datanode-files:
  runner-exec:

networks:
  arachne-network:
```

If you use **Azure Database for PostgreSQL** instead of the Postgres container:

- Remove the `arachne-datanode-postgres` service.
- Set in `datanode.env`: `spring.datasource.url=jdbc:postgresql://<your-azure-pg-host>:5432/<db>`, plus username/password.
- Remove `depends_on` for postgres from `arachne-datanode` (or keep a small init container that just waits for the DB).

### 6.2 Environment file

Copy the example and edit. Create `datanode.env` (and optionally `.env` for Compose variables):

**datanode.env** (required variables at least):

```bash
# Database (use these if not overriding via docker-compose environment)
spring.datasource.url=jdbc:postgresql://arachne-datanode-postgres:5432/arachne_datanode
spring.datasource.username=ohdsi-user
spring.datasource.password=<STRONG_PASSWORD>
spring.datasource.driver-class-name=org.postgresql.Driver

# DataNode base URL as seen by users (replace with your VM public IP or domain)
datanode.baseURL=https://your-domain.com
datanode.port=8080
server.ssl.enabled=false

# Admin user (created on first start if not present)
datanode.users.admin.email=admin@your-domain.com
datanode.users.admin.firstName=Admin
datanode.users.admin.lastName=User
datanode.users.admin.password=<ADMIN_PASSWORD>
datanode.users.admin.roles=ADMIN

# Execution engine = docker-runner (same Docker network)
executionEngine.protocol=http
executionEngine.host=arachne-docker-runner
executionEngine.port=8888
executionEngine.token=

# Study Repository (optional defaults; can override in UI Settings)
# datanode.studyRepository.defaultRegistryUrl=
# ARACHNE_DOCKER_REGISTRY_TOKEN=
```

**.env** (for Compose; do not commit secrets):

```bash
ACR_LOGIN_SERVER=arachneprodacr.azurecr.io
POSTGRES_PASSWORD=<STRONG_PASSWORD>
POSTGRES_USER=ohdsi-user
POSTGRES_DB=arachne_datanode
DATANODE_BASE_URL=https://your-domain.com
```

Use strong, unique passwords and restrict access to these files (`chmod 600 datanode.env .env`).

---

## 7. Deploy and run

On the VM, in the directory containing `docker-compose.yml` and `datanode.env`:

```bash
# Pull latest images
docker compose pull

# Start all services
docker compose up -d

# Check status
docker compose ps
docker compose logs -f arachne-datanode
```

Open `http://<VM_PUBLIC_IP>:8080` in a browser. Log in with the admin credentials from `datanode.env`. Configure **Settings** (e.g. Study catalog address) and use **Study Repository** as needed.

---

## 8. SSL/TLS (HTTPS) in production

Exposing the app on port 8080 over HTTP is fine for testing; for production you should put the DataNode behind HTTPS.

### Option A: Reverse proxy on the same VM (e.g. Nginx + Let’s Encrypt)

1. Install Nginx and Certbot on the VM.
2. Point a domain (e.g. `arachne.yourdomain.com`) to the VM’s public IP.
3. Configure Nginx as a reverse proxy to `http://127.0.0.1:8080` and use Certbot for a TLS certificate.
4. Set `datanode.baseURL=https://arachne.yourdomain.com` and, if you use redirects, ensure the backend trusts the proxy (e.g. `X-Forwarded-*` headers).

### Option B: Azure Application Gateway

Put Application Gateway in front of the VM, terminate TLS at the gateway, and forward to the VM on port 8080. Set `datanode.baseURL` to the gateway’s public URL.

### Option C: Azure Front Door / CDN

Similar idea: Front Door terminates HTTPS and routes to the VM (or to a load balancer in front of the VM).

After enabling HTTPS, set `datanode.baseURL` to the public HTTPS URL and consider enabling `server.ssl.enabled` only if the DataNode itself serves TLS (usually the reverse proxy handles TLS).

---

## 9. Steps summary

| # | Step | Where |
|---|------|--------|
| 1 | Create Azure resource group | Azure CLI |
| 2 | Create ACR; note login server and credentials | Azure CLI |
| 3 | (Optional) Create Azure Database for PostgreSQL | Azure Portal / CLI |
| 4 | Create Linux VM; open ports 22, 8080 | Azure CLI |
| 5 | Build DataNode and docker-runner images; push to ACR | Build machine |
| 6 | On VM: install Docker and Docker Compose; log in to ACR | VM (SSH) |
| 7 | On VM: add production `docker-compose.yml`, `datanode.env`, `.env` | VM |
| 8 | Run `docker compose pull && docker compose up -d` | VM |
| 9 | Configure HTTPS (reverse proxy or Application Gateway) and set `datanode.baseURL` | VM / Azure |
| 10 | In UI: set Study catalog (registry) and test Study Repository | Browser |

---

## 10. Maintenance and updates

- **Update images:** Rebuild and push new image tags from your build machine; on the VM run `docker compose pull` and `docker compose up -d` to use the new images.
- **Backups:** Back up the Postgres data (volume `arachne-pg-data` or Azure PostgreSQL backups if using managed DB).
- **Logs:** Use `docker compose logs -f arachne-datanode` (or `arachne-docker-runner`) to troubleshoot; consider shipping logs to Log Analytics.
- **Secrets:** Prefer Azure Key Vault or environment variables injected at runtime instead of committing `datanode.env` or `.env` to source control.

This gives you a full path to deploy Arachne to production on Azure using Docker Compose, with the option to run the docker-runner on the same VM with access to the host Docker daemon for running study containers.
