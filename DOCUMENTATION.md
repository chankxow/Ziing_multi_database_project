# 📚 เอกสารประกอบโครงการ Ziing Multi-Database (ฉบับละเอียด)

## 📋 สารบัญ
1. [บทนำ](#บทนำ)
2. [ภาพรวมโครงการ](#ภาพรวมโครงการ)
3. [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
4. [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
5. [การติดตั้งและตั้งค่า](#การติดตั้งและตั้งค่า)
6. [คู่มือการใช้งาน](#คู่มือการใช้งาน)
7. [API Reference](#api-reference)
8. [การพัฒนาและทดสอบ](#การพัฒนาและทดสอบ)
9. [การแก้ไขปัญหา](#การแก้ไขปัญหา)
10. [การปรับใช้งาน](#การปรับใช้งาน)
11. [ข้อมูลทีมผู้พัฒนา](#ข้อมูลทีมผู้พัฒนา)

---

## บทนำ

### 🎯 วัตถุประสงค์ของเอกสาร
เอกสารฉบับนี้จัดทำขึ้นเพื่อให้นักพัฒนา ผู้ดูแลระบบ และผู้ใช้งานเข้าใจโครงการ Ziing Multi-Database อย่างครบถ้วนและละเอียด ครอบคลุมทุกแง่มุมของระบบตั้งแต่การติดตั้ง การใช้งาน การพัฒนา ไปจนถึงการบำรุงรักษา

### 📖 ขอบเขตของเอกสาร
- คำอธิบายโครงสร้างระบบและฐานข้อมูล
- คู่มือการติดตั้งและตั้งค่า
- API Reference ทั้งหมด
- ตัวอย่างการใช้งานจริง
- การแก้ไขปัญหาที่พบบ่อย
- แนวทางการพัฒนาต่อ

---

## ภาพรวมโครงการ

### 🏢 ประวัติและที่มาของโครงการ
Ziing Multi-Database Project เป็นโปรเจคที่พัฒนาขึ้นเพื่อเป็นตัวอย่างการใช้งาน Multi-Database Architecture ในระบบจริง โดยจำลองสถานการณ์ร้านตกแต่งรถยนต์ที่ต้องจัดการข้อมูลหลายประเภทที่มีลักษณะแตกต่างกัน

### 🎯 วัตถุประสงค์หลัก
1. **การศึกษา Multi-Database**: เรียนรู้การใช้งานฐานข้อมูลหลายประเภทร่วมกัน
2. **การพัฒนา Full-Stack**: ฝึกพัฒนาทั้ง Frontend และ Backend
3. **การออกแบบ Schema**: ออกแบบโครงสร้างฐานข้อมูลที่เหมาะสมกับข้อมูลแต่ละประเภท
4. **การจัดการข้อมูลจริง**: จัดการข้อมูลลูกค้า ยานพาหนะ คำสั่งงาน และชิ้นส่วน

### 🛠️ เทคโนโลยีที่ใช้

#### Backend Technology Stack
- **Framework**: Flask 2.3+
- **Language**: Python 3.8+
- **Database Connectors**: 
  - PyMySQL (สำหรับ MySQL)
  - PyMongo (สำหรับ MongoDB)
- **Authentication**: Flask-Login, bcrypt
- **Environment**: python-dotenv

#### Frontend Technology Stack
- **Framework**: React 18+
- **Language**: TypeScript 4.9+
- **Build Tool**: Vite 4+
- **UI Components**: กำลังพัฒนา
- **State Management**: React Context API
- **HTTP Client**: Axios

#### Database Technology Stack
- **Relational Database**: MySQL 8.0+
- **Document Database**: MongoDB 6.0+
- **Connection Management**: Connection Pooling

---

## สถาปัตยกรรมระบบ

### 🏗️ โครงสร้างระบบโดยรวม

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Databases     │
│                 │    │                 │    │                 │
│ React + TS      │◄──►│   Flask API     │◄──►│  MySQL + MongoDB │
│ Vite + Axios    │    │    Python       │    │  localhost      │
│ Port: 5173      │    │   Port: 5000    │    │  3306 + 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔄 การไหลของข้อมูล (Data Flow)

1. **Frontend → Backend**: HTTP Request ผ่าน Axios
2. **Backend → MySQL**: Query ข้อมูลเชิงสัมพันธ์ (ลูกค้า, ยานพาหนะ, คำสั่งงาน)
3. **Backend → MongoDB**: Query ข้อมูลแบบเอกสาร (ชิ้นส่วน, สเปค)
4. **Backend → Frontend**: Response ในรูปแบบ JSON
5. **Frontend**: แสดงผลใน UI Components

### 🎨 หลักการออกแบบ

#### 1. Separation of Concerns
- Frontend จัดการ UI/UX เท่านั้น
- Backend จัดการ Business Logic และ Database
- Database จัดการ Data Persistence

#### 2. Database Selection Strategy
- **MySQL**: ข้อมูลที่มีความสัมพันธ์ชัดเจน ต้องการ ACID properties
- **MongoDB**: ข้อมูลที่มีโครงสร้างยืดหยุ่น มีสเปคซับซ้อน

#### 3. API Design Principles
- RESTful API Design
- Consistent Response Format
- Proper HTTP Status Codes
- Error Handling

---

## โครงสร้างฐานข้อมูล

### 🗄️ MySQL Database Schema

#### Database: `CarCustomShop`

#### 1. ตาราง Role
```sql
CREATE TABLE Role (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE,
    Description TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**คำอธิบาย:**
- `RoleID`: Primary Key ของบทบาท
- `RoleName`: ชื่อบทบาท (Admin, Mechanic, Receptionist, Customer)
- `Description`: รายละเอียดเพิ่มเติมของบทบาท

**ข้อมูลตัวอย่าง:**
```sql
INSERT INTO Role (RoleName, Description) VALUES 
('Admin', 'ผู้ดูแลระบบที่มีสิทธิ์ทุกอย่าง'),
('Mechanic', 'ช่างซ่อมที่สามารถดูและอัปเดตคำสั่งงาน'),
('Receptionist', 'พนักงานต้อนรับที่จัดการลูกค้าและคำสั่งงาน'),
('Customer', 'ลูกค้าที่สามารถดูคำสั่งงานของตนเอง');
```

#### 2. ตาราง User
```sql
CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    RoleID INT NOT NULL,
    CustomerID INT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    LastLogin TIMESTAMP NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);
```

**คำอธิบาย:**
- `UserID`: Primary Key ของผู้ใช้
- `Username`: ชื่อผู้ใช้งานระบบ (unique)
- `PasswordHash`: รหัสผ่านที่ถูกเข้ารหัสแล้ว
- `RoleID`: Foreign Key ไปยังตาราง Role
- `CustomerID`: Foreign Key ไปยังตาราง Customer (สำหรับบทบาท Customer)
- `IsActive`: สถานะการใช้งานของผู้ใช้

#### 3. ตาราง Customer
```sql
CREATE TABLE Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(100),
    Address TEXT,
    Province VARCHAR(50),
    PostalCode VARCHAR(10),
    Notes TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**คำอธิบาย:**
- `CustomerID`: Primary Key ของลูกค้า
- `FirstName`, `LastName`: ชื่อ-นามสกุลลูกค้า
- `Phone`, `Email`: ข้อมูลติดต่อ
- `Address`, `Province`, `PostalCode`: ที่อยู่
- `Notes`: บันทึกเพิ่มเติมเกี่ยวกับลูกค้า

#### 4. ตาราง Vehicle
```sql
CREATE TABLE Vehicle (
    VehicleID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    Make VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    Year INT NOT NULL,
    Color VARCHAR(30),
    LicensePlate VARCHAR(20) UNIQUE,
    VIN VARCHAR(17) UNIQUE,
    EngineType VARCHAR(50),
    Transmission VARCHAR(30),
    Mileage INT DEFAULT 0,
    Notes TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE CASCADE
);
```

**คำอธิบาย:**
- `VehicleID`: Primary Key ของยานพาหนะ
- `CustomerID`: Foreign Key ไปยังลูกค้าเจ้าของรถ
- `Make`, `Model`, `Year`: ข้อมูลพื้นฐานรถ
- `LicensePlate`: ทะเบียนรถ (unique)
- `VIN`: Vehicle Identification Number (unique)
- `EngineType`, `Transmission`: ข้อมูลทางเทคนิค
- `Mileage`: ไมล์สะสม

#### 5. ตาราง WorkOrder
```sql
CREATE TABLE WorkOrder (
    WorkOrderID INT AUTO_INCREMENT PRIMARY KEY,
    OrderNumber VARCHAR(20) UNIQUE NOT NULL,
    VehicleID INT NOT NULL,
    UserID INT NOT NULL,
    CustomerID INT NOT NULL,
    Description TEXT NOT NULL,
    Status VARCHAR(20) DEFAULT 'Pending',
    Priority VARCHAR(10) DEFAULT 'Normal',
    LaborCost DECIMAL(10,2) DEFAULT 0.00,
    PartsCost DECIMAL(10,2) DEFAULT 0.00,
    TotalCost DECIMAL(10,2) DEFAULT 0.00,
    EstimatedHours DECIMAL(4,2),
    ActualHours DECIMAL(4,2),
    StartedDate TIMESTAMP NULL,
    CompletedDate TIMESTAMP NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);
```

**คำอธิบาย:**
- `WorkOrderID`: Primary Key ของคำสั่งงาน
- `OrderNumber`: เลขที่คำสั่งงาน (unique)
- `VehicleID`: ยานพาหนะที่เข้ารับบริการ
- `UserID`: พนักงานที่รับผิดชอบ
- `CustomerID`: ลูกค้าเจ้าของรถ
- `Status`: สถานะ (Pending, In Progress, Completed, Cancelled)
- `Priority`: ความสำคัญ (Low, Normal, High, Urgent)
- `LaborCost`, `PartsCost`, `TotalCost`: ค่าใช้จ่าย

#### 6. ตาราง WorkOrderParts (ตารางเชื่อมโยง)
```sql
CREATE TABLE WorkOrderParts (
    WorkOrderPartID INT AUTO_INCREMENT PRIMARY KEY,
    WorkOrderID INT NOT NULL,
    PartID VARCHAR(50) NOT NULL,  -- Reference to MongoDB parts collection
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(10,2) NOT NULL,
    TotalPrice DECIMAL(10,2) GENERATED ALWAYS AS (Quantity * UnitPrice) STORED,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (WorkOrderID) REFERENCES WorkOrder(WorkOrderID) ON DELETE CASCADE
);
```

**คำอธิบาย:**
- เชื่อมโยงระหว่างคำสั่งงานกับชิ้นส่วนจาก MongoDB
- `PartID`: อ้างอิงถึง `_id` ใน MongoDB parts collection

### 🍃 MongoDB Database Schema

#### Database: `CarCustomShop`

#### 1. Collection: parts
```javascript
{
  _id: ObjectId("..."),
  part_id: "P001",
  name: "ยางรถยนต์ Bridgestone Turanza",
  category: "ยางรถยนต์",
  subcategory: "ยางรถยนต์นั่งส่วนบุคคล",
  brand: "Bridgestone",
  model: "Turanza",
  price: 3500.00,
  cost: 2800.00,
  stock: 15,
  min_stock: 5,
  max_stock: 50,
  unit: "เส้น",
  specifications: {
    size: "205/55R16",
    width: 205,
    aspect_ratio: 55,
    diameter: 16,
    load_index: 91,
    speed_rating: "V",
    type: "Tubeless",
    season: "All Season"
  },
  supplier: {
    name: "บริษัท ยางไทย จำกัด",
    contact: "02-123-4567",
    email: "sales@thaityre.com",
    lead_time_days: 3
  },
  compatibility: [
    "Toyota Camry 2019-2023",
    "Honda Accord 2018-2022",
    "Nissan Altima 2019-2023"
  ],
  images: [
    "/images/parts/P001_front.jpg",
    "/images/parts/P001_side.jpg"
  ],
  warranty: {
    period_months: 24,
    coverage: "Manufacturing defects only",
    terms: "ไม่ครอบคลุมการใช้งานผิดปกติ"
  },
  barcode: "8850012345678",
  tags: ["premium", "all-season", "fuel-efficient"],
  is_active: true,
  created_at: ISODate("2024-01-15T10:30:00Z"),
  updated_at: ISODate("2024-03-10T14:20:00Z")
}
```

**คำอธิบายฟิลด์หลัก:**
- `_id`: Primary Key ของ MongoDB
- `part_id`: รหัสชิ้นส่วนที่ใช้แสดงผล
- `specifications`: ข้อมูลสเปคทางเทคนิค (flexible structure)
- `supplier`: ข้อมูลผู้จัดจำหน่าย
- `compatibility`: รายการรถที่ใช้ได้
- `warranty`: ข้อมูลการรับประกัน

#### 2. Collection: services
```javascript
{
  _id: ObjectId("..."),
  service_id: "S001",
  name: "เปลี่ยนถ่ายน้ำมันเครื่องพร้อมไส้กรอง",
  category: "บำรุงรักษา",
  description: "เปลี่ยนน้ำมันเครื่องและไส้กรองน้ำมันเครื่อง",
  base_price: 800.00,
  estimated_hours: 1.0,
  difficulty_level: "ง่าย",
  required_parts: [
    {
      part_id: "P050",
      quantity: 1,
      is_mandatory: true
    }
  ],
  required_tools: [
    "ชุดเปลี่ยนน้ำมัน",
    "ที่สุกหัวกรองน้ำมัน"
  ],
  instructions: [
    "ยกรถขึ้นด้วยแม็ค",
    "ถอดท่อน้ำมันเครื่อง",
    "ถอดไส้กรองน้ำมันเครื่อง",
    "ติดตั้งไส้กรองใหม่",
    "เติมน้ำมันเครื่องใหม่"
  ],
  is_active: true,
  created_at: ISODate("2024-01-15T10:30:00Z"),
  updated_at: ISODate("2024-03-10T14:20:00Z")
}
```

#### 3. Collection: inventory_transactions
```javascript
{
  _id: ObjectId("..."),
  transaction_id: "T001",
  part_id: "P001",
  transaction_type: "IN",  // IN, OUT, ADJUSTMENT
  quantity: 10,
  unit_price: 2800.00,
  total_value: 28000.00,
  reference_type: "PURCHASE",
  reference_id: "PO001",
  reason: "สั่งซื้อเพิ่มสต็อก",
  user_id: 1,
  transaction_date: ISODate("2024-03-15T09:30:00Z"),
  created_at: ISODate("2024-03-15T09:30:00Z")
}
```

### 🔗 ความสัมพันธ์ระหว่างฐานข้อมูล

```
MySQL (Relational)                    MongoDB (Document)
┌─────────────────┐                    ┌─────────────────┐
│ WorkOrderParts  │◄──────────────────►│     parts       │
│  (part_id)      │                    │  (_id, part_id) │
└─────────────────┘                    └─────────────────┘
        │
        ▼
┌─────────────────┐
│   WorkOrder     │
└─────────────────┘
```

---

## การติดตั้งและตั้งค่า

### 🔧 ข้อกำหนดเบื้องต้น (Prerequisites)

#### ระบบปฏิบัติการที่รองรับ
- **Windows 10/11** (64-bit)
- **macOS 10.15+** (Catalina ขึ้นไป)
- **Ubuntu 20.04+** / **Debian 11+**

#### Software Requirements
- **Python 3.8+** - https://www.python.org/downloads/
- **Node.js 16+** - https://nodejs.org/
- **MySQL 8.0+** - https://dev.mysql.com/downloads/mysql/
- **MongoDB 6.0+** - https://www.mongodb.com/try/download/community

#### Hardware Requirements (ขั้นต่ำ)
- **RAM**: 8GB (แนะนำ 16GB)
- **Storage**: 20GB ว่าง
- **CPU**: Dual-core 2.0GHz+

### 📦 การติดตั้งแบบละเอียด

#### ขั้นตอนที่ 1: ติดตั้งซอฟต์แวร์พื้นฐาน

##### Windows
```powershell
# 1. ติดตั้ง Python
# ดาวน์โหลดจาก python.org และติดตั้งพร้อมเลือก "Add Python to PATH"

# 2. ติดตั้ง Node.js
# ดาวน์โหลดจาก nodejs.org และติดตั้ง

# 3. ติดตั้ง MySQL
# ดาวน์โหลด MySQL Community Server
# ระหว่างติดตั้งให้ตั้งค่า:
# - Port: 3306
# - Root password: จดบันทึกไว้
# - เลือก "Start MySQL Server automatically"

# 4. ติดตั้ง MongoDB
# ดาวน์โหลด MongoDB Community Server
# ระหว่างติดตั้งให้ตั้งค่า:
# - Port: 27017
# - เลือก "Install MongoDB as Service"
# - เลือก "Install MongoDB Compass" (optional)
```

##### macOS
```bash
# ติดตั้ง Homebrew (ถ้ายังไม่มี)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# ติดตั้งซอฟต์แวร์ทั้งหมด
brew install python@3.9 node mysql-community-server mongodb-community

# เริ่มบริการ
brew services start mysql-community-server
brew services start mongodb-community
```

##### Ubuntu/Debian
```bash
# อัปเดต package list
sudo apt update

# ติดตั้ง Python และ Node.js
sudo apt install python3 python3-pip python3-venv nodejs npm

# ติดตั้ง MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# ติดตั้ง MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# เริ่มบริการ
sudo systemctl start mysql
sudo systemctl enable mysql
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### ขั้นตอนที่ 2: ดาวน์โหลดและตั้งค่าโปรเจค

```bash
# Clone หรือดาวน์โหลดโปรเจค
# (สมมติว่ามีไฟล์โปรเจคอยู่แล้ว)

# ย้ายไปยังโฟลเดอร์โปรเจค
cd /home/chaknxow/UNIV/Database/Project/Ziing_multi_database_project
```

#### ขั้นตอนที่ 3: ตั้งค่า Backend

```bash
# 1. สร้าง Virtual Environment
cd backend
python -m venv venv

# 2. Activate Virtual Environment
# Windows
venv\Scripts\activate.bat
# macOS/Linux
source venv/bin/activate

# 3. ติดตั้ง Dependencies
pip install -r requirements.txt

# 4. สร้างไฟล์ .env
cp .env.example .env
```

#### ขั้นตอนที่ 4: ตั้งค่า Frontend

```bash
# 1. ย้ายไปยังโฟลเดอร์ frontend
cd ../frontend

# 2. ติดตั้ง Dependencies
npm install

# 3. สร้างไฟล์ .env (ถ้าจำเป็น)
cp .env.example .env
```

#### ขั้นตอนที่ 5: ตั้งค่าฐานข้อมูล

##### MySQL Setup
```bash
# 1. เข้าสู่ MySQL
mysql -u root -p

# 2. สร้าง Database และ User
CREATE DATABASE CarCustomShop;
CREATE USER 'shopuser'@'localhost' IDENTIFIED BY 'shoppass';
GRANT ALL PRIVILEGES ON CarCustomShop.* TO 'shopuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 3. นำเข้าโครงสร้างตาราง
mysql -u shopuser -p CarCustomShop < backend/sql/init.sql

# 4. ตรวจสอบ
mysql -u shopuser -p CarCustomShop -e "SHOW TABLES;"
```

##### MongoDB Setup
```bash
# 1. เชื่อมต่อ MongoDB
mongosh

# 2. สร้าง Database และ User
use CarCustomShop
db.createUser({
  user: "shopuser",
  pwd: "shoppass",
  roles: [
    { role: "readWrite", db: "CarCustomShop" }
  ]
})

# 3. สร้าง Collections
db.createCollection('parts')
db.createCollection('services')
db.createCollection('inventory_transactions')

# 4. ตรวจสอบ
show collections
exit
```

#### ขั้นตอนที่ 6: ตั้งค่า Environment Variables

สร้าง/แก้ไขไฟล์ `backend/.env`:
```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP=app.py

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=shopuser
MYSQL_PASSWORD=shoppass
MYSQL_DB=CarCustomShop

# MongoDB Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USER=shopuser
MONGO_PASSWORD=shoppass
MONGO_DB=CarCustomShop

# Security Configuration
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Application Configuration
APP_NAME=Ziing Car Custom Shop
APP_VERSION=1.0.0
```

สร้าง/แก้ไขไฟล์ `frontend/.env`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000

# Application Configuration
VITE_APP_NAME=Ziing Car Custom Shop
VITE_APP_VERSION=1.0.0
```

### 🚀 การทดสอบการติดตั้ง

#### 1. ทดสอบฐานข้อมูล
```bash
# MySQL Test
mysql -u shopuser -p -e "SELECT 'MySQL Connection OK' as status;"

# MongoDB Test
mongosh CarCustomShop --eval "db.runCommand({ping:})"
```

#### 2. ทดสอบ Backend
```bash
cd backend
source venv/bin/activate  # หรือ venv\Scripts\activate.bat สำหรับ Windows
python app.py
# ควรแสดง: * Running on http://localhost:5000
```

#### 3. ทดสอบ Frontend
```bash
cd frontend
npm run dev
# ควรแสดง: Local: http://localhost:5173
```

#### 4. ทดสอบ API Connection
```bash
# เปิด terminal ใหม่และทดสอบ
curl http://localhost:5000/
# ควรได้รับ: {"status": "Server is running", "database": "connected"}
```

---

## คู่มือการใช้งาน

### 👥 บทบาทและสิทธิ์ผู้ใช้งาน

#### 1. Admin (ผู้ดูแลระบบ)
- **สิทธิ์**: ครบถ้วนทุกฟังก์ชัน
- **หน้าที่**: จัดการผู้ใช้, ตั้งค่าระบบ, ดูรายงาน
- **ฟังก์ชันหลัก**:
  - จัดการผู้ใช้งาน (เพิ่ม/แก้ไข/ลบ)
  - ตั้งค่าบทบาทและสิทธิ์
  - ดูรายงานสรุปทั้งระบบ
  - จัดการข้อมูลสำรอง

#### 2. Mechanic (ช่างซ่อม)
- **สิทธิ์**: จัดการคำสั่งงานที่ได้รับมอบหมาย
- **หน้าที่**: ดำเนินการซ่อมบำรุง, อัปเดตสถานะ
- **ฟังก์ชันหลัก**:
  - ดูคำสั่งงานที่ได้รับมอบหมาย
  - อัปเดตความคืบหน้าการทำงาน
  - บันทึกเวลาทำงานจริง
  - เพิ่มชิ้นส่วนที่ใช้ในคำสั่งงาน

#### 3. Receptionist (พนักงานต้อนรับ)
- **สิทธิ์**: จัดการลูกค้าและคำสั่งงานใหม่
- **หน้าที่**: รับ-ส่งรถ, สร้างคำสั่งงาน
- **ฟังก์ชันหลัก**:
  - บันทึกข้อมูลลูกค้าใหม่
  - สร้างคำสั่งงานใหม่
  - นัดหมายลูกค้า
  - ออกใบเสร็จ/ใบกำกับภาษี

#### 4. Customer (ลูกค้า)
- **สิทธิ์**: ดูข้อมูลของตนเองเท่านั้น
- **หน้าที่**: ติดตามสถานะคำสั่งงาน
- **ฟังก์ชันหลัก**:
  - ดูประวัติรถที่เคยเข้ารับบริการ
  - ติดตามสถานะคำสั่งงานปัจจุบัน
  - ดูใบเสร็จ/ใบกำกับภาษี
  - นัดหมายบริการ

### 📱 การใช้งานระบบแบบ Step-by-Step

#### การเข้าสู่ระบบ
1. เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`
2. กรอก Username และ Password
3. คลิก "เข้าสู่ระบบ"
4. ระบบจะนำทางไปยังหน้าหลักตามบทบาท

#### การจัดการลูกค้า (สำหรับ Receptionist/Admin)
1. ไปที่เมนู "ลูกค้า"
2. คลิก "เพิ่มลูกค้าใหม่"
3. กรอกข้อมูล:
   - ชื่อ-นามสกุล
   - เบอร์โทรศัพท์
   - อีเมล
   - ที่อยู่
4. คลิก "บันทึก"
5. ระบบจะสร้าง CustomerID ใหม่โดยอัตโนมัติ

#### การสร้างคำสั่งงานใหม่
1. ไปที่เมนู "คำสั่งงาน"
2. คลิก "สร้างคำสั่งงานใหม่"
3. เลือกลูกค้า (จากรายการหรือค้นหา)
4. เลือกรถของลูกค้า หรือเพิ่มรถใหม่
5. กรอกรายละเอียดงาน:
   - คำอธิบายปัญหา/งานที่ต้องทำ
   - ระดับความสำคัญ
   - ประมาณการเวลา
6. มอบหมายให้ช่าง (ถ้าจำเป็น)
7. คลิก "สร้างคำสั่งงาน"

#### การอัปเดตความคืบหน้าคำสั่งงาน (สำหรับ Mechanic)
1. ไปที่เมนู "คำสั่งงานของฉัน"
2. เลือกคำสั่งงานที่ต้องการอัปเดต
3. เปลี่ยนสถานะ:
   - Pending → In Progress (เมื่อเริ่มทำงาน)
   - In Progress → Completed (เมื่อเสร็จสิ้น)
4. บันทึกเวลาทำงานจริง
5. เพิ่มชิ้นส่วนที่ใช้ (ถ้ามี)
6. คลิก "บันทึกการอัปเดต"

#### การจัดการสต็อกชิ้นส่วน (สำหรับ Admin)
1. ไปที่เมนู "จัดการสต็อก"
2. ดูรายการชิ้นส่วนทั้งหมด
3. สำหรับเพิ่มชิ้นส่วนใหม่:
   - คลิก "เพิ่มชิ้นส่วนใหม่"
   - กรอกข้อมูลพื้นฐาน
   - เพิ่มสเปคทางเทคนิค
   - ตั้งค่าราคาและสต็อก
4. สำหรับปรับสต็อก:
   - คลิก "ปรับสต็อก"
   - เลือกประเภทการทำรายการ (เข้า/ออก/ปรับ)
   - กรอกจำนวนและเหตุผล

### 📊 การดูรายงาน

#### รายงานสำหรับ Admin
1. **รายงานรายได้**:
   - ไปที่เมนู "รายงาน" → "รายได้"
   - เลือกช่วงเวลา
   - ดูกราฟและตารางสรุป

2. **รายงานประสิทธิภาพช่าง**:
   - ไปที่เมนู "รายงาน" → "ประสิทธิภาพ"
   - เลือกช่างที่ต้องการ
   - ดูสถิติ: จำนวนงาน, เวลาเฉลี่ย, ความพึงพอใจ

3. **รายงานสต็อก**:
   - ไปที่เมนู "รายงาน" → "สต็อก"
   - ดูชิ้นส่วนที่ต้องเติม
   - ดูมูลค่าสต็อกทั้งหมด

#### รายงานสำหรับ Receptionist
1. **นัดหมายวันนี้**:
   - ดูหน้าแรกสำหรับนัดหมายวันนี้
   - คลิกเพื่อดูรายละเอียด

2. **สถานะคำสั่งงาน**:
   - ไปที่เมนู "คำสั่งงาน"
   - กรองตามสถานะที่ต้องการ

---

## API Reference

### 🔗 รูปแบบการตอบสนอง (Response Format)

#### Success Response
```json
{
  "success": true,
  "data": {
    // ข้อมูลที่ตอบกลับ
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2024-03-15T10:30:00Z"
}
```

### 📡 Authentication Endpoints

#### POST /auth/login
เข้าสู่ระบบ

**Request:**
```json
{
  "username": "admin_ton",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "username": "admin_ton",
      "first_name": "Ton",
      "last_name": "Manager",
      "role": {
        "role_id": 1,
        "role_name": "Admin"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

#### POST /auth/logout
ออกจากระบบ

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
ดูข้อมูลผู้ใช้ปัจจุบัน

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "admin_ton",
    "first_name": "Ton",
    "last_name": "Manager",
    "email": "ton@ziing.com",
    "role": {
      "role_id": 1,
      "role_name": "Admin"
    }
  }
}
```

### 👥 Customer Endpoints

#### GET /customers
ดูข้อมูลลูกค้าทั้งหมด

**Query Parameters:**
- `page`: หน้าที่ (default: 1)
- `limit`: จำนวนต่อหน้า (default: 20)
- `search`: คำค้นหา (ค้นหาจากชื่อ, เบอร์โทร, อีเมล)

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "customer_id": 1,
        "first_name": "สมชาย",
        "last_name": "ใจดี",
        "phone": "0812345678",
        "email": "somchai@example.com",
        "address": "123 ถนนสุขุมวิท",
        "province": "กรุงเทพมหานคร",
        "created_date": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_records": 98,
      "per_page": 20
    }
  }
}
```

#### GET /customers/{id}
ดูข้อมูลลูกค้ารายคน

**Response:**
```json
{
  "success": true,
  "data": {
    "customer_id": 1,
    "first_name": "สมชาย",
    "last_name": "ใจดี",
    "phone": "0812345678",
    "email": "somchai@example.com",
    "address": "123 ถนนสุขุมวิท",
    "province": "กรุงเทพมหานคร",
    "postal_code": "10110",
    "notes": "ลูกค้าประจำ",
    "vehicles": [
      {
        "vehicle_id": 1,
        "make": "Toyota",
        "model": "Camry",
        "year": 2022,
        "license_plate": "ABC-1234"
      }
    ],
    "work_orders_count": 5,
    "total_spent": 25000.00
  }
}
```

#### POST /customers
สร้างลูกค้าใหม่

**Request:**
```json
{
  "first_name": "สมศรี",
  "last_name": "รักดี",
  "phone": "0823456789",
  "email": "somsri@example.com",
  "address": "456 ถนนพหลโยธิน",
  "province": "กรุงเทพมหานคร",
  "postal_code": "10400",
  "notes": "แนะนำโดยลูกค้าคนอื่น"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer_id": 99,
    "first_name": "สมศรี",
    "last_name": "รักดี",
    "created_date": "2024-03-15T11:30:00Z"
  },
  "message": "Customer created successfully"
}
```

#### PUT /customers/{id}
อัปเดตข้อมูลลูกค้า

**Request:** (เหมือนกับ POST แต่ระบุฟิลด์ที่ต้องการอัปเดตเท่านั้น)

#### DELETE /customers/{id}
ลบลูกค้า

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

### 🚗 Vehicle Endpoints

#### GET /vehicles
ดูข้อมูลยานพาหนะทั้งหมด

**Query Parameters:**
- `customer_id`: กรองตามลูกค้า
- `make`: กรองตามยี่ห้อ
- `year`: กรองตามปี

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "vehicle_id": 1,
        "customer_id": 1,
        "customer_name": "สมชาย ใจดี",
        "make": "Toyota",
        "model": "Camry",
        "year": 2022,
        "color": "Black",
        "license_plate": "ABC-1234",
        "vin": "JTHBE5C21A1234567",
        "mileage": 15000
      }
    ]
  }
}
```

#### POST /vehicles
เพิ่มยานพาหนะใหม่

**Request:**
```json
{
  "customer_id": 1,
  "make": "Honda",
  "model": "Accord",
  "year": 2023,
  "color": "White",
  "license_plate": "XYZ-9876",
  "vin": "1HGCV1F3XA1234567",
  "engine_type": "2.0L Turbo",
  "transmission": "CVT",
  "mileage": 5000
}
```

### 📋 Work Order Endpoints

#### GET /workorders
ดูคำสั่งงานทั้งหมด

**Query Parameters:**
- `status`: กรองตามสถานะ (Pending, In Progress, Completed, Cancelled)
- `priority`: กรองตามความสำคัญ (Low, Normal, High, Urgent)
- `user_id`: กรองตามช่างที่รับผิดชอบ
- `customer_id`: กรองตามลูกค้า
- `date_from`: กรองตามวันที่เริ่ม
- `date_to`: กรองตามวันที่สิ้นสุด

**Response:**
```json
{
  "success": true,
  "data": {
    "work_orders": [
      {
        "work_order_id": 1,
        "order_number": "WO20240315001",
        "vehicle": {
          "vehicle_id": 1,
          "make": "Toyota",
          "model": "Camry",
          "license_plate": "ABC-1234"
        },
        "customer": {
          "customer_id": 1,
          "first_name": "สมชาย",
          "last_name": "ใจดี"
        },
        "assigned_to": {
          "user_id": 2,
          "first_name": "Boy",
          "last_name": "Fixer"
        },
        "description": "เปลี่ยนถ่ายน้ำมันเครื่องและเช็คระยะ",
        "status": "In Progress",
        "priority": "Normal",
        "total_cost": 2500.00,
        "created_date": "2024-03-15T09:00:00Z",
        "estimated_completion": "2024-03-15T17:00:00Z"
      }
    ]
  }
}
```

#### POST /workorders
สร้างคำสั่งงานใหม่

**Request:**
```json
{
  "vehicle_id": 1,
  "customer_id": 1,
  "assigned_user_id": 2,
  "description": "เปลี่ยนกรองอากาศและน้ำมันเครื่อง",
  "priority": "Normal",
  "estimated_hours": 2.0,
  "notes": "ลูกค้าร้องเรียงให้เร่งด่วน"
}
```

#### PUT /workorders/{id}/status
อัปเดตสถานะคำสั่งงาน

**Request:**
```json
{
  "status": "Completed",
  "actual_hours": 1.5,
  "completion_notes": "เสร็จสิ้นตามแผนงาน",
  "labor_cost": 1500.00,
  "parts_cost": 800.00
}
```

#### GET /workorders/{id}/parts
ดูชิ้นส่วนที่ใช้ในคำสั่งงาน

**Response:**
```json
{
  "success": true,
  "data": {
    "parts_used": [
      {
        "work_order_part_id": 1,
        "part_id": "P001",
        "part_name": "น้ำมันเครื่อง Mobil 1",
        "quantity": 4,
        "unit_price": 200.00,
        "total_price": 800.00
      }
    ],
    "total_parts_cost": 800.00
  }
}
```

#### POST /workorders/{id}/parts
เพิ่มชิ้นส่วนที่ใช้ในคำสั่งงาน

**Request:**
```json
{
  "part_id": "P002",
  "quantity": 1,
  "unit_price": 350.00
}
```

### 🔩 Parts Endpoints (MongoDB)

#### GET /parts
ดูชิ้นส่วนทั้งหมด

**Query Parameters:**
- `category`: กรองตามหมวดหมู่
- `brand`: กรองตามยี่ห้อ
- `search`: ค้นหาจากชื่อ
- `min_stock`: แสดงสินค้าที่สต็อกต่ำกว่า
- `is_active`: แสดงเฉพาะที่ใช้งานอยู่

**Response:**
```json
{
  "success": true,
  "data": {
    "parts": [
      {
        "_id": "60a1b2c3d4e5f6789012345",
        "part_id": "P001",
        "name": "น้ำมันเครื่อง Mobil 1 5W-30",
        "category": "น้ำมันเครื่อง",
        "brand": "Mobil",
        "price": 200.00,
        "stock": 25,
        "min_stock": 10,
        "specifications": {
          "viscosity": "5W-30",
          "type": "Fully Synthetic",
          "volume": "1L",
          "certification": "API SP"
        },
        "is_active": true
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_records": 195
    }
  }
}
```

#### GET /parts/{id}
ดูข้อมูลชิ้นส่วนรายการ

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60a1b2c3d4e5f6789012345",
    "part_id": "P001",
    "name": "น้ำมันเครื่อง Mobil 1 5W-30",
    "category": "น้ำมันเครื่อง",
    "subcategory": "Full Synthetic",
    "brand": "Mobil",
    "model": "1",
    "price": 200.00,
    "cost": 150.00,
    "stock": 25,
    "min_stock": 10,
    "max_stock": 100,
    "unit": "ขวด",
    "specifications": {
      "viscosity": "5W-30",
      "type": "Fully Synthetic",
      "volume": "1L",
      "certification": "API SP",
      "approvals": ["MB-Approval 229.51", "VW 504.00"]
    },
    "supplier": {
      "name": "บริษัท หล่อเลือง จำกัด",
      "contact": "02-987-6543",
      "email": "sales@lubethai.com",
      "lead_time_days": 2
    },
    "compatibility": [
      "ทุกรถยนต์ที่ต้องการน้ำมัน 5W-30"
    ],
    "warranty": {
      "period_months": 12,
      "coverage": "Manufacturing defects"
    },
    "barcode": "8850012345678",
    "tags": ["synthetic", "premium", "fuel-efficient"],
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-03-10T14:20:00Z"
  }
}
```

#### POST /parts
สร้างชิ้นส่วนใหม่

**Request:**
```json
{
  "part_id": "P100",
  "name": "ไส้กรองอากาศ Denso",
  "category": "ไส้กรอง",
  "subcategory": "ไส้กรองอากาศ",
  "brand": "Denso",
  "price": 350.00,
  "cost": 280.00,
  "stock": 15,
  "min_stock": 5,
  "max_stock": 50,
  "unit": "ชิ้น",
  "specifications": {
    "type": "Panel Filter",
    "dimensions": "215mm x 165mm x 45mm",
    "material": "Paper",
    "efficiency": "99.5%"
  },
  "supplier": {
    "name": "บริษัท เดนโซ ประเทศไทย",
    "contact": "02-555-1234",
    "email": "parts@denso.co.th"
  },
  "compatibility": [
    "Toyota Camry 2018-2023",
    "Honda Accord 2018-2022"
  ]
}
```

#### PUT /parts/{id}
อัปเดตข้อมูลชิ้นส่วน

#### DELETE /parts/{id}
ลบชิ้นส่วน (soft delete - เปลี่ยน is_active เป็น false)

#### POST /parts/{id}/inventory
ปรับสต็อกชิ้นส่วน

**Request:**
```json
{
  "transaction_type": "IN",
  "quantity": 10,
  "unit_price": 280.00,
  "reason": "สั่งซื้อเพิ่มสต็อก",
  "reference_type": "PURCHASE",
  "reference_id": "PO001"
}
```

### 📊 Report Endpoints

#### GET /reports/revenue
รายงานรายได้

**Query Parameters:**
- `start_date`: วันที่เริ่มต้น (YYYY-MM-DD)
- `end_date`: วันที่สิ้นสุด (YYYY-MM-DD)
- `group_by`: การจัดกลุ่ม (day, week, month, year)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_revenue": 125000.00,
      "total_orders": 45,
      "average_order_value": 2777.78,
      "period": "2024-03-01 to 2024-03-15"
    },
    "daily_breakdown": [
      {
        "date": "2024-03-15",
        "revenue": 8500.00,
        "orders": 3
      }
    ],
    "revenue_by_category": [
      {
        "category": "บำรุงรักษา",
        "revenue": 75000.00,
        "percentage": 60.0
      }
    ]
  }
}
```

#### GET /reports/performance
รายงานประสิทธิภาพช่าง

**Query Parameters:**
- `user_id`: รหัสช่าง (ถ้าไม่ระบุจะแสดงทั้งหมด)
- `start_date`: วันที่เริ่มต้น
- `end_date`: วันที่สิ้นสุด

**Response:**
```json
{
  "success": true,
  "data": {
    "mechanics": [
      {
        "user_id": 2,
        "name": "Boy Fixer",
        "total_orders": 15,
        "completed_orders": 12,
        "average_completion_time_hours": 2.5,
        "total_revenue": 30000.00,
        "efficiency_score": 85.5
      }
    ]
  }
}
```

#### GET /reports/inventory
รายงานสต็อก

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_parts": 195,
      "total_value": 250000.00,
      "low_stock_items": 8,
      "out_of_stock_items": 2
    },
    "low_stock_parts": [
      {
        "part_id": "P001",
        "name": "น้ำมันเครื่อง Mobil 1",
        "current_stock": 3,
        "min_stock": 10,
        "recommended_order": 7
      }
    ]
  }
}
```

---

## การพัฒนาและทดสอบ

### 🛠️ การตั้งค่าสภาพแวดล้อมการพัฒนา

#### 1. การตั้งค่า Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### 2. การตั้งค่า Pre-commit Hooks
สร้างไฟล์ `.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 22.3.0
    hooks:
      - id: black
        language_version: python3.8
  - repo: https://github.com/pycqa/flake8
    rev: 4.0.1
    hooks:
      - id: flake8
```

ติดตั้ง pre-commit:
```bash
pip install pre-commit
pre-commit install
```

#### 3. การตั้งค่า VS Code
สร้างไฟล์ `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true
}
```

### 🧪 การทดสอบ (Testing)

#### 1. Backend Testing
สร้างไฟล์ `backend/tests/test_api.py`:
```python
import unittest
import json
from app import create_app

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
    
    def test_health_check(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
    
    def test_get_customers(self):
        response = self.client.get('/customers')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('customers', data['data'])

if __name__ == '__main__':
    unittest.main()
```

รันการทดสอบ:
```bash
cd backend
python -m pytest tests/ -v
```

#### 2. Frontend Testing
ติดตั้ง testing libraries:
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

สร้างไฟล์ `frontend/src/components/__tests__/Button.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText(/Click me/i);
    expect(buttonElement).toBeInTheDocument();
  });
});
```

รันการทดสอบ:
```bash
npm test
```

### 📝 การบันทึก Logging

#### Backend Logging Configuration
สร้างไฟล์ `backend/logger_config.py`:
```python
import logging
import os
from datetime import datetime

def setup_logging():
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Configure logging
    log_filename = f"logs/app_{datetime.now().strftime('%Y%m%d')}.log"
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_filename),
            logging.StreamHandler()
        ]
    )
    
    return logging.getLogger(__name__)
```

การใช้งานใน `app.py`:
```python
from logger_config import setup_logging

logger = setup_logging()

@app.route('/customers')
def get_customers():
    logger.info("Fetching all customers")
    try:
        customers = get_all_customers()
        logger.info(f"Found {len(customers)} customers")
        return jsonify({"success": True, "data": customers})
    except Exception as e:
        logger.error(f"Error fetching customers: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
```

### 🔄 การจัดการ Migration

#### Database Migration for MySQL
สร้างไฟล์ `backend/migrations/migration_001.sql`:
```sql
-- Add new column to Customer table
ALTER TABLE Customer ADD COLUMN LoyaltyPoints INT DEFAULT 0;

-- Create new table for Loyalty Rewards
CREATE TABLE LoyaltyReward (
    RewardID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    RewardType VARCHAR(50) NOT NULL,
    RewardValue DECIMAL(10,2) NOT NULL,
    RedeemedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);
```

สร้างสคริปต์รัน migration:
```python
# backend/migrate.py
import mysql.connector
from config import get_db_config

def run_migration(filename):
    try:
        conn = mysql.connector.connect(**get_db_config())
        cursor = conn.cursor()
        
        with open(filename, 'r') as f:
            migration_sql = f.read()
        
        cursor.execute(migration_sql)
        conn.commit()
        
        print(f"Migration {filename} completed successfully")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    import sys
    migration_file = sys.argv[1] if len(sys.argv) > 1 else "migration_001.sql"
    run_migration(migration_file)
```

---

## การแก้ไขปัญหา

### 🔧 ปัญหาที่พบบ่อยและวิธีแก้ไข

#### 1. ปัญหาการเชื่อมต่อฐานข้อมูล

##### MySQL Connection Error
**อาการ:** `Can't connect to MySQL server on 'localhost'`

**สาเหตุ:**
- MySQL service ไม่ทำงาน
- Port 3306 ถูกใช้โดยโปรแกรมอื่น
- รหัสผ่านไม่ถูกต้อง

**วิธีแก้ไข:**
```bash
# ตรวจสอบสถานะ MySQL
# Windows
net start mysql80
# macOS
brew services start mysql-community-server
# Linux
sudo systemctl start mysql

# ตรวจสอบพอร์ต
netstat -an | grep 3306

# ทดสอบการเชื่อมต่อ
mysql -u shopuser -p -h localhost

# ตรวจสอบไฟล์ .env
cat backend/.env | grep MYSQL
```

##### MongoDB Connection Error
**อาการ:** `ServerSelectionTimeoutError`

**สาเหตุ:**
- MongoDB service ไม่ทำงาน
- Port 27017 ถูกบล็อก
- Authentication ไม่ถูกต้อง

**วิธีแก้ไข:**
```bash
# ตรวจสอบสถานะ MongoDB
# Windows
net start MongoDB
# macOS
brew services start mongodb-community
# Linux
sudo systemctl start mongod

# ทดสอบการเชื่อมต่อ
mongosh --host localhost --port 27017

# ตรวจสอบ log
tail -f /var/log/mongodb/mongod.log
```

#### 2. ปัญหา Virtual Environment

##### Python Version Mismatch
**อาการ:** `Python version mismatch`

**วิธีแก้ไข:**
```bash
# ลบ venv เดิม
rm -rf backend/venv

# สร้างใหม่ด้วย Python version ที่ต้องการ
cd backend
python3.9 -m venv venv

# Activate และติดตั้งใหม่
source venv/bin/activate
pip install -r requirements.txt
```

##### Dependencies Conflicts
**อาการ:** `ERROR: pip's dependency resolver does not currently take into account all the packages`

**วิธีแก้ไข:**
```bash
# อัปเดต pip
pip install --upgrade pip

# ติดตั้งแบบชัดเจน
pip install -r requirements.txt --force-reinstall

# หรือใช้ pip-tools
pip install pip-tools
pip-compile requirements.in
pip-sync requirements.txt
```

#### 3. ปัญหา Frontend

##### Module Not Found
**อาการ:** `Module not found: Can't resolve 'axios'`

**วิธีแก้ไข:**
```bash
cd frontend

# ลบ node_modules และ package-lock.json
rm -rf node_modules package-lock.json

# ติดตั้งใหม่
npm install

# ตรวจสอบว่า axios ถูกติดตั้ง
npm list axios
```

##### Port Already in Use
**อาการ:** `Port 5173 is already in use`

**วิธีแก้ไข:**
```bash
# หา process ที่ใช้พอร์ต
# macOS/Linux
lsof -i :5173
# Windows
netstat -ano | find ":5173"

# ฆ่า process
# macOS/Linux
kill -9 <PID>
# Windows
taskkill /PID <PID> /F

# หรือเปลี่ยนพอร์ตใน vite.config.ts
export default defineConfig({
  server: {
    port: 3000  // เปลี่ยนเป็นพอร์ตอื่น
  }
})
```

#### 4. ปัญหา API

##### CORS Error
**อาการ:** `Access to fetch at 'http://localhost:5000' has been blocked by CORS policy`

**วิธีแก้ไข:**
ตรวจสอบว่า Flask CORS ถูกตั้งค่าอย่างถูกต้องใน `app.py`:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
```

##### 404 Not Found
**อาการ:** API endpoint คืนค่า 404

**วิธีแก้ไข:**
1. ตรวจสอบว่า route ถูกกำหนดอย่างถูกต้อง
2. ตรวจสอบว่า Flask app ทำงานอยู่
3. ตรวจสอบ URL ที่เรียก (ตรวจสอบตัวพิมพ์เล็ก-ใหญ่)

#### 5. ปัญหา Performance

##### Slow Database Queries
**อาการ:** API response ช้า

**วิธีแก้ไข:**
```sql
-- เพิ่ม index ใน MySQL
EXPLAIN SELECT * FROM WorkOrder WHERE Status = 'Pending';
CREATE INDEX idx_workorder_status ON WorkOrder(Status);

-- ใช้ pagination
SELECT * FROM Customer LIMIT 20 OFFSET 0;
```

```javascript
// เพิ่ม index ใน MongoDB
db.parts.createIndex({ "category": 1, "brand": 1 })
db.parts.createIndex({ "part_id": 1 }, { unique: true })
```

### 🐛 Debugging Tools

#### 1. Backend Debugging
เพิ่ม debug mode ใน `app.py`:
```python
if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
```

ใช้ Python debugger:
```python
import pdb; pdb.set_trace()
```

#### 2. Frontend Debugging
ใช้ browser developer tools:
- Console: ดู error messages
- Network: ตรวจสอบ API requests
- Elements: inspect DOM

เพิ่ม logging ใน React:
```typescript
console.log("Debug info:", data);
```

#### 3. Database Debugging
MySQL:
```sql
-- ดู slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- ดู process list
SHOW PROCESSLIST;
```

MongoDB:
```javascript
// ดู query performance
db.collection.find().explain("executionStats")

// ดู current operations
db.currentOp()
```

---

## การปรับใช้งาน

### 🚀 Production Deployment

#### 1. Environment Configuration
สร้างไฟล์ `.env.production`:
```env
FLASK_ENV=production
FLASK_DEBUG=0
MYSQL_HOST=your-db-host.com
MYSQL_PORT=3306
MYSQL_USER=prod_user
MYSQL_PASSWORD=strong_password
MYSQL_DB=CarCustomShop_Prod
MONGO_HOST=your-mongo-host.com
MONGO_PORT=27017
MONGO_USER=prod_user
MONGO_PASSWORD=strong_password
MONGO_DB=CarCustomShop_Prod
SECRET_KEY=very-strong-secret-key
JWT_SECRET_KEY=another-strong-secret-key
```

#### 2. Web Server Configuration

##### Nginx Configuration
สร้างไฟล์ `/etc/nginx/sites-available/ziing`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/ziing/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

##### Gunicorn Configuration
สร้างไฟล์ `gunicorn.conf.py`:
```python
bind = "127.0.0.1:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

รัน Gunicorn:
```bash
gunicorn --config gunicorn.conf.py app:app
```

#### 3. SSL Certificate Setup
```bash
# ใช้ Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### 4. Database Backup Scripts

##### MySQL Backup
สร้างสคริปต์ `scripts/backup_mysql.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="CarCustomShop_Prod"

mkdir -p $BACKUP_DIR

mysqldump -u prod_user -p$MYSQL_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# ลบ backup เก่ากว่า 7 วัน
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

##### MongoDB Backup
สร้างสคริปต์ `scripts/backup_mongodb.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="CarCustomShop_Prod"

mkdir -p $BACKUP_DIR

mongodump --host $MONGO_HOST --port $MONGO_PORT --username prod_user --password $MONGO_PASSWORD --db $DB_NAME --out $BACKUP_DIR/backup_$DATE

# ลบ backup เก่ากว่า 7 วัน
find $BACKUP_DIR -name "backup_*" -mtime +7 -exec rm -rf {} \;
```

#### 5. Monitoring Setup

##### System Monitoring with Prometheus
สร้างไฟล์ `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'ziing-backend'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/metrics'
```

##### Log Monitoring with ELK Stack
ติดตั้ง Elasticsearch, Logstash, Kibana สำหรับจัดการ logs

### 📱 Docker Deployment (Alternative)

#### 1. Dockerfile for Backend
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]
```

#### 2. Dockerfile for Frontend
```dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    depends_on:
      - mysql
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: CarCustomShop_Prod
      MYSQL_USER: prod_user
      MYSQL_PASSWORD: userpassword
    volumes:
      - mysql_data:/var/lib/mysql

  mongodb:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: adminpassword
    volumes:
      - mongodb_data:/data/db

volumes:
  mysql_data:
  mongodb_data:
```

---

## ข้อมูลทีมผู้พัฒนา

### 👥 สมาชิกทีม

#### 1. Chankxow - Backend Developer
- **บทบาท**: พัฒนา Backend API, จัดการฐานข้อมูล
- **ความเชี่ยวชาญ**: Python, Flask, MySQL, MongoDB
- **อีเมล**: chankxow@example.com
- **GitHub**: @chankxow

#### 2. puriwat2953 - Frontend Developer  
- **บทบาท**: พัฒนา Frontend UI/UX
- **ความเชี่ยวชาญ**: React, TypeScript, Vite
- **อีเมล**: puriwat@example.com
- **GitHub**: @puriwat2953

#### 3. Ampser - Database Designer
- **บทบาท**: ออกแบบสถาปัตยกรรมฐานข้อมูล
- **ความเชี่ยวชาญ**: Database Design, Schema Optimization
- **อีเมล**: ampser@example.com
- **GitHub**: @ampser

### 📆 ตารางเวลาการพัฒนา

| Phase | ระยะเวลา | สถานะ | หมายเหตุ |
|-------|-----------|--------|-----------|
| Planning | 1-15 ม.ค. 2024 | ✅ เสร็จสิ้น | วางแผนโครงการ |
| Database Design | 16-31 ม.ค. 2024 | ✅ เสร็จสิ้น | ออกแบบ Schema |
| Backend Dev | 1-28 ก.พ. 2024 | ✅ เสร็จสิ้น | พัฒนา API |
| Frontend Dev | 1-15 มี.ค. 2024 | ✅ เสร็จสิ้น | พัฒนา UI |
| Testing | 16-25 มี.ค. 2024 | ✅ เสร็จสิ้น | ทดสอบระบบ |
| Documentation | 26-31 มี.ค. 2024 | ✅ เสร็จสิ้น | เขียนเอกสาร |

### 📚 แหล่งเรียนรู้และอ้างอิง

#### Documentation
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MongoDB Documentation](https://docs.mongodb.com/)

#### Best Practices
- [Flask Best Practices](https://flask.palletsprojects.com/en/2.3.x/patterns/)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Database Design Principles](https://www.cs.umd.edu/users/sesh/com/331/02-lectures/04-design.pdf)

#### Tools and Libraries
- [PyMySQL](https://pymysql.readthedocs.io/)
- [PyMongo](https://pymongo.readthedocs.io/)
- [Axios](https://axios-http.com/)
- [Vite](https://vitejs.dev/)

### 🤝 การมีส่วนร่วม (Contributing)

#### 1. การส่ง Pull Request
1. Fork โปรเจค
2. สร้าง branch ใหม่: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push: `git push origin feature/new-feature`
5. สร้าง Pull Request

#### 2. Code Standards
- Python: ใช้ Black formatter, Flake8 linter
- TypeScript: ใช้ Prettier formatter, ESLint linter
- ตั้งชื่อตัวแปรและฟังก์ชันให้ชัดเจน
- เขียน comment สำหรับส่วนที่ซับซ้อน

#### 3. Testing
- เขียน unit test สำหรับฟังก์ชันสำคัญ
- รัน test ก่อนส่ง PR
- ตรวจสอบว่า test ผ่านทั้งหมด

### 📞 การติดต่อและสนับสนุน

#### ช่องทางการติดต่อ
- **Email**: support@ziing.com
- **GitHub Issues**: https://github.com/ziing/multi-database/issues
- **Documentation**: https://docs.ziing.com

#### การรายงานปัญหา
เมื่อพบปัญหา กรุณารายงานพร้อมข้อมูล:
1. รายละเอียดปัญหา
2. ขั้นตอนการทำซ้ำ
3. Screenshot หรือ error log
4. Environment: OS, Browser, Version
5. Expected behavior vs Actual behavior

#### การขอความช่วยเหลือ
- ตรวจสอบ FAQ ในเอกสารก่อน
- ค้นหาใน GitHub Issues ว่ามีปัญหาที่คล้ายกันหรือไม่
- สร้าง issue ใหม่พร้อมรายละเอียดครบถ้วน

---

## 📝 บันทึกการอัปเดต (Changelog)

### Version 1.0.0 (2024-03-31)
- ✅ เสร็จสิ้นการพัฒนาระบบพื้นฐาน
- ✅ สร้างฐานข้อมูล MySQL และ MongoDB
- ✅ พัฒนา RESTful API ครบถ้วน
- ✅ สร้าง Frontend UI พื้นฐาน
- ✅ เขียนเอกสารประกอบครบถ้วน

### Version 0.9.0 (2024-03-15)
- ✅ ทดสอบการเชื่อมต่อฐานข้อมูล
- ✅ พัฒนา API endpoints หลัก
- ✅ สร้างโครงสร้าง Frontend

### Version 0.5.0 (2024-02-28)
- ✅ ออกแบบฐานข้อมูล
- ✅ ตั้งค่าสภาพแวดล้อม
- ✅ สร้างโครงสร้างโปรเจค

---

## 📄 ใบอนุญาต (License)

โครงการนี้ใช้ใบอนุญาต MIT License - ดูรายละเอียดในไฟล์ [LICENSE](LICENSE)

---

**📅 อัปเดตล่าสุด**: 15 มีนาคม 2024  
**🔢 เวอร์ชัน**: 1.0.0  
**✅ สถานะ**: พร้อมใช้งานใน Production  
**📝 เอกสารโดย**: ทีมพัฒนา Ziing Multi-Database Project
