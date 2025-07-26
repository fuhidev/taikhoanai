@echo off
setlocal enabledelayedexpansion

echo === Chrome Extension Build ^& Package Script ===

:: Get version from manifest.json (simplified - assumes version is on its own line)
for /f "tokens=2 delims=:, " %%a in ('findstr "version" public\manifest.json') do (
    set VERSION=%%a
    set VERSION=!VERSION:"=!
    goto :found_version
)
:found_version

echo Current version: %VERSION%

:: Build extension
echo Building extension...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

:: Set folder and zip names
set FOLDER_NAME=taikhoanai.io.vn-v%VERSION%
set ZIP_NAME=taikhoanai.io.vn-v%VERSION%.zip

:: Remove existing files if they exist
if exist "%FOLDER_NAME%" rmdir /s /q "%FOLDER_NAME%"
if exist "%ZIP_NAME%" del "%ZIP_NAME%"

:: Rename dist folder
if exist "dist" (
    ren "dist" "%FOLDER_NAME%"
    echo Renamed dist to %FOLDER_NAME%
) else (
    echo Error: dist folder not found!
    pause
    exit /b 1
)

:: Create zip file using PowerShell
echo Creating zip package...
powershell -Command "Compress-Archive -Path '%FOLDER_NAME%' -DestinationPath '%ZIP_NAME%' -Force"

if %errorlevel% equ 0 (
    echo Package created: %ZIP_NAME%
    
    :: Get file size
    for %%I in ("%ZIP_NAME%") do set SIZE=%%~zI
    set /a SIZE_MB=!SIZE!/1024/1024
    echo Package size: !SIZE_MB! MB
    
    :: Cleanup
    rmdir /s /q "%FOLDER_NAME%"
    echo Cleaned up temporary folder
    
    echo === Build ^& Package Complete ===
    echo Ready for Chrome Web Store upload!
) else (
    echo Error creating zip package!
    pause
    exit /b 1
)

pause
