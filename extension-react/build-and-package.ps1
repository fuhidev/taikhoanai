# PowerShell script to build and package Chrome extension
param(
    [string]$Version = $null,
    [switch]$NoAutoIncrement = $false
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
    Write-ColorOutput "Building extension..." $Blue
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed with exit code $LASTEXITCODE"
        }
        Write-ColorOutput "Build completed successfully!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "Build failed: $_" $Red
        return $false
    }
}

function Rename-DistFolder($Version) {
    $distPath = "dist"
    $newFolderName = "taikhoanai.io.vn"
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
    $zipFileName = "taikhoanai.io.vn-v$Version.zip"
    
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

function Increment-Version($CurrentVersion) {
    try {
        # Parse version (assuming semantic versioning: major.minor.patch)
        $versionParts = $CurrentVersion.Split('.')
        
        if ($versionParts.Length -eq 3) {
            # Increment patch version
            $major = [int]$versionParts[0]
            $minor = [int]$versionParts[1]
            $patch = [int]$versionParts[2] + 1
            $newVersion = "$major.$minor.$patch"
        } elseif ($versionParts.Length -eq 2) {
            # If only major.minor, add patch version
            $major = [int]$versionParts[0]
            $minor = [int]$versionParts[1] + 1
            $newVersion = "$major.$minor.0"
        } else {
            # If single number, increment it
            $version = [int]$CurrentVersion + 1
            $newVersion = $version.ToString()
        }
        
        Write-ColorOutput "Auto-incremented version: $CurrentVersion -> $newVersion" $Green
        return $newVersion
    }
    catch {
        Write-ColorOutput "Error incrementing version: $_" $Red
        return $null
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

# Determine target version
if ($Version) {
    # Use provided version
    $targetVersion = $Version
    Write-ColorOutput "Using provided version: $targetVersion" $Blue
} elseif (-not $NoAutoIncrement) {
    # Auto-increment version
    $targetVersion = Increment-Version $currentVersion
    if (-not $targetVersion) {
        Write-ColorOutput "Failed to increment version" $Red
        exit 1
    }
} else {
    # Use current version (no increment)
    $targetVersion = $currentVersion
    Write-ColorOutput "Using current version (no auto-increment): $targetVersion" $Blue
}

Write-ColorOutput "Current version: $currentVersion" $Blue
Write-ColorOutput "Target version: $targetVersion" $Blue

# Update version if different
if ($targetVersion -ne $currentVersion) {
    if (-not (Update-ManifestVersion $targetVersion)) {
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
