@echo off
REM ===========================================================
REM  Confi-dent Family Dental Care - double-click launcher
REM  Runs start.ps1 to launch the backend and frontend.
REM ===========================================================
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0start.ps1"
echo.
echo Servers are starting in separate windows.
echo This window can be closed.
pause
