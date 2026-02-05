# Security

How Arachne handles security: authentication, data protection, and **secure Docker study images** (signing and verification). For a full CI workflow that builds, scans, and signs study images, see [Building a signed & secure study repository](secure-study-repository.md).

---

## 1. Overview

- **Defense in depth**: Auth, transport security, and data protection are layered.
- **Least privilege**: Roles (e.g. `ROLE_ADMIN`) restrict administrative actions.
- **Shared responsibility**: We secure the app (auth, JWTs, access control, study execution isolation). You operate the environment: TLS, secrets, network, Docker daemon, and registry access.

---

## 2. Authentication & Access Control

- **Auth methods:** Username/password (BCrypt, JWT in HTTP-only cookie), optional OIDC; or login-disabled with a single injected user (trusted envs only).
- **Roles:** `ROLE_ADMIN` and `ROLE_USER`; admin-only actions (e.g. system settings) are role-protected.
- **Secrets:** Passwords hashed; catalog (registry) token in system settings or env (`ARACHNE_DOCKER_REGISTRY_TOKEN`); optional Jasypt for encrypted config.
- **JWT:** Configurable expiry; validate on each request. Rotate JWT signing keys per policy. No built-in refresh; re-login or OIDC.
- **MFA:** Not in-app; enforce at IdP when using OIDC.

---

## 3. Data Protection

- **Transit:** TLS via Spring Boot SSL or reverse proxy; use TLS 1.2+ in production. Encrypt DB and registry traffic where possible.
- **At rest:** DB and file storage encryption are your responsibility (provider/OS/volume encryption).
- **Secrets:** JWT and config encryption keys: store and rotate per policy (KMS/HSM as appropriate). Do not log credentials or catalog tokens.
- **Retention:** Not defined in-app; define retention and deletion for DB, logs, and files per your compliance.

---

## 4. Secure Docker study images: signing and verification

Study packages in Arachne are Docker images pulled from a configurable registry. Our strategy is to **sign** images and attestations in CI and **verify** them before use so only trusted, unmodified images run.

### Strategy

- **Sign in CI, not in the Dockerfile.** The Dockerfile only defines how the image is built (base image, layers, entrypoint). Signing happens **after** the image is built and pushed, in the CI workflow.
- **Keyless signing** with [cosign](https://docs.sigstore.dev/cosign/overview/) and GitHub OIDC: no long-lived private keys; the signature is bound to your repository and workflow (e.g. `build-study-image.yaml`).
- **Verify after download.** Before running a study image, Arachne (or the operator) can verify that the image digest is signed by a trusted identity (e.g. your GitHub repo and workflow). Unsigned or failed verification can block execution.

### What we do when building images (CI, not Dockerfile)

The project’s **`build-study-image.yaml`** (and the workflow in [secure-study-repository.md](secure-study-repository.md)) does the following:

1. **Build** the study image with Docker (from the study’s Dockerfile) and push it to the registry (e.g. GHCR).
2. **Attest** — Enable **provenance** and **SBOM** on the push step (`provenance: true`, `sbom: true`) so the registry stores how and from what the image was built.
3. **Sign the image digest** — Run `cosign sign --yes "${IMAGE}@${DIGEST}"` so the image digest is signed with the workflow’s OIDC identity.
4. **Sign attestations** — Run `cosign sign-attestation --yes "${IMAGE}@${DIGEST}"` so the provenance and SBOM attestations are also signed.

Nothing in the **Dockerfile** itself performs signing; the Dockerfile only produces the image. All signing is done in the CI pipeline after a successful build, test, and optional vulnerability scan (e.g. Trivy).

### How Arachne verifies after download

- **Manual verification (today):** Operators or researchers can verify an image before or after pull using cosign, e.g.:
  ```bash
  cosign verify <registry>/<image>@<digest> \
    --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
    --certificate-identity="https://github.com/<org>/<repo>/.github/workflows/build-study-image.yaml@refs/heads/main"
  ```
  Success means the image is the one that workflow signed and has not been tampered with.

- **In-app verification (optional):** The Arachne backend can verify signatures before running a study: after resolving the image digest (e.g. at install or at run), call cosign (or a cosign library) with the expected OIDC issuer and identity; if verification fails, do not start the container. This is the intended model for “only run signed studies”; implementation is optional and can be added where the runner or datanode triggers the pull/run.

### Summary

| Where | What |
|-------|------|
| **Dockerfile** | Builds the image only (no signing). |
| **CI (e.g. build-study-image.yaml)** | Build → push with provenance/SBOM → sign image digest → sign attestations (cosign keyless). |
| **After download** | Verify with cosign (manually or in Arachne) using expected OIDC issuer/identity; only run if verification succeeds. |

---

## 5. Infrastructure & operations (short)

- **Registry:** Use a private registry with access control; configure catalog URL and token in Arachne (Settings or env). Prefer registries that support OCI artifacts (for signatures and attestations).
- **Scanning:** The app does not scan images. Run Trivy (or similar) in CI when building study images; fail on HIGH/CRITICAL if your policy requires it.
- **Network:** Restrict access to the datanode, DB, and execution engine; expose only needed ports.
- **Secrets:** Do not bake secrets into images. Use env, secret mounts, or a secret manager for datanode and runner.
- **Updates:** Keep JVM, OS, Docker, and dependencies patched; rotate registry tokens and JWT keys.

---

## 6. API & Application Security

### API authentication and authorization

- Authenticated API endpoints require a valid JWT. The JWT is read from a Bearer cookie (HTTP-only, SameSite=Strict) or from the configured header (e.g. `Arachne-Auth-Token`). Unauthenticated requests to protected paths receive 401.
- Role-based checks protect admin endpoints. Other endpoints require an authenticated user.

### Rate limiting and abuse prevention

- The application does not describe built-in rate limiting. In production, consider rate limiting at a reverse proxy or API gateway (e.g. per IP or per user) to reduce brute-force and abuse.

### Input validation and output encoding

- Use validation (e.g. `@Valid`, constraints) on request DTOs. Validate and sanitize user input before persistence or use in commands. Render user-controlled data with safe encoding in the UI to reduce XSS.

### Protection against common web vulnerabilities (OWASP Top 10)

- **Injection**: Parameterized queries and ORM are used for database access. Avoid building raw SQL from user input.
- **Broken auth**: Passwords are hashed; JWTs are signed and time-limited; cookies are HTTP-only and SameSite.
- **Sensitive data**: Avoid logging credentials; use TLS in production.
- **XSS**: Ensure the UI encodes output and that content security policy is considered (at app or proxy).
- **Access control**: Admin actions are restricted by role; enforce authentication on all sensitive API paths.
- **Security misconfiguration**: Harden default config (e.g. disable debug in production, use strong TLS and key management).
- **CSRF**: SameSite cookies and same-origin API usage reduce CSRF risk; add CSRF tokens if you support non-same-origin form submissions.

Other OWASP items (e.g. insecure deserialization, known vulnerabilities in components) are addressed by secure coding, dependency management, and updates.

### Dependency and supply-chain security

- Dependencies are managed via Maven (Java) and npm (UI). Track dependencies for known vulnerabilities (e.g. OSS indexes, Dependabot) and update or mitigate as needed. Pin versions and review new dependencies before adoption.

### Logging and audit trails

- Application logs can include request and error information. Avoid logging credentials or full tokens. For audit requirements, ensure sufficient logging (and log retention) for security-relevant events (e.g. login success/failure, admin actions) and integrate with your SIEM or audit pipeline if needed.

---

## 7. Monitoring & Incident Response

### Security monitoring and alerting

- Implement monitoring and alerting in your environment (e.g. failed logins, unusual traffic, errors). The application does not ship a built-in SIEM; use your standard monitoring stack.

### Logging and audit capabilities

- Use application and access logs for troubleshooting and audit. Retain logs according to policy. Ensure log storage is protected and access is restricted.

### Incident response process

- Maintain an incident response process (detection, containment, eradication, recovery, post-incident review). Define roles and contacts. The application does not define this for you.

### Disclosure and vulnerability reporting policy

- See **Contact & Reporting** below. We encourage responsible disclosure and will work with reporters to understand and address issues.

### Customer notification approach

- If you deploy Arachne for multiple customers or tenants, define how you will notify them of security-relevant incidents or critical vulnerabilities, in line with your contracts and regulations.

---

## 8. Compliance & Governance

### Compliance frameworks

- The application does not claim a specific certification (e.g. SOC 2, HIPAA, GDPR). Compliance is determined by how you deploy, configure, and operate the system and by your data handling. Document your own control set and evidence for auditors.

### Data residency

- Data residency is determined by where you host the datanode, database, and registries. Choose regions and providers that meet your data residency requirements.

### Access review and internal controls

- Periodically review user accounts, roles, and access to configuration and secrets. Disable or remove accounts when no longer needed. Apply the same to any service accounts used for integration.

### Employee access restrictions

- Restrict production access to need-to-know personnel. Use strong authentication and access controls for deployment and operational tools. The application does not enforce this; it is an operational responsibility.

---

## 9. Customer Responsibilities

### What you should configure securely

- **TLS**: Enable HTTPS for the datanode in production and use valid certificates.
- **Credentials**: Use strong, unique passwords for the database and for admin users. Prefer environment variables or a secret manager for registry tokens and DB credentials.
- **Network**: Restrict access to the datanode and database; do not expose the Docker daemon or registry unnecessarily.
- **Updates**: Apply security updates to the application, JVM, OS, and Docker on a regular schedule.
- **Backups**: Back up database and critical config; test restore; protect backup storage.

### Best practices for API keys, tokens, and access

- Rotate registry tokens and JWT signing keys periodically. Use short-lived tokens where the system supports it.
- Do not commit secrets to source control. Use env files that are gitignored or a secrets manager.
- Limit admin accounts and use least-privilege roles for day-to-day use.

---

## 10. Contact & Reporting

### Reporting vulnerabilities

If you believe you have found a security vulnerability in Arachne, please report it in a responsible way.

- **Do not** open a public GitHub issue for security-sensitive findings.
- **Do** contact the maintainers privately (e.g. via the security contact below) with a clear description, steps to reproduce, and impact if possible.

### Security contact

- **Email**: [*Insert security contact email, e.g. security@yourorg.com*]
- **Preferred**: Encrypted email if you have a PGP key for the security contact.

### Responsible disclosure

We ask that you:

- Give us a reasonable time to address the issue before any public disclosure.
- Avoid modifying or accessing data that is not your own.
- Do not exploit the vulnerability beyond what is needed to demonstrate it.

We will acknowledge receipt, work to validate and fix the issue, and coordinate on disclosure timing where appropriate.

---

*This page is a living document. Update it as security capabilities and deployment options change.*
