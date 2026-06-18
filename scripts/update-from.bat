@echo off
if "%~1"=="" (
    echo Usage: update-from.bat ^<source-branch^>
    echo Example: update-from.bat main
    exit /b 1
)

git fetch origin
git merge origin/%~1
