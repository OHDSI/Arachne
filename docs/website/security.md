# Security

This page describes how Arachne handles security. It is intended for security-conscious customers, enterprise reviewers, and technical evaluators. The content is structured for both engineers and procurement/security review.

---

## 1. Overview

### Security philosophy and principles

- **Defense in depth**: Authentication, authorization, transport security, and data protection are layered so that a failure in one area does not automatically compromise the whole system.
- **Least privilege**: Users and services are granted only the access needed for their role. Administrative actions are restricted to users with the appropriate role.
- **Explicit over implicit**: Security-sensitive behavior (e.g. authentication mode, TLS) is configurable so deployers can match their environment and policies.

### Shared responsibility model

| We secure | You configure / operate |
|-----------|--------------------------|
| Application authentication and authorization (login, JWT, OIDC integration) | Deployment environment (network, firewall, reverse proxy) |
| Password hashing and token handling in the app | TLS termination (if done at proxy) and certificate management |
| Secure defaults for cookies and session handling | Database credentials, registry tokens, and other secrets |
| Access control within the datanode (roles, API protection) | Who has access to the host, Docker daemon, and registry |
| Study execution isolation via Docker | Patching the OS, container runtime, and base images |

Arachne is typically self-hosted. You are responsible for the hosting environment, network security, and operational practices (backups, updates, access reviews).

---

## 2. Authentication & Access Control

### Supported auth methods

- **Username/password (basic)**: Stored credentials are verified with a password encoder (e.g. BCrypt). On success, the application issues a JWT and sets it in an HTTP-only cookie.
- **OIDC / OAuth2**: Optional. When configured, users can sign in via an OpenID Connect provider (e.g. Azure AD, Keycloak). The application creates or updates a local user and issues a JWT in the same cookie format.
- **Login-disabled mode**: For locked-down or single-user deployments, login can be disabled. A configurable “anonymous” user (e.g. `admin`) is injected as the principal for all requests. Use only in trusted environments.

There is no built-in API-key auth for machine-to-machine calls in the default distribution; such flows would typically use the same JWT (e.g. obtained via a service account login) or a reverse proxy that adds authentication.

### Role-based access control and least privilege

- **Roles**: The application uses roles such as `ROLE_ADMIN` and `ROLE_USER`. Admin-only actions (e.g. system settings, restart) are protected with role checks (e.g. `@Secured("ROLE_ADMIN")`).
- **Principle**: Non-admin users cannot change system settings or perform administrative operations. Data source and study operations are gated by authentication and, where applicable, role.

### Secrets handling and credential storage

- **Passwords**: User passwords are not stored in plain text. They are hashed with a strong password encoder (e.g. BCrypt) before persistence.
- **Catalog token**: The study catalog (Docker registry) token can be stored in system settings. It is used only for registry API calls (e.g. pull, list tags). Consider supplying it via environment (e.g. `ARACHNE_DOCKER_REGISTRY_TOKEN`) instead of storing in the database if your policy requires it.
- **Optional encryption of config**: Some deployments use Jasypt or similar to encrypt sensitive values in configuration files. Example env references `jasypt.encryptor.password` for decrypting stored secrets. Key management is the deployer’s responsibility.

### Token lifetimes and rotation

- **JWT expiry**: Configurable. Default in the application is `P1D` (one day); datanode config may override with a value in seconds (e.g. `datanode.jwt.expiration=3600`). Tokens are validated on each request; after expiry, the user must sign in again.
- **Refresh**: The current design does not describe a separate refresh-token flow; session extension is effectively “re-login” or re-authentication via OIDC.
- **Rotation**: JWT signing keys (e.g. `jwt.key.private` / `jwt.key.public`) should be rotated according to your policy. Key rotation may require coordinated deployment and may invalidate existing sessions until users re-authenticate.

### Multi-factor authentication

- MFA is not implemented inside the application. When OIDC is used, MFA can be enforced at the identity provider (e.g. Azure AD, Okta).

---

## 3. Data Protection

### Encryption in transit

- **TLS**: The datanode can be run with TLS (HTTPS). Configuration is via Spring Boot server SSL settings (e.g. `server.ssl.enabled`, keystore/truststore). In production, use TLS 1.2 or 1.3 and disable weak ciphers.
- **HSTS**: If the application is served behind a reverse proxy, HSTS can be enforced at the proxy. Application-level HSTS headers can be added if not provided by the proxy.
- **Internal traffic**: Communication with the database, Docker daemon, and execution engine should use encrypted channels where possible (e.g. TLS to PostgreSQL, TLS to registry). This is deployment-dependent.

### Encryption at rest

- **Database**: Data at rest depends on your database and storage. Use your provider’s or OS-level encryption for database files and backups (e.g. encrypted volumes, managed DB encryption).
- **File storage**: Uploaded or generated files (e.g. under `files.store.path`) are stored on the server filesystem. Encryption at rest is the responsibility of the host or storage layer.
- **Backups**: Backup encryption and retention are your responsibility.

### Key management

- JWT signing keys and any encryption keys used for configuration (e.g. Jasypt) should be stored and rotated according to your key management policy. The application does not prescribe a specific KMS; use your environment’s standard (e.g. cloud KMS, HSM, or secure secret store).

### Handling of sensitive data

- Passwords are hashed, not stored in plain text. JWTs are short-lived and stored in HTTP-only, SameSite cookies where the UI is used.
- Catalog tokens and database connection details are sensitive; restrict access to configuration and environment and avoid logging them.

### Data retention and deletion

- Retention and deletion policies are not defined inside the application. Define retention for database data, logs, and file storage according to your compliance and operational needs. User and study data deletion would be implemented via your procedures or future product features.

---

## 4. Infrastructure & Container Security

### Hosting environment

- Arachne does not mandate a specific cloud or region. Document where you host the datanode, database, and any execution/runner components (e.g. cloud provider, region, network) for your own and auditors’ reference.

### Container registry and image security

- Studies are distributed as Docker images from a configurable registry. Use a private registry with access control where possible. Registry credentials (or token) are configured in Arachne (system settings or environment).
- Prefer registries that support image signing and verification if your policy requires it.

### Image scanning and vulnerability management

- The application does not perform image scanning itself. Integrate scanning into your CI/CD (e.g. when building study images) and optionally in the registry or runtime. Act on critical/high vulnerabilities before promoting images.

### Patch and update strategy

- Keep the application stack updated: JVM, OS, Docker, dependencies. Use a regular patch cycle and track security advisories for Spring Boot, PostgreSQL driver, and other libraries.

### Network isolation and firewalling

- Restrict network access to the datanode, database, and execution engine. Expose only necessary ports. Use firewall rules or security groups so that only trusted clients and services can reach the application and Docker daemon.

### Secrets management for containers

- Avoid baking secrets into images. Supply credentials via environment variables, secret mounts, or a secrets manager when running the datanode and any runner components. Use the same approach for study runtimes if they need credentials.

### CI/CD pipeline security

- If you build study images via CI (e.g. GitHub Actions), secure the pipeline: restrict who can change workflows, use short-lived tokens for registry push, and avoid logging secrets. The repository’s `build-study-image.yaml` (or equivalent) should follow your pipeline security standards.

---

## 5. API & Application Security

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

## 6. Monitoring & Incident Response

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

## 7. Compliance & Governance

### Compliance frameworks

- The application does not claim a specific certification (e.g. SOC 2, HIPAA, GDPR). Compliance is determined by how you deploy, configure, and operate the system and by your data handling. Document your own control set and evidence for auditors.

### Data residency

- Data residency is determined by where you host the datanode, database, and registries. Choose regions and providers that meet your data residency requirements.

### Access review and internal controls

- Periodically review user accounts, roles, and access to configuration and secrets. Disable or remove accounts when no longer needed. Apply the same to any service accounts used for integration.

### Employee access restrictions

- Restrict production access to need-to-know personnel. Use strong authentication and access controls for deployment and operational tools. The application does not enforce this; it is an operational responsibility.

---

## 8. Customer Responsibilities

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

## 9. Contact & Reporting

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
