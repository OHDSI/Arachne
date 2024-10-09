# Installation with Docker

This folder contains ARACHNE DataNode deployment scripts for released versions.

## Prerequisites 
* Installed Docker 
  * Windows - https://docs.docker.com/desktop/install/windows-install/
  * Linux - https://docs.docker.com/desktop/install/linux-install/
  * Mac - https://docs.docker.com/desktop/install/mac-install/
* Enabled "Hyper-V Windows Features" for Windows systems

### Deployment steps
1. Clone the repository
2. Navigate to local repository directory `install/docker` in console
3. Run docker copose command:
```commandline
docker compose -d up
```
4. Open browser and navigate to `http://localhost:8080`
5. The default credentials are:
- Username: admin
- Password: ohdsi
   




