# 📖 เอกสารโครงการ Ziing Multi-Database (ฉบับภาษาไทย)

## 📋 สารบัญ
1. [ภาพรวมโครงการ](#ภาพรวมโครงการ)
2. [โครงสร้างไฟล์และโฟลเดอร์](#โครงสร้างไฟล์และโฟลเดอร์)
3. [สถาปัตยกรรมฐานข้อมูล](#สถาปัตยกรรมฐานข้อมูล)
4. [การติดตั้งและตั้งค่า](#การติดตั้งและตั้งค่า)
5. [การใช้งานระบบ](#การใช้งานระบบ)
6. [API Endpoints](#api-endpoints)
7. [ทีมผู้พัฒนา](#ทีมผู้พัฒนา)

---

## ภาพรวมโครงการ

**ZLing Multi-Database Project** เป็นแอปพลิเคชัน สำหรับจัดการร้านตกแต่งรถยนต์ ที่ใช้เทคโนโลยีสมัยใหม่:

### 🛠️ เทคโนโลยีที่ใช้
- **Backend**: Flask (Python)
- **Frontend**: React + TypeScript + Vite
- **ฐานข้อมูล**: MySQL + MongoDB (Multi-Database)
- **ระบบปฏิบัติการ**: Local Development (ไม่ใช้ Docker)

### 🎯 วัตถุประสงค์
- จัดการข้อมูลลูกค้า (Customers)
- จัดการข้อมูลยานพาหนะ (Vehicles) 
- จัดการคำสั่งงาน (Work Orders)
- จัดการข้อมูลชิ้นส่วนและอุปกรณ์ (Parts)
- จัดการผู้ใช้งานระบบ (Users)

---

## โครงสร้างไฟล์และโฟลเดอร์

```
ZLing_multi_database_project/
├── 📁 backend/                    # Backend Flask Application
│   ├── 🐍 app.py                 # ไฟล์หลักของ Flask Application
│   ├── 🔧 config.py              # การตั้งค่า Environment
│   ├── 🗄️ db_mysql.py            # ตัวเชื่อมต่อฐานข้อมูล MySQL
│   ├── 🍃 db_mongo.py            # ตัวเชื่อมต่อฐานข้อมูล MongoDB
│   ├── 📄 requirements.txt        # Dependencies ของ Python
│   ├── 📁 sql/                   # สคริปต์สร้างฐานข้อมูล MySQL
│   │   └── 📄 init.sql          # สคริปต์เริ่มต้น MySQL
│   ├── 🔑 .env                   # ตัวแปรสภาพแวดล้อม (ไม่ติดตาม Git)
│   └── 📝 .env.example           # ตัวอย่างไฟล์ .env
│
├── 📁 frontend/                   # Frontend React Application
│   ├── 📁 src/                   # โค้ด React Components
│   │   ├── 📁 components/       # คอมโพเนนต์ต่างๆ
│   │   ├── 📁 pages/            # หน้าต่างๆ
│   │   └── 📄 App.tsx           # ไฟล์หลักของ React
│   ├── 📁 public/                # ไฟล์ Static
│   ├── 📄 index.html             # ไฟล์ HTML หลัก
│   ├── 📦 package.json           # Dependencies ของ Node.js
│   ├── ⚙️ vite.config.ts         # การตั้งค่า Vite
│   ├── 📘 tsconfig.json          # การตั้งค่า TypeScript
│   └── 🔑 .env                   # ตัวแปรสภาพแวดล้อม Frontend
│
├── 📁 IMG/                        # รูปภาพและเอกสาร
│   └── 📄 KU_ZLING_Schema.pdf    # แผนผังโครงสร้างฐานข้อมูล
│
├── 📄 README.md                   # README ภาษาอังกฤษ
├── 📄 README_TH.md               # README ภาษาไทย (ไฟล์นี้)
├── 📄 Documentation.md           # เอกสารประกอบฉบับเต็ม
├── 📄 update.md                  # บันทึกการอัปเดต
├── 🐍 hash.py                    # ยูทิลิตี้แฮชรหัสผ่าน
├── 📦 requirements.txt           # Python Dependencies หลัก
├── 🚫 .gitignore                 # กฎการ ignore ไฟล์ Git
└── 🔧 .env.example               # ตัวอย่างตัวแปรสภาพแวดล้อม
```

---

## สถาปัตยกรรมฐานข้อมูล

### 🗄️ MySQL - ข้อมูลเชิงสัมพันธ์ (Relational Data)
**ที่อยู่**: `localhost:3306`  
**Database**: `CarCustomShop`

#### ตารางหลัก:
1. **Role** - บทบาทผู้ใช้งาน
   - RoleID (PK), RoleName

2. **User** - ผู้ใช้งานระบบ (พนักงาน)
   - UserID (PK), Username, PasswordHash, FirstName, LastName, RoleID (FK)

3. **Customer** - ข้อมูลลูกค้า
   - CustomerID (PK), FirstName, LastName, Phone, Email

4. **Vehicle** - ข้อมูลยานพาหนะ
   - VehicleID (PK), CustomerID (FK), Make, Model, Year, Color, LicensePlate

5. **WorkOrder** - คำสั่งงาน
   - WorkOrderID (PK), VehicleID (FK), UserID (FK), Description, Status, TotalCost

### 🍃 MongoDB - ข้อมูลแบบเอกสาร (Document Data)
**ที่อยู่**: `localhost:27017`  
**Database**: `CarCustomShop`

#### Collection หลัก:
1. **parts** - ข้อมูลชิ้นส่วนและอุปกรณ์
   ```json
   {
     "part_id": "P001",
     "name": "ยางรถยนต์ Bridgestone",
     "category": "ยางรถยนต์",
     "price": 3500.00,
     "stock": 15,
     "specifications": {
       "size": "205/55R16",
       "brand": "Bridgestone",
       "type": "Tubeless"
     }
   }
   ```

### 📊 แผนผังโครงสร้างฐานข้อมูล

<img src="/IMG/KU_ZLING_Schema.pdf">

**คำอธิบายแผนผัง:**
- **MySQL** (ด้านซ้าย): จัดเก็บข้อมูลที่มีความสัมพันธ์ชัดเจน เช่น ลูกค้า-ยานพาหนะ-คำสั่งงาน
- **MongoDB** (ด้านขวา): จัดเก็บข้อมูลที่มีโครงสร้างยืดหยุ่น เช่น ข้อมูลชิ้นส่วนที่มีสเปคเฉพาะ
- **การเชื่อมโยง**: WorkOrder เชื่อมโยงกับทั้ง Vehicle (MySQL) และ Parts (MongoDB) ผ่าน API

---

## การติดตั้งและตั้งค่า

### ✅ ข้อกำหนดเบื้องต้น
- **Python 3.8+**
- **Node.js 16+** 
- **MySQL Server 8.0+**
- **MongoDB Community**

### 🚀 การติดตั้งแบบรวดเร็ว

#### ขั้นตอนที่ 1: ตรวจสอบฐานข้อมูล
```bash
# ตรวจสอบว่า MySQL และ MongoDB ทำงานอยู่
# MySQL: localhost:3306
# MongoDB: localhost:27017
```

#### ขั้นตอนที่ 2: ติดตั้ง Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Backend จะทำงานที่ http://localhost:5000
```

#### ขั้นตอนที่ 3: ติดตั้ง Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend จะทำงานที่ http://localhost:5173
```

### 🔧 การตั้งค่าฐานข้อมูล

#### MySQL
```bash
# สร้างฐานข้อมูล
mysql -u root -p -e "CREATE DATABASE CarCustomShop;"

# นำเข้าโครงสร้างตาราง
mysql -u root -p CarCustomShop < backend/sql/init.sql
```

#### MongoDB
```bash
# เชื่อมต่อและสร้าง collection
mongosh
use CarCustomShop
db.createCollection('parts')
```

### 🌐 การเข้าถึงระบบ
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306
- **MongoDB**: localhost:27017

---

## การใช้งานระบบ

### 📱 ฟังก์ชันหลักของระบบ

1. **การจัดการลูกค้า**
   - เพิ่ม/แก้ไข/ลบข้อมูลลูกค้า
   - ค้นหาลูกค้าตามชื่อหรือเบอร์โทร

2. **การจัดการยานพาหนะ**
   - บันทึกข้อมูลรถของลูกค้า
   - ติดตามประวัติการซ่อมบำรุง

3. **การจัดการคำสั่งงาน**
   - สร้างคำสั่งงานใหม่
   - ติดตามสถานะการดำเนินงาน
   - คำนวณค่าใช้จ่าย

4. **การจัดการชิ้นส่วน**
   - เพิ่มข้อมูลชิ้นส่วนใหม่
   - ตรวจสอบสต็อกสินค้า
   - จัดการราคาและสเปค

### 👥 บทบาทผู้ใช้งาน
- **Admin**: จัดการทุกอย่างในระบบ
- **Mechanic**: ดูและอัปเดตคำสั่งงาน
- **Receptionist**: จัดการลูกค้าและคำสั่งงานใหม่
- **Customer**: ดูสถานะคำสั่งงานของตนเอง

---

## API Endpoints

### 🔗 หมวดหมู่ API

| วิธี | Endpoint | คำอธิบาย |
|------|----------|-----------|
| GET | `/` | ตรวจสอบสถานะเซิร์ฟเวอร์ |
| | | |
| **ลูกค้า (MySQL)** | | |
| GET | `/customers` | ดูข้อมูลลูกค้าทั้งหมด |
| POST | `/customers` | เพิ่มลูกค้าใหม่ |
| GET | `/customers/{id}` | ดูข้อมูลลูกค้ารายคน |
| | | |
| **ยานพาหนะ (MySQL)** | | |
| GET | `/vehicles` | ดูข้อมูลยานพาหนะทั้งหมด |
| POST | `/vehicles` | เพิ่มยานพาหนะใหม่ |
| | | |
| **คำสั่งงาน (MySQL)** | | |
| GET | `/workorders` | ดูคำสั่งงานทั้งหมด |
| POST | `/workorders` | สร้างคำสั่งงานใหม่ |
| | | |
| **ชิ้นส่วน (MongoDB)** | | |
| GET | `/parts` | ดูชิ้นส่วนทั้งหมด |
| POST | `/parts` | เพิ่มชิ้นส่วนใหม่ |
| | | |
| **ผู้ใช้งาน (MySQL)** | | |
| GET | `/users` | ดูผู้ใช้งานทั้งหมด |
| POST | `/login` | เข้าสู่ระบบ |

### 📝 ตัวอย่างการใช้ API

```bash
# ตรวจสอบสถานะเซิร์ฟเวอร์
curl http://localhost:5000/

# เพิ่มลูกค้าใหม่
curl -X POST http://localhost:5000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "FirstName":"สมชาย",
    "LastName":"ใจดี", 
    "Phone":"0812345678",
    "Email":"somchai@example.com"
  }'

# ดูข้อมูลชิ้นส่วนทั้งหมด
curl http://localhost:5000/parts
```

---

## ทีมผู้พัฒนา

### 👥 สมาชิกทีม
- **Chankxow** - Backend Developer
- **puriwat2953** - Frontend Developer  
- **Ampser** - Database Designer

### 📞 การติดต่อ
- **Project Repository**: Ziing Multi-Database Project
- **Documentation**: ดูไฟล์ `Documentation.md` สำหรับเอกสารฉบับเต็ม
- **Support**: ตรวจสอบ logs ใน terminal ของ backend และ frontend

---

## 📝 หมายเหตุ

โครงการนี้พัฒนาขึ้นเพื่อการศึกษาเกี่ยวกับ:
- 🔄 Multi-Database Systems
- 🐳 Docker & Container Technology  
- 🌐 Full-Stack Development
- 🐍 Python Flask Framework
- ⚛️ React TypeScript Development

---

**📅 อัปเดตล่าสุด**: มีนาคม 2026  
**🔢 เวอร์ชัน**: 0.0.3B-T (Localhost Only)  
**✅ สถานะ**: พร้อมใช้งาน
