# 📖 เอกสารประกอบแบบครบเครื่อง - Ziing Multi-Database Project

## สารบัญ
1. [ภาพรวมโครงการ](#ภาพรวมโครงการ)
2. [ข้อกำหนดเบื้องต้น](#ข้อกำหนดเบื้องต้น)
3. [เริ่มต้นอย่างรวดเร็ว](#เริ่มต้นอย่างรวดเร็ว)
4. [ตั้งค่าการพัฒนาท้องถิ่น](#ตั้งค่าการพัฒนาท้องถิ่น)
5. [เซตอัพ Docker](#เซตอัพ-docker)
6. [เทียบเค้า ฐานข้อมูล](#เทียบเค้า-ฐานข้อมูล)
7. [ตรวจสอบระบบ](#ตรวจสอบระบบ)
8. [การแก้ไขปัญหา](#การแก้ไขปัญหา)
9. [FAQ](#faq)

---

## ภาพรวมโครงการ

Ziing Multi-Database Project เป็นแอปพลิเคชัน Full-Stack ที่ใช้:
- **Backend**: Flask (Python)
- **Frontend**: React + TypeScript + Vite
- **Databases**: MySQL (ข้อมูลเชิงสัมพันธ์) + MongoDB (ข้อมูลแบบเอกสาร)
- **Infrastructure**: Docker (ตัวเลือก) หรือการพัฒนาท้องถิ่นโดยตรง

### วัตถุประสงค์
จัดการข้อมูลลูกค้า ยานพาหนะ ชิ้นส่วน และคำสั่งงาน พร้อมฐานข้อมูลที่ปรับให้เหมาะสมสำหรับแต่ละประเภทข้อมูล

---

## ข้อกำหนดเบื้องต้น

### ตั้งค่าท้องถิ่น (Local Development)
- **Python 3.8+** - https://www.python.org/
- **Node.js 16+** - https://nodejs.org/
- **MySQL 8.0+** - https://dev.mysql.com/downloads/mysql/
- **MongoDB Community** - https://www.mongodb.com/try/download/community

### ตั้งค่า Docker
- **Docker Desktop** - https://www.docker.com/products/docker-desktop
- ~10GB พื้นที่ว่าง

---

## เริ่มต้นอย่างรวดเร็ว

### วิธีที่ 1: ใช้สคริปต์ all-in-one-th.bat (Windows)

```batch
all-in-one-th.bat
```

จากนั้นเลือกตัวเลือก:
1. ตรวจสอบระบบ
2. ทดสอบการติดตั้ง
3. ตรวจสอบฐานข้อมูล
4. ตรวจสอบการเชื่อมต่อ
5. ตั้งค่าการพัฒนาท้องถิ่น
6. ตั้งค่า Docker
7. เตรียมฐานข้อมูล
8. ดูเอกสารประกอบ
9. รันทั้งหมด

### วิธีที่ 2: ตั้งค่าด้วยตนเอง

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate.bat  # Windows
source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python app.py

# Frontend (ในหน้าต่างใหม่)
cd frontend
npm install
npm run dev
```

---

## ตั้งค่าการพัฒนาท้องถิ่น

### ขั้นตอนที่ 1: ติดตั้งที่จำเป็น

#### Windows
1. ติดตั้ง Python - อย่าลืมเลือก "Add Python to PATH"
2. ติดตั้ง Node.js
3. ติดตั้ง MySQL - https://dev.mysql.com/downloads/mysql/
4. ติดตั้ง MongoDB - https://www.mongodb.com/try/download/community

#### Mac
```bash
brew install python3
brew install node
brew install mysql-community-server
brew install mongodb-community
```

#### Linux (Ubuntu)
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip nodejs npm
sudo apt-get install mysql-server mongodb
```

### ขั้นตอนที่ 2: สร้าง Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate.bat

# Mac/Linux
source venv/bin/activate
```

### ขั้นตอนที่ 3: ติดตั้ง Dependencies

```bash
# Backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### ขั้นตอนที่ 4: สร้างฐานข้อมูล

```bash
# MySQL
mysql -u root -e "CREATE DATABASE CarCustomShop;"
mysql -u root CarCustomShop < backend\sql\init.sql

# MongoDB
mongosh --eval "use CarCustomShop; db.createCollection('parts');"
```

### ขั้นตอนที่ 5: รันแอปพลิเคชัน

```bash
# Backend (หน้าต่างที่ 1)
cd backend
venv\Scripts\activate.bat  # Windows
python app.py

# Frontend (หน้าต่างที่ 2)
cd frontend
npm run dev
```

**สำหรับเข้าถึง:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MySQL: localhost:3306
- MongoDB: localhost:27017

---

## เซตอัพ Docker

### วิธีตั้งค่า Docker

```bash
# อยู่ในโฟลเดอร์โครงการ
docker-compose up -d
```

### การเข้าถึง
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MySQL: localhost:3307 (user: shopuser / password: shoppass)
- MongoDB: localhost:27017 (user: admin / password: adminpass)

### หยุด Docker
```bash
docker-compose down
```

### ลบข้อมูลดาต้าเบสทั้งหมด (ระวัง!)
```bash
docker-compose down -v
```

---

## เทียบเค้า ฐานข้อมูล

### MySQL

```bash
# สร้างฐานข้อมูล
mysql -u root -e "CREATE DATABASE IF NOT EXISTS CarCustomShop;"

# นำเข้าสคีมา
mysql -u root CarCustomShop < backend/sql/init.sql

# ตรวจสอบ
mysql -u root -e "SHOW DATABASES;"
mysql -u root CarCustomShop -e "SHOW TABLES;"
```

### MongoDB

```bash
# สร้าง collection
mongosh --eval "use CarCustomShop; db.createCollection('parts');"

# ตรวจสอบ
mongosh --eval "show databases;"
mongosh --eval "use CarCustomShop; show collections;"
```

---

## ตรวจสอบระบบ

### ตรวจสอบการติดตั้ง

```bash
# Python
python --version

# Node.js
node --version
npm --version

# MySQL
mysql --version

# MongoDB
mongosh --version
```

### ตรวจสอบการเชื่อมต่อ

```bash
# MySQL
mysql -u root -e "SELECT VERSION();"

# MongoDB
mongosh admin --eval "db.adminCommand('ping')"
```

### ตรวจสอบพอร์ต

```bash
# ตรวจสอบพอร์ต 3306 (MySQL)
netstat -ano | find ":3306"

# ตรวจสอบพอร์ต 27017 (MongoDB)
netstat -ano | find ":27017"

# ตรวจสอบพอร์ต 5000 (Backend)
netstat -ano | find ":5000"

# ตรวจสอบพอร์ต 5173 (Frontend)
netstat -ano | find ":5173"
```

---

## การแก้ไขปัญหา

### ❌ Python ไม่พบ

**สาเหตุ:**
- ไม่ได้ติดตั้ง Python
- Python ยังไม่เพิ่มไปในตัวแปร PATH

**วิธีแก้:**
1. ติดตั้ง Python ใหม่จาก https://www.python.org/
2. ระหว่างการติดตั้ง ให้เลือก "Add Python to PATH"
3. เปิด Command Prompt ใหม่
4. ลองใหม่: `python --version`

---

### ❌ Node.js ไม่พบ

**สาเหตุ:**
- ไม่ได้ติดตั้ง Node.js
- Node.js ไม่อยู่ใน PATH

**วิธีแก้:**
1. ติดตั้ง Node.js จาก https://nodejs.org/
2. เปิด Command Prompt ใหม่
3. ลองใหม่: `node --version` และ `npm --version`

---

### ❌ MySQL ไม่เชื่อมต่อ

**สาเหตุ:**
- MySQL Service ไม่ทำงาน
- รหัสผ่านไม่ถูกต้อง
- พอร์ต 3306 ถูกใช้งาน

**วิธีแก้:**

1. **Windows:** เปิด Services (services.msc) แล้วเริ่ม MySQL80
2. **Mac:** รัน `brew services start mysql-community-server`
3. **Linux:** รัน `sudo systemctl start mysql`
4. **ตรวจสอบรหัสผ่าน:** แก้ไขไฟล์ `.env` ให้ตรงกับรหัสผ่าน MySQL

**เชื่อมต่อใหม่:**
```bash
mysql -u root -p
# พิมพ์รหัสผ่านของคุณ
```

---

### ❌ MongoDB ไม่เชื่อมต่อ

**สาเหตุ:**
- MongoDB Service ไม่ทำงาน
- mongosh ไม่ได้ติดตั้ง
- พอร์ต 27017 ถูกใช้งาน

**วิธีแก้:**

1. **Windows:** เปิด Services แล้วเริ่ม MongoDB
2. **Mac:** รัน `brew services start mongodb-community`
3. **Linux:** รัน `sudo systemctl start mongod`
4. **ตรวจสอบ mongosh:** รัน `mongosh --version`

---

### ❌ พอร์ตถูกใช้งานแล้ว

**ปัญหา:** "Address already in use"

**วิธีแก้:**

1. **ค้นหาโปรแกรมที่ใช้พอร์ต:**
```bash
# Windows
netstat -ano | find ":5000"

# Mac/Linux
lsof -i :5000
```

2. **ปิดโปรแกรม** หรือ **เปลี่ยนพอร์ต** ใน `.env`

---

### ❌ Virtual Environment ไม่ทำงาน

**วิธีแก้:**

```bash
# ลบ virtual environment เดิม
rmdir /s backend\venv  # Windows
rm -rf backend/venv    # Mac/Linux

# สร้างใหม่
cd backend
python -m venv venv

# Activate
venv\Scripts\activate.bat  # Windows
source venv/bin/activate   # Mac/Linux

# ติดตั้ง dependencies
pip install -r requirements.txt
```

---

### ❌ npm modules ไม่ทำงาน

**วิธีแก้:**

```bash
cd frontend

# ลบ node_modules เดิม
rmdir /s node_modules  # Windows
rm -rf node_modules    # Mac/Linux

# Reinstall
npm install
```

---

### ❌ Docker ไม่เริ่มต้น

**วิธีแก้:**

1. เปิด Docker Desktop
2. รัน:
```bash
docker-compose up -d
docker-compose logs
```

---

## API Endpoints

### Root
- **GET** `/` - ตรวจสอบสถานะเซิร์ฟเวอร์

### Customers (MySQL)
- **GET** `/customers` - รับลูกค้าทั้งหมด
- **POST** `/customers` - เพิ่มลูกค้า

### Vehicles (MySQL)
- **GET** `/vehicles` - รับยานพาหนะทั้งหมด

### Work Orders (MySQL)
- **GET** `/workorders` - รับคำสั่งงานทั้งหมด

### Parts (MongoDB)
- **GET** `/parts` - รับชิ้นส่วนทั้งหมด
- **POST** `/parts` - เพิ่มชิ้นส่วน

### ตัวอย่างการใช้ API

```bash
# ตรวจสอบเซิร์ฟเวอร์
curl http://localhost:5000/

# รับลูกค้า
curl http://localhost:5000/customers

# เพิ่มลูกค้า
curl -X POST http://localhost:5000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "FirstName":"สมชาย",
    "LastName":"ใจดี",
    "Phone":"0812345678",
    "Email":"somchai@example.com"
  }'

# รับชิ้นส่วน
curl http://localhost:5000/parts
```

---

## Configuration Files

### .env (Root)
```env
FLASK_ENV=development
FLASK_DEBUG=1
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_DB=CarCustomShop
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=CarCustomShop
```

### backend/.env
```env
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP=app.py
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=CarCustomShop
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=CarCustomShop
```

### ปรับใช้ Custom Credentials

เปิด `.env` และแก้ไข:

```env
MYSQL_USER=คุณชื่อผู้ใช้
MYSQL_PASSWORD=คุณรหัสผ่าน
```

---

## Docker Commands Reference

```bash
# เริ่มให้หน้ากว้าง
docker-compose up -d

# ดูสถานะ
docker-compose ps

# ดูบันทึก
docker-compose logs -f

# บันทึกของบริการเดียว
docker-compose logs -f backend

# เข้าซ่อมแซม MySQL
docker-compose exec mysql mysql -u shopuser -pshoppass CarCustomShop

# เข้าซ่อมแซม MongoDB
docker-compose exec mongodb mongosh admin --username admin --password adminpass

# หยุด
docker-compose down

# ลบข้อมูลทั้งหมด
docker-compose down -v
```

---

## FAQ

### Q: ฉันจะเปลี่ยนพอร์ต Backend ได้อย่างไร?

A: แก้ไข `backend/app.py` บรรทัดสุดท้าย:
```python
if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8000)  # เปลี่ยนจาก 5000 เป็น 8000
```

---

### Q: ฉันจะเปลี่ยนรหัสผ่าน MySQL ได้อย่างไร?

A: 
1. สร้างป้องกัน MySQL ใหม่:
```bash
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
EXIT;
```

2. อัพเดต `.env` และ `backend/.env`

---

### Q: ฉันสามารถรันเฉพาะ Backend ได้หรือไม่?

A: ใช่ รันเฉพาะ Backend:
```bash
cd backend
venv\Scripts\activate.bat  # Windows
python app.py
```

Backend จะทำงานที่ http://localhost:5000

---

### Q: ฉันจะล้างฐานข้อมูลได้อย่างไร?

A:
```bash
# MySQL
mysql -u root -e "DROP DATABASE CarCustomShop; CREATE DATABASE CarCustomShop;"
mysql -u root CarCustomShop < backend/sql/init.sql

# MongoDB
mongosh --eval "use CarCustomShop; db.dropDatabase();"
```

---

## File Map

| ไฟล์ | คำอธิบาย |
|------|----------|
| `all-in-one-th.bat` | สคริปต์หลักสำหรับ Windows (ตรวจสอบ, ตั้งค่า, ทดสอบ) |
| `ALL_DOCUMENTATION_TH.md` | เอกสารประกอบนี้ |
| `docker-compose.yml` | ค่า Docker services |
| `backend/app.py` | Flask Backend หลัก |
| `backend/requirements.txt` | Python dependencies |
| `frontend/package.json` | Node.js dependencies |
| `.env` & `.env.example` | Configuration files |

---

## สรุปคำสั่งที่สำคัญ

```bash
# ตรวจสอบการติดตั้ง
all-in-one-th.bat

# Local Development
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python app.py

# Frontend
npm install
npm run dev

# Docker
docker-compose up -d
docker-compose down

# Database
mysql -u root CarCustomShop < backend/sql/init.sql
mongosh --eval "use CarCustomShop; db.createCollection('parts');"
```

---

## ติดต่อและสนับสนุน

- ดูเอกสารประกอบของแต่ละส่วน
- รันการตรวจสอบระบบ: `all-in-one-th.bat` → เลือก 1
- ตรวจสอบบันทึก: Backend/Frontend terminals

---

**เวอร์ชัน**: 0.0.2B-T (Local + Docker Support)  
**อัปเดตล่าสุด**: กุมภาพันธ์ 2026  
**สถานะ**: ✅ พร้อมใช้งาน

