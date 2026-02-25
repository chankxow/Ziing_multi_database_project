@echo off
REM  - ระบบตรวจสอบและรันโครงการ
REM ระบบรวม: ตรวจสอบระบบ, ทดสอบการติดตั้ง, ทดสอบฐานข้อมูล, ตรวจสอบการเชื่อมต่อ

setlocal EnableDelayedExpansion

chcp 65001 >nul
cls

echo.
echo ════════════════════════════════════════════════════════════════
echo   Ziing Multi-Database Project - ระบบครบเครื่อง 
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. ✓ ตรวจสอบระบบ (ตรวจสอบ Python/Node.js/MySQL/MongoDB)
echo 2. ✓ ทดสอบการติดตั้ง (test dependencies)
echo 3. ✓ ตรวจสอบฐานข้อมูล (MySQL/MongoDB)
echo 4. ✓ ตรวจสอบการเชื่อมต่อ (connection test)
echo 5. ⚙️ ตั้งค่าการพัฒนาท้องถิ่น (Local Development)
echo 6. � เตรียมฐานข้อมูล (Initialize Database)
echo 7. 📖 ดูเอกสารประกอบ
echo 8. 🚀 รันทั้งหมด (Local Setup + Database)
echo 9. 🔃 รีสตาร์ท Services
echo 10. ❌ ปิด Services
echo 11. 🚪 ออก
echo.
set /p choice="เลือกตัวเลือก (1-11): "

if "%choice%"=="1" goto CHECK_SYSTEM
if "%choice%"=="2" goto TEST_INSTALL
if "%choice%"=="3" goto CHECK_DATABASE
if "%choice%"=="4" goto CHECK_CONNECTION
if "%choice%"=="5" goto LOCAL_SETUP
if "%choice%"=="6" goto INIT_DATABASE
if "%choice%"=="7" goto VIEW_DOCS
if "%choice%"=="8" goto FULL_SETUP
if "%choice%"=="9" goto RESTART_SERVICES
if "%choice%"=="10" goto STOP_SERVICES
if "%choice%"=="11" goto END

echo ❌ ตัวเลือกไม่ถูกต้อง
pause
goto START

:CHECK_SYSTEM
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   ✓ ตรวจสอบระบบ
echo ════════════════════════════════════════════════════════════════
echo.

setlocal EnableDelayedExpansion
set check_pass=0
set check_fail=0

REM Python Check
echo [1/4] ตรวจสอบ Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
  for /f "tokens=*" %%i in ('python --version 2^>^&1') do set py_ver=%%i
  echo ✅ !py_ver!
  set /a check_pass+=1
) else (
  echo ❌ Python ไม่พบ
  call :INSTALL_CONFIRM "Python" "https://www.python.org"
  set /a check_fail+=1
)

REM Node.js Check
echo [2/4] ตรวจสอบ Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
  for /f "tokens=*" %%i in ('node --version 2^>^&1') do set node_ver=%%i
  echo ✅ Node.js !node_ver!
  set /a check_pass+=1
) else (
  echo ❌ Node.js ไม่พบ
  call :INSTALL_CONFIRM "Node.js" "https://nodejs.org"
  set /a check_fail+=1
)

REM MySQL Check
echo [3/4] ตรวจสอบ MySQL...
mysql --version >nul 2>&1
if %errorlevel% equ 0 (
  for /f "tokens=*" %%i in ('mysql --version 2^>^&1') do set mysql_ver=%%i
  echo ✅ !mysql_ver!
  set /a check_pass+=1
) else (
  echo ❌ MySQL ไม่พบ
  call :INSTALL_CONFIRM "MySQL" "https://dev.mysql.com/downloads/mysql"
  set /a check_fail+=1
)

REM MongoDB Check
echo [4/4] ตรวจสอบ MongoDB...
mongosh --version >nul 2>&1
if %errorlevel% equ 0 (
  for /f "tokens=*" %%i in ('mongosh --version 2^>^&1') do set mongo_ver=%%i
  echo ✅ !mongo_ver!
  set /a check_pass+=1
) else (
  echo ❌ MongoDB/mongosh ไม่พบ
  call :INSTALL_CONFIRM "MongoDB" "https://www.mongodb.com/try/download/community"
  set /a check_fail+=1
)

echo.
echo ────────────────────────────────────────
echo ผลสรุป: ✅ !check_pass! / ❌ !check_fail!
echo ────────────────────────────────────────
echo.
pause
goto START

:TEST_INSTALL
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   ✓ ทดสอบการติดตั้ง Dependencies
echo ════════════════════════════════════════════════════════════════
echo.

setlocal EnableDelayedExpansion
set test_pass=0
set test_fail=0

REM Test Python modules
echo [1/3] ทดสอบ Python packages...
python -c "import flask" 2>nul
if %errorlevel% equ 0 (
  echo ✅ Flask OK
  set /a test_pass+=1
) else (
  echo ❌ Flask ไม่พบ
  call :INSTALL_PIP_PACKAGE "backend" "flask"
  set /a test_fail+=1
)

python -c "import pymysql" 2>nul
if %errorlevel% equ 0 (
  echo ✅ PyMySQL OK
  set /a test_pass+=1
) else (
  echo ❌ PyMySQL ไม่พบ
  call :INSTALL_PIP_PACKAGE "backend" "pymysql"
  set /a test_fail+=1
)

python -c "import pymongo" 2>nul
if %errorlevel% equ 0 (
  echo ✅ PyMongo OK
  set /a test_pass+=1
) else (
  echo ❌ PyMongo ไม่พบ
  call :INSTALL_PIP_PACKAGE "backend" "pymongo"
  set /a test_fail+=1
)

REM Test npm packages
echo [2/3] ตรวจสอบ frontend npm...
if exist frontend\node_modules (
  echo ✅ Node modules มี
  set /a test_pass+=1
) else (
  echo ❌ Node modules ไม่มี
  call :INSTALL_NPM_MODULES
  set /a test_fail+=1
)

REM Test backend venv
echo [3/3] ตรวจสอบ backend venv...
if exist backend\venv (
  echo ✅ Virtual environment มี
  set /a test_pass+=1
) else (
  echo ❌ Virtual environment ไม่มี
  call :CREATE_VENV
  set /a test_fail+=1
)

echo.
echo ────────────────────────────────────────
echo ผลสรุป: ✅ !test_pass! / ❌ !test_fail!
echo ────────────────────────────────────────
echo.
pause
goto START

:CHECK_DATABASE
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   ✓ ตรวจสอบฐานข้อมูล
echo ════════════════════════════════════════════════════════════════
echo.

REM MySQL Database Check
echo [1/2] ตรวจสอบ MySQL...
mysql -u root -e "SELECT 1" 2>nul >nul
if %errorlevel% equ 0 (
  echo ✅ MySQL กำลังทำงาน
  echo ตรวจดู Databases:
  mysql -u root -e "SHOW DATABASES;" 2>nul | find "CarCustomShop" >nul
  if %errorlevel% equ 0 (
    echo ✅ Database 'CarCustomShop' มี
  ) else (
    echo ⚠️ Database 'CarCustomShop' ไม่มี (กรุณารันตัวเลือก 7 เพื่อเตรียมฐานข้อมูล)
  )
) else (
  echo ❌ MySQL ไม่สามารถเชื่อมต่อ
  echo    - ตรวจสอบว่า MySQL กำลังทำงาน
  echo    - ตรวจสอบชื่อผู้ใช้และรหัสผ่าน
)

REM MongoDB Check
echo.
echo [2/2] ตรวจสอบ MongoDB...
mongosh admin --eval "db.adminCommand('ping')" --quiet 2>nul >nul
if %errorlevel% equ 0 (
  echo ✅ MongoDB กำลังทำงาน
  mongosh --eval "db.getMongo().getDBNames()" --quiet 2>nul | find "CarCustomShop" >nul
  if %errorlevel% equ 0 (
    echo ✅ Database 'CarCustomShop' มี
  ) else (
    echo ⚠️ Database 'CarCustomShop' ไม่มี (จะสร้างเมื่อรันอ้าง request แรก)
  )
) else (
  echo ❌ MongoDB ไม่สามารถเชื่อมต่อ
  echo    - ตรวจสอบว่า MongoDB กำลังทำงาน
)

echo.
pause
goto START

:CHECK_CONNECTION
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   ✓ ตรวจสอบการเชื่อมต่อ
echo ════════════════════════════════════════════════════════════════
echo.

REM Test MySQL Connection
echo [1/2] ทดสอบการเชื่อมต่อ MySQL (localhost:3306)...
mysql -h localhost -u root -e "SELECT 1" 2>nul >nul
if %errorlevel% equ 0 (
  echo ✅ พอร์ต 3306 พร้อมใช้งาน
  echo ✅ สามารถเชื่อมต่อเป็น root@localhost
) else (
  echo ❌ ไม่สามารถเชื่อมต่อ MySQL
  echo    - ตรวจสอบว่า MySQL Service ทำงาน
  echo    - ログกรุณาแก้ไขรหัสผ่านใน .env
)

REM Test MongoDB Connection
echo.
echo [2/2] ทดสอบการเชื่อมต่อ MongoDB (localhost:27017)...
mongosh --eval "db.adminCommand('ping')" --quiet 2>nul >nul
if %errorlevel% equ 0 (
  echo ✅ พอร์ต 27017 พร้อมใช้งาน
  echo ✅ สามารถเชื่อมต่อ MongoDB
) else (
  echo ❌ ไม่สามารถเชื่อมต่อ MongoDB
  echo    - ตรวจสอบว่า MongoDB Service ทำงาน
  echo    - ตรวจสอบ MongoDB connection string
)

echo.
pause
goto START

:LOCAL_SETUP
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   ⚙️ ตั้งค่าการพัฒนาท้องถิ่น
echo ════════════════════════════════════════════════════════════════
echo.

REM Verify prerequisites
python --version >nul 2>&1 || (echo ❌ Python ไม่พบ && pause && goto START)
node --version >nul 2>&1 || (echo ❌ Node.js ไม่พบ && pause && goto START)

REM Backend setup
echo [1/2] ตั้งค่า Backend...
if not exist backend\venv (
  echo สร้าง Virtual Environment...
  cd backend
  python -m venv venv
  cd ..
)

cd backend
call venv\Scripts\activate.bat >nul 2>&1
pip install -q -r requirements.txt
if not exist .env (
  copy .env.example .env >nul
  echo ✅ สร้าง .env
)
cd ..
echo ✅ Backend พร้อม

REM Frontend setup
echo [2/2] ตั้งค่า Frontend...
cd frontend
if not exist node_modules (
  npm install --quiet --no-audit --no-fund
)
if not exist .env (
  echo VITE_API_URL=http://localhost:5000 > .env
)
cd ..
echo ✅ Frontend พร้อม

echo.
echo ────────────────────────────────────────
echo ✅ ตั้งค่าเสร็จแล้ว!
echo ────────────────────────────────────────
echo.
echo 🚀 เริ่มต้นบริการ...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
start "Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python app.py"
start "Frontend" cmd /k "cd frontend && npm run dev"
echo ✅ บริการกำลังเริ่มต้น
pause
goto START

:INIT_DATABASE
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   💾 เตรียมฐานข้อมูล
echo ════════════════════════════════════════════════════════════════
echo.

REM MySQL init
echo [1/2] เตรียม MySQL...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS CarCustomShop;" 2>nul
if %errorlevel% equ 0 (
  mysql -u root CarCustomShop < backend\sql\init.sql 2>nul
  echo ✅ MySQL ตั้งค่าเสร็จแล้ว
) else (
  echo ⚠️ ไม่สามารถเตรียม MySQL (ต้องเปิด MySQL Service ก่อน)
)

REM MongoDB init
echo [2/2] เตรียม MongoDB...
mongosh --eval "use CarCustomShop; db.createCollection('parts')" --quiet 2>nul
if %errorlevel% equ 0 (
  echo ✅ MongoDB ตั้งค่าเสร็จแล้ว
) else (
  echo ⚠️ ไม่สามารถเตรียม MongoDB (ต้องเปิด MongoDB Service ก่อน)
)

echo.
pause
goto START

:VIEW_DOCS
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   📖 เอกสารประกอบ
echo ════════════════════════════════════════════════════════════════
echo.

if exist Documentation.md (
  start "เอกสาร" notepad Documentation.md
) else if exist ALL_DOCUMENTATION_TH.md (
  start "เอกสาร" notepad ALL_DOCUMENTATION_TH.md
) else (
  echo ❌ ไม่พบเอกสาร (Documentation.md)
)

pause
goto START

:FULL_SETUP
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   🚀 เริ่มการตั้งค่าแบบสมบูรณ์
echo ════════════════════════════════════════════════════════════════
echo.

call :LOCAL_SETUP
REM ════════════════════════════════════════════════════════════════
REM   ฟังก์ชันสำหรับติดตั้งอัตโนมัติ
REM ════════════════════════════════════════════════════════════════

:INSTALL_CONFIRM
echo.
set /p install_confirm="๏ ต้องการติดตั้ง %~1 หรือไม่? (y/n): "
if /i "%install_confirm%"=="y" (
  echo 🔗 เปิดลิงค์ดาวน์โหลด: %~2
  start "" %~2
  echo ⏳ กรุณารอ 5 วินาที...
  timeout /t 5
  echo.
  echo 📝 โปรดติดตั้ง %~1 แล้วเพิ่ม PATH หลังจากติดตั้งเสร็จแล้ว
  echo 📝 จากนั้นรัน check system ใหม่
  echo.
) else (
  echo ⏭️ ข้ามการติดตั้ง %~1
)
goto :eof

:INSTALL_PIP_PACKAGE
echo.
set package=%~2
set project_dir=%~1
set /p pip_confirm="๏ ต้องการติดตั้ง %package% หรือไม่? (y/n): "
if /i "%pip_confirm%"=="y" (
  echo ⏳ กำลังติดตั้ง %package%...
  cd %project_dir%
  if exist venv (
    call venv\Scripts\activate.bat
    pip install %package%
  ) else (
    pip install %package%
  )
  cd ..
  echo ✅ %package% ติดตั้งแล้ว
) else (
  echo ⏭️ ข้ามการติดตั้ง %package%
)
goto :eof

:CREATE_VENV
echo.
set /p venv_confirm="๏ ต้องการสร้าง Virtual Environment หรือไม่? (y/n): "
if /i "%venv_confirm%"=="y" (
  echo ⏳ กำลังสร้าง venv...
  cd backend
  python -m venv venv
  call venv\Scripts\activate.bat
  pip install -q -r requirements.txt
  cd ..
  echo ✅ Virtual Environment สร้างแล้ว
) else (
  echo ⏭️ ข้ามการสร้าง venv
)
goto :eof

:INSTALL_NPM_MODULES
echo.
set /p npm_confirm="๏ ต้องการติดตั้ง npm modules หรือไม่? (y/n): "
if /i "%npm_confirm%"=="y" (
  echo ⏳ กำลังติดตั้ง npm packages...
  cd frontend
  npm install --quiet --no-audit --no-fund
  cd ..
  echo ✅ npm modules ติดตั้งแล้ว
) else (
  echo ⏭️ ข้ามการติดตั้ง npm modules
)
goto :eof

timeout /t 2 >nul
call :INIT_DATABASE
timeout /t 2 >nul
goto START

:RESTART_SERVICES
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   🔃 รีสตาร์ท Services
echo ════════════════════════════════════════════════════════════════
echo.

echo กำลังปิด Services ทั้งหมด...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo กำลังเริ่มต้น Backend และ Frontend...
start "Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python app.py"
start "Frontend" cmd /k "cd frontend && npm run dev"
echo ✅ Services ประเมิน
pause
goto START

:STOP_SERVICES
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   ❌ ปิด Services
echo ════════════════════════════════════════════════════════════════
echo.

echo กำลังปิด Backend และ Frontend...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
echo ✅ Services ปิดแล้ว
pause
goto START

:END
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   👋 ลาก่อน!
echo ════════════════════════════════════════════════════════════════
echo.
endlocal
exit /b 0
