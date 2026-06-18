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

echo --- Preview ---
echo   Branch : %BRANCH%
echo   Commit : %~1
echo   Push   : origin/%BRANCH%
echo.
echo Files to stage:
git status --short
echo.
set /p REPLY=Proceed? [y/N]:
if /i not "%REPLY%"=="y" (
    echo Aborted.
    exit /b 0
)

git add .
git commit -m "%~1"
git push -u origin %BRANCH%
