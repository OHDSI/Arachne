# Docker registry integration

The Study Repository uses a **Docker registry** as the central catalog. Studies are delivered as **Docker images**; the app pulls images by name (and optional tag) from the registry you configure.

---

## One study = one Docker image

- **One study** is represented by **one Docker image** in the registry.
- The same study can have **multiple tags** for different versions (e.g. `my-study:1.0`, `my-study:latest`).
- Researchers install and update studies by **image name** (and optionally tag); the app runs `docker pull` against the configured registry.

---

## Base layers and storage

Most studies are built on the **same base layers** (e.g. R runtime, common packages). Those layers are stored once by Docker; only the layers that differ between studies need to be downloaded. So:

- First study: full pull of base + study-specific layers.
- Later studies: mostly reuse the base; only new layers are downloaded.

This keeps install and update times low and disk usage reasonable.

---

## Registry configuration in the app

In **Settings**, you set the **Study catalog address**: the Docker registry URL (e.g. `https://ghcr.io` or `https://registry.example.com`). That is the only place you configure “where studies come from.” Optional registry credentials (username/password) can be configured if the registry is private.

The app uses this URL to:

- **List** available studies (if the backend supports catalog listing).
- **Pull** images when you click **Install** or **Update** (by image name/tag).

---

## Building and publishing studies (CI)

Study images are intended to be **built and pushed automatically** via CI (e.g. GitHub Actions):

1. **Dockerfile** per study (or shared base + study-specific Dockerfile) defining the R environment and study code.
2. **CI pipeline** builds the image and pushes it to the registry with a tag (e.g. version or `latest`).
3. The registry becomes the **catalog**; researchers point the app at that registry and install by study/image name.

No manual upload or file distribution is required—researchers only need the registry URL and the study name.

---

## Summary

| Concept | Detail |
|--------|--------|
| Catalog | Docker registry URL set in app Settings |
| One study | One Docker image (optional multiple tags for versions) |
| Storage | Shared base layers; only delta layers per study |
| Publishing | CI builds images and pushes to registry |
