@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

set "PASSWORD=libretv"
if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        set "KEY=%%A"
        set "VAL=%%B"
        if "!KEY!"=="PASSWORD" (
            set "PASSWORD=!VAL!"
        )
    )
)

echo Starting LibreTV on http://localhost:8080 ...
echo Default Password: %PASSWORD%
npm run start
pause
