# Arachne full stack – build, run, and test
# Backend: Maven (datanode + commons + executionengine). Frontend: datanode-ui (React, includes Study Repository).

.PHONY: build build-backend build-datanode-ui \
	run start restart run-backend run-datanode-ui run-docker run-docker-db stop unlock-ui flush \
	docs \
	test test-backend test-backend-integration test-datanode-ui env-test install-test test-study-e2e test-study-buttons \
	buildtest full-stack-build-test clean help

JAVA17_HOME := /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
MVN_ENV = if [ -d "$(JAVA17_HOME)" ]; then export JAVA_HOME="$(JAVA17_HOME)"; export PATH="$$JAVA_HOME/bin:$$PATH"; fi;

# Default: show help
help:
	@echo "Arachne full stack"
	@echo ""
	@echo "  make build          Build backend (Maven; includes datanode-ui)"
	@echo "  make run            Same as make start: build and run full stack"
	@echo "  make start          Build and run full stack: Postgres (Docker) + backend (8880) + frontend (3000)"
	@echo "  make stop           Shut down app and free ports 3000 (frontend) and 8880 (backend)"
	@echo "  make restart        Stop then start full stack (stop + start)"
	@echo "  make unlock-ui      Stop frontend (3000/3001), remove Next.js dev lock (fix 'Unable to acquire lock')"
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
	@echo "  make test-datanode-ui     npm test in datanode-ui (use Node 20; .nvmrc provided)"
	@echo "  make env-test      Run Study Repository check-connection (same as UI button) using ARACHNE_DOCKER_REGISTRY_* from datanode/config/datanode.env"
	@echo "  make install-test  Run Study Repository install test (pulls image; may take several minutes)"
	@echo "  make test-study-e2e  Install the example study, run it, persist outputs, then launch Shiny from saved results"
	@echo "  make test-study-buttons  Pull example study image then print UI test steps for Loaded/Running buttons"
	@echo ""
	@echo "  make buildtest             Run full stack build test (backend)"
	@echo "  make full-stack-build-test  Same as buildtest"
	@echo ""
	@echo "  make docs            Serve package docs (MkDocs) and open in browser (http://127.0.0.1:8000); Ctrl+C to stop"
	@echo ""
	@echo "  make clean          Remove Maven target/ and frontend build artifacts"

# --- Build ---
build: build-backend

build-backend:
	@$(MVN_ENV) mvn -q install -DskipTests -pl datanode -am

build-datanode-ui:
	cd datanode-ui && npm ci && npm run build

# --- Run ---
# Alias for start (full stack).
run: start

# Full stack: Postgres (Docker) + backend + frontend. Ctrl+C stops frontend and backend.
start:
	./scripts/run-full-stack.sh

# Stop then start full stack.
restart: stop start

# Shut down processes on frontend (3000) and backend (8880) gracefully (SIGTERM), then force if needed.
stop:
	@echo "Stopping frontend (3000) and backend (8880)..."
	-lsof -ti:3000 | xargs kill -TERM 2>/dev/null || true
	-lsof -ti:8880 | xargs kill -TERM 2>/dev/null || true
	@for i in 1 2 3 4 5 6 7 8 9 10; do \
	  if ! (lsof -ti:3000 2>/dev/null || lsof -ti:8880 2>/dev/null) | grep -q .; then break; fi; \
	  sleep 1; \
	done
	-lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	-lsof -ti:8880 | xargs kill -9 2>/dev/null || true
	@echo "Stopped."
	@echo "(Backend may show Maven [ERROR] exit 143 in the terminal where it was started; that is expected when stopping.)"

# Stop frontend (ports 3000/3001 and any next dev), remove Next.js dev lock so 'npm run dev' can start again.
unlock-ui:
	@echo "Stopping frontend and removing Next.js dev lock..."
	-lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	-lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	-pkill -f "next dev" 2>/dev/null || true
	-rm -f datanode-ui/.next/dev/lock
	@echo "Done. You can run 'make run-datanode-ui' or 'make start' again."

# Backward-compatible alias for older docs and local habits.
flush: unlock-ui

# Backend on 8880 so Next.js dev proxy (PROXY_HOST default) can reach it.
# DB: application.yml defaults (localhost:5432/arachne_datanode). For Docker Postgres: SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5434/arachne_datanode
# Optional: put ARACHNE_DOCKER_REGISTRY_TOKEN (and ARACHNE_DOCKER_REGISTRY_URL) in datanode/config/datanode.env (git-ignored); they are sourced here if the file exists.
run-backend: build-backend
	@if [ -f datanode/config/datanode.env ]; then set -a && . datanode/config/datanode.env && set +a; fi; \
	export DOCKER_HOST="unix:///var/run/docker.sock"; \
	$(MVN_ENV) mvn -q spring-boot:run -pl datanode -am -Dspring-boot.run.profiles=local -Dspring-boot.run.jvmArguments="-Xmx1024m"

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

# --- Docs (package website) ---
# Serve MkDocs and open browser; Ctrl+C stops the server.
docs:
	@echo "Starting docs at http://127.0.0.1:8000 ..."
	mkdocs serve & \
	sleep 2 && \
	(command -v open >/dev/null 2>&1 && open http://127.0.0.1:8000 || command -v xdg-open >/dev/null 2>&1 && xdg-open http://127.0.0.1:8000 || echo "Open http://127.0.0.1:8000 in your browser") && \
	wait

# --- Test ---
test: test-backend test-datanode-ui

# Use package (not just test) so datanode-ui is built to a JAR before datanode's unpack goal runs (MDEP-98).
# Skips integration tests (TestRunner/Cucumber, UploadServiceTest, ValidatorTest) unless Docker is available.
test-backend:
	@$(MVN_ENV) mvn package -pl datanode -am

# Run all tests including integration (requires Docker for Testcontainers).
test-backend-integration:
	@$(MVN_ENV) mvn package -pl datanode -am -P integration

# Use Node from .nvmrc when nvm is available (canvas native module fails on Node 21+).
test-datanode-ui:
	cd datanode-ui && ( [ -s "$${NVM_DIR:-$$HOME/.nvm}/nvm.sh" ] && . "$${NVM_DIR:-$$HOME/.nvm}/nvm.sh" && nvm use; true ) && npm run test -- --watchAll=false

# Run Study Repository connection check (same logic as UI "Check connection" button) with ARACHNE_DOCKER_REGISTRY_* from datanode.env.
env-test:
	./scripts/env-test.sh

# Run Study Repository install test: pulls darwin-eu-dev/examplestudy from registry (requires ARACHNE_DOCKER_REGISTRY_* in datanode.env).
# May take several minutes while the Docker image is pulled from the registry.
install-test:
	./scripts/install-test.sh

# Run the full Study Repository example-study flow: install -> run -> persist outputs -> relaunch Shiny from saved results.
test-study-e2e:
	./scripts/test-study-e2e.sh

# Pull example study image then print steps to test Loaded/Running buttons in the UI. Requires datanode.env with registry credentials.
# Start the app (make start) in another terminal, then follow the printed steps. See docs/TESTING_STUDY_REPOSITORY_UI.md for full guide.
test-study-buttons: install-test
	@echo ""
	@echo "Example study image is ready. To test the Loaded/Running buttons:"
	@echo "  1. Start the app: make start  (or already running)"
	@echo "  2. Open http://localhost:3000 → Study Repository"
	@echo "  3. Install 'darwin-eu-dev/examplestudy' if not already in the list"
	@echo "  4. Click Run (play) → wait for green 'Study environment ready' → Back to Repository → row should show green 'Loaded'"
	@echo "  5. Open the study again → Run study → list should show 'Running' (spinner) until execution finishes"
	@echo "  6. Shutdown (square) → row should show Idle"
	@echo ""
	@echo "Full guide: docs/TESTING_STUDY_REPOSITORY_UI.md"

# --- Full stack build test (CI / verification) ---
buildtest full-stack-build-test:
	./scripts/full-stack-build-test.sh

# --- Clean ---
clean:
	@$(MVN_ENV) mvn -q clean -pl datanode -am
	cd datanode-ui && (test ! -d build || rm -rf build) && (test ! -d target || rm -rf target)
