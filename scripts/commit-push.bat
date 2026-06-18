@echo off
set AUTO_YES=0
set COMMIT_MSG=%~1

for %%a in (%*) do if "%%a"=="-y" set AUTO_YES=1
if "%COMMIT_MSG%"=="-y" set COMMIT_MSG=

if "%COMMIT_MSG%"=="" (
    echo Usage: commit-push.bat "commit message" [-y]
    exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set BRANCH=%%b
if "%BRANCH%"=="main" (
    echo ERROR: You are on the main branch. Switch to a feature branch before committing.
    exit /b 1
)

echo --- Preview ---
echo   Branch : %BRANCH%
echo   Commit : %COMMIT_MSG%
echo   Push   : origin/%BRANCH%
echo.
echo Files to stage:
git status --short
echo.

if "%AUTO_YES%"=="1" (
    echo Auto-confirming (-y).
    goto :do_it
)
set /p REPLY=Proceed? [y/N]:
if /i not "%REPLY%"=="y" (
    echo Aborted.
    exit /b 0
)

:do_it
git add .
git commit -m "%COMMIT_MSG%"
git push -u origin %BRANCH%
