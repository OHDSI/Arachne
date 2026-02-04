# Arachne full stack – build, run, and test
# Backend: Maven (datanode + commons + executionengine). Frontend: datanode-ui (React, includes Study Repository).

.PHONY: build build-backend build-datanode-ui \
	run run-backend run-datanode-ui run-docker run-docker-db \
	test test-backend test-backend-integration test-datanode-ui \
	buildtest full-stack-build-test clean help

# Default: show help
help:
	@echo "Arachne full stack"
	@echo ""
	@echo "  make build          Build backend (Maven; includes datanode-ui)"
	@echo "  make run            Build and run full stack: Postgres (Docker) + backend (8880) + frontend (3000)"
	@echo "  make test           Run backend + datanode-ui tests"
	@echo ""
	@echo "  make build-backend  Build Java modules and packaged datanode (includes datanode-ui build)"
	@echo "  make build-datanode-ui   Build React datanode-ui only (npm)"
	@echo ""
	@echo "  make run-backend      Run datanode Spring Boot app on 8880 (requires DB; use run-docker or run-docker-db)"
	@echo "  make run-datanode-ui  Run datanode-ui dev server (Next.js; proxies /api to backend)"
	@echo "  make run-docker-db    Start only Postgres via Docker (for local backend)"
	@echo "  make run-docker       Start stack via Docker Compose (Postgres + datanode)"
	@echo ""
	@echo "  make test-backend   Maven test, unit only (skips Docker/Testcontainers integration tests)"
	@echo "  make test-backend-integration   Maven test including integration tests (requires Docker)"
	@echo "  make test-datanode-ui     npm test in datanode-ui (use Node 18; .nvmrc provided)"
	@echo ""
	@echo "  make buildtest             Run full stack build test (backend)"
	@echo "  make full-stack-build-test  Same as buildtest"
	@echo ""
	@echo "  make clean          Remove Maven target/ and frontend build artifacts"

# --- Build ---
build: build-backend

build-backend:
	mvn -q install -DskipTests -pl datanode -am

build-datanode-ui:
	cd datanode-ui && npm ci && npm run build

# --- Run ---
# Full stack: Postgres (Docker) + backend + frontend. Ctrl+C stops frontend and backend.
run:
	./scripts/run-full-stack.sh

# Backend on 8880 so Next.js dev proxy (PROXY_HOST default) can reach it.
# DB: application.yml defaults (localhost:5432/arachne_datanode). For Docker Postgres: SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5434/arachne_datanode
# Optional: put ARACHNE_DOCKER_REGISTRY_TOKEN (and ARACHNE_DOCKER_REGISTRY_URL) in datanode/config/datanode.env (git-ignored); they are sourced here if the file exists.
run-backend: build-backend
	@if [ -f datanode/config/datanode.env ]; then set -a && . datanode/config/datanode.env && set +a; fi && \
	mvn -q spring-boot:run -pl datanode -am -Dspring-boot.run.profiles=local

# Use Docker Postgres (install/docker): start postgres only then run backend with DB on 5434.
# Example: make run-docker-db && SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5434/arachne_datanode make run-backend
run-docker-db:
	cd install/docker && docker compose up -d arachne-datanode-postgres

# Next.js dev server; proxies /api/* to backend (default http://localhost:8880 via PROXY_HOST).
run-datanode-ui:
	-lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	cd datanode-ui && npm run dev

run-docker:
	cd install/docker && docker compose up --build

# --- Test ---
test: test-backend test-datanode-ui

# Use package (not just test) so datanode-ui is built to a JAR before datanode's unpack goal runs (MDEP-98).
# Skips integration tests (TestRunner/Cucumber, UploadServiceTest, ValidatorTest) unless Docker is available.
test-backend:
	mvn package -pl datanode -am

# Run all tests including integration (requires Docker for Testcontainers).
test-backend-integration:
	mvn package -pl datanode -am -P integration

# Use Node from .nvmrc when nvm is available (canvas native module fails on Node 21+).
test-datanode-ui:
	cd datanode-ui && ( [ -s "$${NVM_DIR:-$$HOME/.nvm}/nvm.sh" ] && . "$${NVM_DIR:-$$HOME/.nvm}/nvm.sh" && nvm use; true ) && npm run test -- --watchAll=false

# --- Full stack build test (CI / verification) ---
buildtest full-stack-build-test:
	./scripts/full-stack-build-test.sh

# --- Clean ---
clean:
	mvn -q clean -pl datanode -am
	cd datanode-ui && (test ! -d build || rm -rf build) && (test ! -d target || rm -rf target)
