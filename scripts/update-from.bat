@echo off
if "%~1"=="" (
    echo Usage: update-from.bat ^<source-branch^>
    echo Example: update-from.bat main
    exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set CURRENT_BRANCH=%%b

echo --- Preview ---
echo   git fetch origin
echo   git merge --no-edit origin/%~1  (into %CURRENT_BRANCH%)
echo   git push -u origin %CURRENT_BRANCH%
echo.
set /p REPLY=Proceed? [y/N]:
if /i not "%REPLY%"=="y" (
    echo Aborted.
    exit /b 0
)

git fetch origin
git merge --no-edit origin/%~1
git push -u origin %CURRENT_BRANCH%
