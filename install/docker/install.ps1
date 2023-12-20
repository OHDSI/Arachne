# This script checks if Docker is already installed and Hyper-V is enabled
# You should run this script as an Adminstrator
# Before running the script, make sure that your execution policy allows script execution.
# You can set the execution policy by running:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine

#Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
Set-ExecutionPolicy -ExecutionPolicy ByPass -Scope CurrentUser
try {
    # Check if Docker is already installed
    $dockerInstalled = Test-Path "C:\Program Files\Docker\Docker\Docker Desktop.exe"

    if (-not $dockerInstalled) {
        Write-Host "Please install Docker"
    } else {
        Write-Host "Docker is already installed."
    }

    # Check if Hyper-V is already enabled
    $hypervEnabled = Get-WindowsOptionalFeature -FeatureName Microsoft-Hyper-V-All -Online | Select-Object -ExpandProperty State

    if ($hypervEnabled -eq 'Enabled') {
        Write-Host "Hyper-V is already enabled."
    } else {
        # Enable Hyper-V
        Write-Host "Enabling Hyper-V..."
        Enable-WindowsOptionalFeature -FeatureName Microsoft-Hyper-V-All -Online -NoRestart
    }

    # Start Docker Desktop
    Start-Process -FilePath "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Starting Docker Engine..."

    # Check if Docker is running
    $dockerRunning = $false
    $maxAttempts = 30
    $attempts = 0

    while ($attempts -lt $maxAttempts -and -not $dockerRunning) {
        try {
            # Check if Docker is running using "docker ps" command
            $dockerPsOutput = docker ps 2>$null
            if ($null -eq $dockerPsOutput) {
                throw "Docker is not yet running."
            }

            $dockerRunning = $true
        } catch {
            Write-Host "$($_.Exception.Message) Retrying..."
            Start-Sleep -Seconds 1
            $attempts++
        }
    }

    if ($dockerRunning) {
        Write-Host "Docker has started successfully."
    } else {
        Write-Host "Docker did not start within the expected time."
    }

    # Create Docker Networks and Volumes if not exists

    Write-Host "Creating Docker Networks and Volumes if not exists"

    $networkName = "arachne-network"
    $networkExists = docker network inspect $networkName 2>$null

    if ($null -eq $networkExists) {
        Write-Host "Docker network $networkName already exists."
    } else {
        Write-Host "Creating Docker network: $networkName"
        docker network create $networkName
    }

    $volumeNames = @("arachne-pg-data", "arachne-datanode-files")

    foreach ($volumeName in $volumeNames) {
        $volumeExists = docker volume inspect $volumeName 2>$null

        if ($null -eq $volumeExists) {
            Write-Host "Docker volume $volumeName already exists."
        } else {
            Write-Host "Creating Docker volume: $volumeName"
            docker volume create $volumeName
        }
    }

    # Create ArachneDatanode Folder if not exists
    $datanodeFolderPathDist = Join-Path $env:USERPROFILE "ArachneDatanode\dist"
    if (-not (Test-Path $datanodeFolderPathDist -PathType Container)) {
        New-Item -ItemType Directory -Path $datanodeFolderPathDist
        Write-Host "Created ArachneDatanode R-Package folder."
    } else {
        Write-Host "ArachneDatanode dist folder already exists."
    }
    $datanodeFolderPathTmp = Join-Path $env:USERPROFILE "ArachneDatanode\execution-engine\tmp"
    if (-not (Test-Path $datanodeFolderPathTmp -PathType Container)) {
        New-Item -ItemType Directory -Path $datanodeFolderPathTmp
        Write-Host "Created ArachneDatanode EE temp folder."
    } else {
        Write-Host "ArachneDatanode tmp folder already exists."
    }

    # Specify the file names and URLs
    $fileInfo = @{
        rPackage = @{
            fileName = "r_base_focal_amd64.tar.gz"
            url = "https://storage.googleapis.com/arachne-datanode/r_base_focal_amd64.tar.gz"
            sizeThresholdMB = 3900
        }
        descriptor = @{
            fileName = "descriptor_base.json"
            url = "https://storage.googleapis.com/arachne-datanode/descriptor_base.json"
            sizeThresholdMB = 0.01
        }
        envfile = @{
            fileName = "datanode-windows.env"
            url = "https://storage.googleapis.com/arachne-datanode/datanode.env"
            sizeThresholdMB = 0.01
        }
    }

    # Function to get file size from URL using BitsTransfer
    function Get-FileSizeFromURL($url) {
        try {
            $response = Invoke-WebRequest -Uri $url -Method Head
            $contentLength = $response.Headers['Content-Length']

            if (-not $contentLength) {
                throw "Content-Length header not found in the response."
            }

            return [long]$contentLength
        } catch {
            Write-Host "Error getting file size from ${url}: $_"
            return $null
        }
    }

    # Function to download files if needed using BitsTransfer
    function DownloadFileIfNeeded-With-BitsTransfer {
        param(
            [string]$url,
            [string]$outputPath,
            [string]$fileName,
            [double]$fileSizeThreshold
        )

        $filePath = Join-Path $outputPath $fileName

        if (-not (Test-Path $filePath) -or (Get-Item $filePath).length / 1MB -lt $fileSizeThreshold) {
            Start-BitsTransfer -Source $url -Destination $filePath
        }
    }

    # Check and display file size from download links
    foreach ($key in $fileInfo.Keys) {
        $file = $fileInfo[$key]
        $fileSize = Get-FileSizeFromURL -url $file.url
        Write-Host "$($file.fileName) size: $($fileSize / 1MB) MB"

        DownloadFileIfNeeded-With-BitsTransfer -url $file.url -outputPath $datanodeFolderPathDist -fileName $file.fileName -fileSizeThreshold $file.sizeThresholdMB
    }

    Write-Host "File check and download completed."

    $dockerComposeScriptPath = ".\docker-compose-windows.yml"

    if (Test-Path $dockerComposeScriptPath) {
        Write-Host "Running Docker Compose script..."
        try {
            # Run Docker Compose script and capture output
            $dockerComposeResult = docker-compose -f $dockerComposeScriptPath up -d 2>&1
            $dockerComposeExitCode = $LASTEXITCODE

            # Display Docker Compose output in console
            Write-Host "Docker Compose output:"
            Write-Host $dockerComposeResult

            if ($dockerComposeExitCode -eq 0) {
                Write-Host "Docker Compose script executed successfully."
            } else {
                Write-Host "Error running Docker Compose script. Exit code: $dockerComposeExitCode"
                Write-Host "Script execution failed."
                exit 1
            }
        } catch {
            Write-Host "Error running Docker Compose script: $_"
            Write-Host "Script execution failed."
            exit 1
        }
    } else {
        Write-Host "Docker Compose script not found at: $dockerComposeScriptPath"
        Write-Host "Script execution failed."
        exit 1
    }

    Write-Host "Script executed successfully."

} catch {
    Write-Host "Error: $_"
    Write-Host "Script execution failed."
    exit 1
}