@echo off
title ARG Local Server - localhost:5173
cd /d "%~dp0"

set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 set "NODE_EXE=C:\Users\28146\.workbuddy\binaries\node\versions\22.22.2\node.exe"

echo.
echo  Starting ARG local server...
echo  Open this URL in your browser:  http://localhost:5173/
echo.
echo  Keep this window open. Close it to stop the server.
echo.

"%NODE_EXE%" serve.mjs
pause
