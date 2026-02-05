# Study Repository — Package Website

The **Study Repository** lets researchers install study packages from a central catalog, run them locally with their own database and settings, view results in an interactive app, and clean up when done—without dealing with uploads or generic “submissions.”

---

## Contents

| Document | Description |
|----------|-------------|
| [Use case & user story](use-case.md) | What the Study Repository is for and what researchers can do |
| [Docker registry integration](docker-registry.md) | How studies are delivered as Docker images, registry setup, and CI |
| [Installation](installation.md) | Technical details for installing and configuring the app |
| [How to run studies](how-to-run-studies.md) | Step-by-step guide for using the app to run studies |

---

## Quick summary

- **One study = one Docker image** (with optional tags for versions). Base layers are shared across studies, so most downloads are incremental.
- Studies are **built and pushed via CI** (e.g. GitHub Actions) to a Docker registry; you configure that registry as the “study catalog” in the app.
- Researchers **install by name**, **run with their own DB and settings**, **view outputs and Shiny results**, and **shutdown or delete** when done.

Start with [Use case & user story](use-case.md) for the full picture, then [Installation](installation.md) and [How to run studies](how-to-run-studies.md) for getting things running.

---

## Publishing this site (GitHub Pages)

This site is built with [MkDocs](https://www.mkdocs.org/) and the [Material theme](https://squidfunk.github.io/mkdocs-material/). To publish via GitHub Actions:

1. In the repo: **Settings → Pages → Build and deployment → Source** = **GitHub Actions**.
2. Push to `main` (or `master`); the workflow [`.github/workflows/deploy-docs.yml`](../../.github/workflows/deploy-docs.yml) builds the site and deploys it.
3. The site will be at `https://<owner>.github.io/<repo>/`.

To build and preview locally: from the repo root run `pip install mkdocs-material` then `mkdocs serve`, and open http://127.0.0.1:8000.
