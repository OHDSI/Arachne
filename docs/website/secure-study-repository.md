# Building a signed and secure study repository

To give researchers confidence in the studies they install from your catalog, you can build and publish **signed**, **scanned** images with **provenance** and **SBOM** attestations. This page describes a CI workflow that does exactly that, and how it fits into a secure study repository.

---

## Goals

- **Integrity** — Images are signed so users (or Arachne) can verify they came from you and weren’t tampered with.
- **Security** — Images are scanned for known vulnerabilities (e.g. OS and library CVEs); the pipeline can block release on HIGH/CRITICAL.
- **Provenance** — Build provenance and SBOM (software bill of materials) are attached and optionally signed, so users know how and from what the image was built.

No long-lived signing keys are required: **keyless signing** with GitHub OIDC ties signatures to your repository and workflow.

---

## Workflow overview

The workflow below (available in the Arachne repo as `build-study-image.yaml`) does the following:

1. **Build** the study image (Docker) and load it locally (no push yet).
2. **Test** inside the image (e.g. run `tests/build_test.R`) so only passing builds continue.
3. **Scan** the image with Trivy; fail the job on HIGH/CRITICAL vulnerabilities.
4. **Push** the image to the registry (e.g. GHCR) with **provenance** and **SBOM** attestations.
5. **Sign** the image digest with **cosign** (keyless, using GitHub OIDC).
6. **Sign** the attestations (provenance/SBOM) so clients can verify them too.

Result: every published study image is tested, scanned, signed, and accompanied by signed attestations.

---

## Example workflow: `build-study-image.yaml`

This is the full workflow. Copy it to `.github/workflows/build-study-image.yaml` in your study repo (or the Arachne repo), adjust `Dockerfile` and `tests/build_test.R` paths as needed, and ensure the repo has **packages: write** and **id-token: write** for GHCR and keyless signing.

```yaml
name: build-test-sign-image

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

# Needed for pushing to GHCR + keyless cosign signing (OIDC)
permissions:
  contents: read
  packages: write
  id-token: write

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }} # owner/repo

jobs:
  build_test_and_release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up QEMU (optional)
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Produces tags + labels (commit SHA, semver if you use tags, etc.)
      - name: Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,format=long
            type=ref,event=branch
            type=ref,event=tag
          labels: |
            org.opencontainers.image.source=${{ github.server_url }}/${{ github.repository }}
            org.opencontainers.image.revision=${{ github.sha }}

      # 1) CI build (LOAD locally) so we can run tests inside the image.
      #    Attestations (sbom/provenance) require pushing, so we do that only after tests pass.
      - name: Build (CI / local load)
        id: build_ci
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          platforms: linux/amd64
          push: false
          load: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:ci-${{ github.sha }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # Run your build/test script INSIDE the built image.
      # Assumes your image contains your package source (COPY . ...) and that this script exists.
      - name: Run build/test script inside image
        run: |
          set -euo pipefail
          docker run --rm \
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:ci-${{ github.sha }} \
            Rscript -f tests/build_test.R

      # Optional (but common): scan the image before release
      - name: Trivy scan (fail on HIGH/CRITICAL)
        uses: aquasecurity/trivy-action@0.28.0
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:ci-${{ github.sha }}
          format: table
          ignore-unfixed: true
          vuln-type: os,library
          severity: HIGH,CRITICAL
          exit-code: "1"

      # 2) Release build (PUSH) with SBOM + provenance attestations.
      - name: Build & push (release + attestations)
        id: build_release
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          platforms: linux/amd64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          # Supply-chain metadata
          provenance: true
          sbom: true
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # Keyless signing using GitHub OIDC (no long-lived keys).
      - name: Install cosign
        uses: sigstore/cosign-installer@v3
        with:
          cosign-release: v2.4.1

      - name: Sign image digest (keyless)
        env:
          COSIGN_EXPERIMENTAL: "false"
        run: |
          set -euo pipefail
          IMAGE="${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}"
          DIGEST="${{ steps.build_release.outputs.digest }}"
          cosign sign --yes "${IMAGE}@${DIGEST}"

      # Optional: sign the SBOM/provenance attestations too (recommended if you plan to verify them client-side)
      - name: Sign attestations (keyless)
        run: |
          set -euo pipefail
          IMAGE="${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}"
          DIGEST="${{ steps.build_release.outputs.digest }}"
          # This signs the attached attestations (provenance/SBOM) for that digest.
          cosign sign-attestation --yes "${IMAGE}@${DIGEST}"
```

---

## What each part does

| Step | Purpose |
|------|--------|
| **Build (CI / local load)** | Build the image and load it into the runner’s Docker so you can run tests and Trivy without pushing untested images. |
| **Run build/test script** | Execute your tests inside the image (e.g. `Rscript -f tests/build_test.R`). Only images that pass tests proceed. |
| **Trivy scan** | Scan the image for OS and library vulnerabilities; fail on HIGH/CRITICAL so vulnerable images are not released. |
| **Build & push (release)** | Push the image to the registry with **provenance** and **SBOM** attestations so consumers can see how and from what the image was built. |
| **Sign image (keyless)** | Sign the image digest with cosign using GitHub OIDC. No long-lived keys; the signature is tied to your repo and workflow. |
| **Sign attestations** | Sign the provenance and SBOM attestations so clients can verify them with cosign. |

---

## Keyless signing (OIDC)

**id-token: write** allows the job to obtain a short-lived OIDC token from GitHub. Cosign uses that token to sign via Sigstore’s Fulcio CA; the certificate is bound to your repository and workflow. Nobody needs to store private keys; signatures are verifiable and tied to your GitHub identity and repo.

---

## Verifying images (researchers / Arachne)

After you publish signed images, researchers (or Arachne, if you add verification) can ensure an image is signed by your repository before running it:

```bash
# Verify image signature (keyless – specify the issuer and subject for your repo)
cosign verify ghcr.io/owner/repo@sha256:... \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  --certificate-identity="https://github.com/owner/repo/.github/workflows/build-study-image.yaml@refs/heads/main"
```

If verification succeeds, the image is the one your workflow signed. You can similarly verify attestations with `cosign verify-attestation`.

---

## Building a catalog of signed, secure studies

- **One repo per study (or one repo with multiple images):** Use one workflow per image (e.g. one workflow file per study or a matrix). Each study image is built, tested, scanned, pushed with attestations, and signed.
- **Single registry:** Push all study images to one registry (e.g. GHCR under an organization). Researchers set that registry as the **Study catalog address** in Arachne.
- **Tags:** Use tags for versions (e.g. `type=ref,event=tag`) or commit SHA so researchers can install or update to a specific digest or tag.
- **Verification in Arachne:** Optionally, the Arachne backend can verify cosign signatures (and attestations) before running an image, so only signed studies from trusted identities are executed.

Together, the workflow above and a registry used as the study catalog give you a **repository of signed and secure studies** that researchers can install and run from Arachne with greater confidence.
