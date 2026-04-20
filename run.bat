@echo off
echo =========================================
echo   Starting Smart Sweep Enterprise App...
echo =========================================
echo.

:: Inherit PYTHONPATH cleanly to avoid passing '&' in start command strings
set "PYTHONPATH=%cd%"

:: Start Backend in a new window using inherited variables
echo Starting FastAPI Backend (Port 8000)...
start "Smart Sweep - Backend" cmd /k "python backend\main.py"

timeout /t 2 /nobreak > nul

:: Start Frontend bypassing npm run dev to avoid path '&' bugs
echo Starting Vite Frontend (Port 5173)...
start "Smart Sweep - Frontend" cmd /k "cd frontend && node node_modules\vite\bin\vite.js"

echo.
echo All processes launched!
echo - Your dashboard will be available at: http://localhost:5173
echo - Press Ctrl+C in either prompt window to shut it down.
echo.
pause
