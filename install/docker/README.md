# Installation with Docker

This folder contains ARACHNE DataNode deployment scripts for released versions.

## Prerequisites 
* Installed Docker 
  * Windows - https://docs.docker.com/desktop/install/windows-install/
  * Linux - https://docs.docker.com/desktop/install/linux-install/
  * Mac - https://docs.docker.com/desktop/install/mac-install/
* Enabled "Hyper-V Windows Features" for Windows systems

## Deployment in Windows Environment
The PowerShell `install.ps1` script automates the application setup process for Docker and Hyper-V on a Windows machine. It also ensures that necessary Docker network, volumes, and folders are created. Additionally, it downloads required files and runs a Docker Compose script to set up an environment for Arachne Datanode.

### Deployment steps
1. Clone the repository
2. Open PowerShell console as Administrator
3. Navigate to local repository directory `install\docker` in console
4. Run the following command to be able to execute the `install.ps1` file:
```commandline
Set-ExecutionPolicy -ExecutionPolicy ByPass -Scope CurrentUser
```
5. Run the script
```commandline
.\install.ps1
```
6. Open browser and navigate to `http://localhost:8080`
7. The default credentials are:
- Username: admin
- Password: ohdsi
   




