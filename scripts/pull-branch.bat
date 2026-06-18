@echo off
set AUTO_YES=0
if "%~1"=="-y" set AUTO_YES=1

for /f "delims=" %%b in ('git branch --show-current') do set CURRENT_BRANCH=%%b

echo --- Preview ---
echo   Branch : %CURRENT_BRANCH%
echo   git fetch origin
echo   git reset --hard origin/%CURRENT_BRANCH%
echo   (local branch will match GitHub exactly; local-only commits will be lost)
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
git fetch origin
git reset --hard origin/%CURRENT_BRANCH%
