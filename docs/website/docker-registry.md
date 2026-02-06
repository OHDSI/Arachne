# Docker registry integration

Arachne’s Study Repository uses a **Docker registry** as the central catalog. Studies are delivered as **Docker images**; Arachne pulls images by name (and optional tag) from the registry you configure.

---

## One study = one Docker image

- **One study** is represented by **one Docker image** in the registry.
- The same study can have **multiple tags** for different versions (e.g. `my-study:1.0`, `my-study:latest`).
- Researchers install studies by entering the **repo name** (e.g. `darwin-eu-dev/examplestudy`). Arachne runs **docker pull** against the configured registry; the image is stored on the user’s computer. Installed studies are thus local Docker images.

---

## Base layers and storage

Most studies are built on the **same base layers** (e.g. R runtime, common packages). Those layers are stored once by Docker; only the layers that differ between studies need to be downloaded. So:

- First study: full pull of base + study-specific layers.
- Later studies: mostly reuse the base; only new layers are downloaded.

This keeps install and update times low and disk usage reasonable.

---

## Registry configuration in Arachne

In **Settings**, you set the **Study catalog address**: the Docker registry URL (e.g. `https://ghcr.io` or `https://registry.example.com`). That is the only place you configure “where studies come from.” Optional registry credentials (username/password) can be configured if the registry is private.

Arachne uses this URL to:

- **List** available studies (if the backend supports catalog listing).
- **Pull** images when you click **Install** or **Update** (by image name/tag).

---

## Building and publishing studies (CI)

Study images are intended to be **built and pushed automatically** via CI (e.g. GitHub Actions):

1. **Dockerfile** per study (or shared base + study-specific Dockerfile) defining the R environment and study code.
2. **CI pipeline** builds the image and pushes it to the registry with a tag (e.g. version or `latest`).
3. The registry becomes the **catalog**; researchers point Arachne at that registry and install by study/image name.

No manual upload or file distribution is required—researchers only need the registry URL and the study name.

---

## Signed and secure studies

You can build a **signed and secure** study catalog by using CI that scans images (e.g. Trivy), attaches provenance and SBOM attestations, and signs images and attestations with **cosign** (e.g. keyless signing via GitHub OIDC). Researchers (or Arachne) can then verify that an image came from your workflow and was not tampered with.

See [Building a signed and secure study repository](secure-study-repository.md) for a full GitHub Actions workflow (`build-study-image.yaml`) and how to build a repository of signed, secure studies.

---

## Summary

| Concept | Detail |
|--------|--------|
| Catalog | Docker registry URL set in Arachne Settings |
| One study | One Docker image (optional multiple tags for versions) |
| Storage | Shared base layers; only delta layers per study |
| Publishing | CI builds images and pushes to registry |
