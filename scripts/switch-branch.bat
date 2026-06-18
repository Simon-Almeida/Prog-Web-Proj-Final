@echo off
set AUTO_YES=0
for %%a in (%*) do if "%%a"=="-y" set AUTO_YES=1

if "%~1"=="" (
    echo Usage: switch-branch.bat ^<branch^> [-y]
    exit /b 1
)
if "%~1"=="-y" (
    echo Usage: switch-branch.bat ^<branch^> [-y]
    exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set CURRENT_BRANCH=%%b

set DIRTY=0
git diff --quiet >nul 2>&1
if errorlevel 1 set DIRTY=1
git diff --cached --quiet >nul 2>&1
if errorlevel 1 set DIRTY=1

echo --- Preview ---
echo   From : %CURRENT_BRANCH%
echo   To   : %~1
if "%DIRTY%"=="1" echo   Stash: yes (uncommitted changes detected)
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
if "%DIRTY%"=="1" git stash

git switch %~1

if "%DIRTY%"=="1" git stash pop
