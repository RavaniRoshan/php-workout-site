@echo off
echo Starting Workout Generator Development Environment...
echo.
echo 🚀 Building assets...
call npm run build
echo.
echo 📁 Starting PHP development server on http://localhost:8000
echo 🔄 Starting CSS/JS watch mode...
echo.
echo Press Ctrl+C to stop all servers
echo.

REM Start PHP server in background
start /B php -S localhost:8000

REM Start CSS and JS watch in parallel
start /B npm run watch:css
start /B npm run watch:js

echo ✅ Development servers started!
echo 📍 Visit: http://localhost:8000
echo.
pause