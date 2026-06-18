@echo off
if "%~1"=="" (
    echo Usage: switch-branch.bat ^<branch^>
    exit /b 1
)

set STASHED=0

git diff --quiet >nul 2>&1
if errorlevel 1 (
    git stash
    set STASHED=1
    goto :doswitch
)
git diff --cached --quiet >nul 2>&1
if errorlevel 1 (
    git stash
    set STASHED=1
)

:doswitch
git switch %~1

if "%STASHED%"=="1" (
    git stash pop
)
