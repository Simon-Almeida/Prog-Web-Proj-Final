@echo off
set AUTO_YES=0
for %%a in (%*) do if "%%a"=="-y" set AUTO_YES=1

if "%~1"=="" (
    echo Usage: update-from.bat ^<source-branch^> [-y]
    echo Example: update-from.bat main
    exit /b 1
)
if "%~1"=="-y" (
    echo Usage: update-from.bat ^<source-branch^> [-y]
    echo Example: update-from.bat main
    exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set CURRENT_BRANCH=%%b

echo --- Preview ---
echo   git fetch origin
echo   git merge --no-edit origin/%~1  (into %CURRENT_BRANCH%)
echo   git push -u origin %CURRENT_BRANCH%
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
git merge --no-edit origin/%~1
git push -u origin %CURRENT_BRANCH%
