# Dependencies from Odysseus and OHDSI Repos

When **Odysseus** or **OHDSI** repos are unreachable (timeout/connection error), these are the dependencies that would normally come from them and what you can do.

---

## Odysseus repos (nexus.odysseusinc.com)

**What comes from them:** Only **internal Arachne modules** (same repo):

| Artifact | Where it's built | Used by |
|----------|------------------|--------|
| `com.odysseusinc.arachne:datanode-ui` | `datanode-ui/` | datanode |
| `com.odysseusinc.arachne:arachne-commons` | `commons/arachne-commons/` | datanode |
| `com.odysseusinc.arachne:arachne-common-types` | `commons/arachne-common-types/` | commons, datanode |
| `com.odysseusinc.arachne:arachne-sys-settings` | `commons/arachne-sys-settings/` | datanode |
| `com.odysseusinc.arachne:execution-engine-commons` | `commons/execution-engine-commons/` | datanode, docker-runner |

**Can we remove them?** No. They are your own modules; removing them would break the build.

**Can we avoid needing the Odysseus remote repos?** Yes. These artifacts are all built from this repository. If you **build from the root** with:

```bash
mvn clean install -DskipTests
```

Maven builds `commons` (including execution-engine-commons) → `datanode-ui` → `docker-runner` → `datanode` and installs them into your local `~/.m2/repository`. After that, the datanode build resolves them from local cache and **does not need to contact nexus.odysseusinc.com**.

So the Odysseus repos are only needed when:
- You build a single module (e.g. only `datanode`) without having run a full install from root, or
- You are deploying/publishing to that Nexus.

**Practical fix for timeouts:** Run a full build from the repo root once (or whenever you do a clean). You can leave the Odysseus repo declarations in the POM; they will only be used when an internal artifact is missing from local cache.

---

## OHDSI repos (repo.ohdsi.org)

**What comes from them:** One explicit dependency:

| Artifact | Version | Used for |
|----------|---------|----------|
| `org.ohdsi:authenticator` | 0.0.3-QA | Login/auth: `AuthController`, `UserService`, `DbBasicCredentialsService`; component scan `org.ohdsi.authenticator.*`; config `authenticator.methods.db.service=org.ohdsi.authenticator.service.jdbc.JdbcAuthService` |

**Is it on Maven Central?** No. OHDSI Authenticator is not published to Maven Central; it is only available from OHDSI repositories (or from a local install).

**Can we remove it?** You can remove the **dependency** only if you replace its behavior:

1. **Replace with Spring Security only**  
   Implement login, logout, and principal handling using Spring Security (e.g. form login, JWT, or your own `UserDetailsService`). Then:
   - Remove the `org.ohdsi:authenticator` dependency from `datanode/pom.xml`.
   - Remove `org.ohdsi.authenticator.*` from `@ComponentScan` in `WebApplicationStarter.java` and `TestApplication.java`.
   - Replace use of `org.ohdsi.authenticator.exception.AuthenticationException` (e.g. in `UserService`, `AuthController`) with your own or Spring’s exception.
   - Refactor `DbBasicCredentialsService` (and any code that uses the authenticator’s JDBC auth service) to use Spring Security APIs or your own implementation.
   - Update config (e.g. `config-dev.yml`, test `application.properties`) to drop `authenticator.methods.db.service=org.ohdsi.authenticator.service.jdbc.JdbcAuthService`.

   This is a non-trivial auth refactor but lets you drop OHDSI repos entirely.

2. **Vendor the library**  
   Clone [OHDSI/Authenticator](https://github.com/OHDSI/Authenticator), build it, and install to local Maven:

   ```bash
   git clone https://github.com/OHDSI/Authenticator.git && cd Authenticator
   mvn install -DskipTests
   ```

   Then your Arachne build will resolve `org.ohdsi:authenticator` from `~/.m2` and **will not need repo.ohdsi.org** for that dependency. You still need to run this install step (or add Authenticator as a Git submodule and build it in your root POM) whenever you use a clean environment.

3. **Keep OHDSI repo**  
   Ensure the build can reach `repo.ohdsi.org` (network, VPN, proxy). No code or dependency changes.

---

## Summary

| Repo | Dependencies | Remove deps? | Avoid needing repo? |
|------|--------------|--------------|---------------------|
| **Odysseus** | Internal modules only (datanode-ui, arachne-commons, arachne-common-types, arachne-sys-settings, execution-engine-commons) | No (they’re your code) | Yes: build from root so they’re in `~/.m2` |
| **OHDSI** | `org.ohdsi:authenticator` (auth) | Yes, if you replace auth with Spring Security (or vendor the JAR) | Yes: vendor Authenticator with `mvn install` from source; or remove dependency and refactor auth |

If the goal is only to get builds working when those remotes are down: **build from root** (fixes Odysseus), and **vendor OHDSI Authenticator** or refactor auth (fixes OHDSI).
