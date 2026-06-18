@echo off
if "%~1"=="" (
    echo Usage: commit-push.bat "commit message"
    exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set BRANCH=%%b
if "%BRANCH%"=="main" (
    echo ERROR: You are on the main branch. Switch to a feature branch before committing.
    exit /b 1
)

git add .
git commit -m "%~1"
git push -u origin %BRANCH%
