# Arachne — Study Repository docs

**Arachne** lets researchers install study packages from a central catalog, run them locally with their own database and settings, view results in an interactive app, and clean up when done—without dealing with uploads or generic “submissions.”

---

## Contents

| Document | Description |
|----------|-------------|
| [Use case & user story](use-case.md) | What the Study Repository in Arachne is for and what researchers can do |
| [Docker registry integration](docker-registry.md) | How studies are delivered as Docker images, registry setup, and CI |
| [Building a signed & secure study repository](secure-study-repository.md) | CI workflow to build, scan, sign, and publish study images (Trivy, cosign, attestations) |
| [Installation](installation.md) | Technical details for installing and configuring Arachne |
| [How to run studies](how-to-run-studies.md) | Step-by-step guide for using Arachne to run studies |
| [Security](security.md) | Security overview: authentication, data protection, infrastructure, compliance, and reporting |
| [Developer architecture](developer-architecture.md) | Runtime components, API flow, and Docker image/container lifecycle |
| [Database state](database-state.md) | Study Repository schema and run/output state model |

---

## Quick summary

- **One study = one Docker image** (with optional tags for versions). Base layers are shared across studies, so most downloads are incremental.
- Studies are **built and pushed via CI** (e.g. GitHub Actions) to a Docker registry; you configure that registry as the “study catalog” in Arachne.
- Researchers **install by name**, **run with their own DB and settings**, **view outputs and Shiny results**, and **shutdown or delete** when done.

Start with [Use case & user story](use-case.md) for the full picture, then [Installation](installation.md) and [How to run studies](how-to-run-studies.md) for getting things running.
