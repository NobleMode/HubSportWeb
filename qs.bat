@echo off
set "MODE=%1"
set "TYPE=%2"

REM Check if no arguments provided
if "%MODE%"=="" goto Help

REM Check for "start" command
if /I "%MODE%"=="start" (
    if /I "%TYPE%"=="full" goto FullStart
    if /I "%TYPE%"=="min" goto MinStart
    goto Help
)

:Help
echo Usage: qs start [full^|min]
echo   full : Installs dependencies, setup database (generate, push, seed), and starts servers.
echo   min  : Just starts the backend and frontend servers.
goto End

:FullStart
echo ==========================================
echo       HubSport Quick Start: FULL
echo ==========================================
echo/
echo [1/5] Backend: Installing dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend npm install failed.
    cd ..
    goto End
)

echo/
echo [2/5] Backend: Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Prisma generate failed.
    cd ..
    goto End
)

echo/
echo [3/5] Backend: Pushing DB Schema...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Prisma db push failed.
    cd ..
    goto End
)

echo/
echo [4/5] Backend: Seeding Database...
call npm run prisma:seed
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Database seeding failed.
    cd ..
    goto End
)
cd ..

echo/
echo [5/5] Frontend: Installing dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend npm install failed.
    cd ..
    goto End
)
cd ..

echo/
echo Setup complete. Starting servers...
goto MinStart

:MinStart
echo ==========================================
echo       HubSport Quick Start: SERVERS
echo ==========================================
echo/
echo Starting Backend Server...
start "HubSport Backend" /D "backend" npm run dev

echo Starting Frontend Server...
start "HubSport Frontend" /D "frontend" npm run dev

echo/
echo Servers started in background windows.
goto End

:End
