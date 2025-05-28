# PowerShell script to build and package Chrome extension
param(
    [string]$Version = $null,
    [string]$Mode = "production"
)

# Colors for output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Blue = "Blue"

function Write-ColorOutput($Message, $Color) {
    Write-Host $Message -ForegroundColor $Color
}

function Get-VersionFromManifest {
    try {
        $manifestPath = "public/manifest.json"
        if (Test-Path $manifestPath) {
            $manifest = Get-Content $manifestPath | ConvertFrom-Json
            return $manifest.version
        }
        return $null
    }
    catch {
        Write-ColorOutput "Error reading manifest.json: $_" $Red
        return $null
    }
}

function Update-ManifestVersion($NewVersion) {
    try {
        $manifestPath = "public/manifest.json"
        $manifest = Get-Content $manifestPath | ConvertFrom-Json
        $manifest.version = $NewVersion
        $manifest | ConvertTo-Json -Depth 10 | Set-Content $manifestPath
        Write-ColorOutput "Updated manifest.json version to $NewVersion" $Green
        return $true
    }
    catch {
        Write-ColorOutput "Error updating manifest.json: $_" $Red
        return $false
    }
}

function Build-Extension {
    Write-ColorOutput "Building extension in $Mode mode..." $Blue
    try {
        if ($Mode -eq "development") {
            npm run build:dev
        } elseif ($Mode -eq "production") {
            npm run build:prod
        } else {
            npm run build
        }
        
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed with exit code $LASTEXITCODE"
        }
        Write-ColorOutput "Build completed successfully in $Mode mode!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "Build failed: $_" $Red
        return $false
    }
}

function Rename-DistFolder($Version) {
    $distPath = "dist"
    $newFolderName = "aigiare.vn-v$Version"
    $newPath = $newFolderName
    
    try {
        # Remove existing folder if exists
        if (Test-Path $newPath) {
            Remove-Item -Path $newPath -Recurse -Force
            Write-ColorOutput "Removed existing folder: $newPath" $Yellow
        }
        
        # Rename dist folder
        if (Test-Path $distPath) {
            Rename-Item -Path $distPath -NewName $newFolderName
            Write-ColorOutput "Renamed $distPath to $newFolderName" $Green
            return $newPath
        } else {
            throw "Dist folder not found"
        }
    }
    catch {
        Write-ColorOutput "Error renaming folder: $_" $Red
        return $null
    }
}

function Create-ZipPackage($FolderPath, $Version) {
    # Add mode suffix to filename for development builds
    $modePrefix = if ($Mode -eq "development") { "-dev" } else { "" }
    $zipFileName = "aigiare.vn-v$Version$modePrefix.zip"
    
    try {
        # Remove existing zip if exists
        if (Test-Path $zipFileName) {
            Remove-Item -Path $zipFileName -Force
            Write-ColorOutput "Removed existing zip: $zipFileName" $Yellow
        }
        
        # Create zip using PowerShell 5.0+ Compress-Archive
        Compress-Archive -Path $FolderPath -DestinationPath $zipFileName -Force
        
        Write-ColorOutput "Created package: $zipFileName" $Green
        
        # Get file size
        $fileSize = (Get-Item $zipFileName).Length
        $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
        Write-ColorOutput "Package size: $fileSizeMB MB" $Blue
        
        return $zipFileName
    }
    catch {
        Write-ColorOutput "Error creating zip package: $_" $Red
        return $null
    }
}

function Cleanup-TempFolder($FolderPath) {
    try {
        if (Test-Path $FolderPath) {
            Remove-Item -Path $FolderPath -Recurse -Force
            Write-ColorOutput "Cleaned up temporary folder: $FolderPath" $Yellow
        }
    }
    catch {
        Write-ColorOutput "Warning: Could not cleanup folder $FolderPath : $_" $Yellow
    }
}

# Main execution
Write-ColorOutput "=== Chrome Extension Build & Package Script ===" $Blue

# Get version
$currentVersion = Get-VersionFromManifest
if (-not $currentVersion) {
    Write-ColorOutput "Could not read version from manifest.json" $Red
    exit 1
}

# Use provided version or current version
$targetVersion = if ($Version) { $Version } else { $currentVersion }

Write-ColorOutput "Current version: $currentVersion" $Blue
Write-ColorOutput "Target version: $targetVersion" $Blue

# Update version if different
if ($Version -and $Version -ne $currentVersion) {
    if (-not (Update-ManifestVersion $Version)) {
        exit 1
    }
}

# Build extension
if (-not (Build-Extension)) {
    exit 1
}

# Rename dist folder
$renamedFolder = Rename-DistFolder $targetVersion
if (-not $renamedFolder) {
    exit 1
}

# Create zip package
$zipFile = Create-ZipPackage $renamedFolder $targetVersion
if (-not $zipFile) {
    Cleanup-TempFolder $renamedFolder
    exit 1
}

# Cleanup temporary folder (optional - comment out if you want to keep it)
Cleanup-TempFolder $renamedFolder

Write-ColorOutput "=== Build & Package Complete ===" $Green
Write-ColorOutput "Package created: $zipFile" $Green
Write-ColorOutput "Ready for Chrome Web Store upload!" $Green
