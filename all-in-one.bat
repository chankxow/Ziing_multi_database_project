@echo off
REM All-in-One Setup & Runner for Ziing_multi_database_project (Windows)
REM Provides: environment verification, local setup, docker setup, DB init, docs access

setlocal EnableDelayedExpansion

echo.
echo ==============================================
echo  Ziing Multi-Database Project - All-in-One
echo ==============================================
echo.
echo 1. Local Development (create venv, install, start)
echo 2. Docker Development (docker-compose up)
echo 3. Verify Environment (Python/Node/MySQL/MongoDB)
echo 4. Initialize Databases (MySQL schema + MongoDB)
echo 5. View Combined Documentation (ALL_DOCUMENTATION.md)
echo 6. Stop Local Services (kill frontend/backend started by this script)
echo 7. Exit

enableDelayedExpansion
set /p choice="Choose an option (1-7): "

if "%choice%"=="1" goto LOCAL
if "%choice%"=="2" goto DOCKER
if "%choice%"=="3" goto VERIFY
if "%choice%"=="4" goto INITDB
if "%choice%"=="5" goto DOCS
if "%choice%"=="6" goto STOP
if "%choice%"=="7" goto END

echo Invalid choice. Exiting.
exit /b 1

:VERIFY
call verify-env.bat
echo.
echo Verification finished.
pause
exit /b 0

:LOCAL
echo.
echo --- Local Development Setup ---

REM Check Python
where python >nul 2>&1
if %errorlevel% neq 0 (
  echo Python not found. Please install Python 3.8+ and add to PATH.
  pause
  exit /b 1
)

REM Check Node
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo Node.js not found. Please install Node.js and npm.
  pause
  exit /b 1
)

REM Check MySQL and MongoDB presence (not mandatory)
echo Checking local DB services (if configured)...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
  echo Warning: MySQL client not found or not in PATH.
) else (
  echo MySQL client found.
)
mongosh --version >nul 2>&1
if %errorlevel% neq 0 (
  echo Warning: mongosh not found or not in PATH.
) else (
  echo mongosh found.
)

REM Backend venv + install
echo.
echo Setting up backend virtual environment...
if not exist backend\venv (
  cd backend
  python -m venv venv
  cd ..
)





































































exit /b 0endlocalecho Goodbye.:ENDexit /b 0pauseecho You must manually close the opened backend/frontend windows if they are running.echo Stopping services started by this script...:STOPexit /b 0pause)  echo ALL_DOCUMENTATION.md not found. Please run the combined-doc creation step.) else (  start "Docs" notepad ALL_DOCUMENTATION.mdif exist ALL_DOCUMENTATION.md (echo Opening combined documentation (ALL_DOCUMENTATION.md) in Notepad...:DOCSexit /b 0pause)  echo mongosh not found; skipping MongoDB init.) else (  mongosh --eval "use CarCustomShop; db.createCollection('parts')" 2>nul || echo MongoDB init attempted; please verify credentials.if %errorlevel% equ 0 (where mongosh >nul 2>&1REM MongoDB: ensure parts collection exists (requires mongosh))  echo MySQL client not found; skipping MySQL init.) else (  mysql -u root CarCustomShop < backend\sql\init.sql 2>nul || echo Failed to import init.sql. Run manually.  mysql -u root -e "CREATE DATABASE IF NOT EXISTS CarCustomShop;" 2>nul  echo Importing MySQL schema to local MySQL (requires root or configured user)...if %errorlevel% equ 0 (where mysql >nul 2>&1REM MySQL: import schema if mysql client presentecho Initializing databases (local) ...:INITDBexit /b 0pausedocker-compose up -d
necho Docker services started.)  exit /b 1  pause  echo Docker not found. Please install Docker Desktop.if %errorlevel% neq 0 (where docker >nul 2>&1echo Running Docker Compose (requires Docker Desktop)...:DOCKERgoto :eofcd ..pip install -r requirements.txtcd backend
ncall venv\Scripts\activate.bat >nul 2>&1:ACTIVATE_AND_INSTALLexit /b 0pauseecho Local dev started. Backend: http://localhost:5000  Frontend: http://localhost:5173start "Frontend" cmd /k "cd frontend && npm install --no-audit --no-fund && npm run dev"start "Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python app.py"
necho Starting backend and frontend in new terminals...ncall :ACTIVATE_AND_INSTALL