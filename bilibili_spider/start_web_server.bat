@echo off
echo Starting Bilibili Spider Web Server...
echo.

REM Check if Python is installed
python --version > nul 2>&1
if errorlevel 1 (
    echo Error: Python not found. Please make sure Python is installed and added to system PATH.
    pause
    exit /b 1
)

REM Check and install dependencies
if exist "requirements.txt" (
    echo Installing dependencies...
    pip install -r requirements.txt
)

echo Starting Web Server...
python web_server.py

echo.
echo Web Server has stopped
pause