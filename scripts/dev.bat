@echo off

if "%~1"=="back" goto backend
if "%~1"=="backend" goto backend
if "%~1"=="front" goto frontend
if "%~1"=="frontend" goto frontend

echo Usage: dev.bat ^<service^>
echo.
echo Services:
echo   back / backend    Strapi dev server (backend/back)
echo   front / frontend  Next.js dev server (frontend/front)
exit /b 1

:backend
echo Starting Strapi backend...
cd backend\back && npm run develop
exit /b 0

:frontend
echo Starting Next.js frontend...
cd frontend\front && npm run dev
exit /b 0
