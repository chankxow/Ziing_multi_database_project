# 🏎️ AutoPerf — Car Customization Shop Management System

ระบบจัดการร้านแต่งรถ ครบวงจร รองรับหลาย Role พร้อม Dual-Database Architecture

---

## โครงสร้างโปรเจกต์

```
AutoPerf/
├── backend/
│   ├── app.py              # Flask API (main)
│   ├── db_mysql.py         # MySQL connection
│   ├── db_mongo.py         # MongoDB connection
│   ├── config.py           # Config / ENV
│   └── seed_mongo.py       # Seed อะไหล่ตัวอย่าง
├── database/
│   └── init.sql            # MySQL schema + sample data
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   └── pages/
    │       ├── login/
    │       ├── register/
    │       └── dashboard/
    │           ├── Dashboard.tsx         # Role router
    │           ├── AdminDashboard.tsx
    │           ├── StaffDashboard.tsx
    │           └── CustomerDashboard.tsx
    └── package.json
```

---

## Database Architecture

| Database | ใช้เก็บ |
|---|---|
| **MySQL** | Users, Roles, Customers, Vehicles, WorkOrders |
| **MongoDB** | Parts & Inventory (อะไหล่) |

---

## วิธีติดตั้งและรัน

### 1. ตั้งค่า MySQL

รัน `database/init.sql` ใน MySQL Workbench ทั้งไฟล์

จากนั้นรัน SQL เพิ่มเติมนี้เพื่อเพิ่ม column ที่จำเป็น:

```sql
USE CarCustomShop;
ALTER TABLE User ADD COLUMN IF NOT EXISTS CustomerID INT NULL;
ALTER TABLE User ADD CONSTRAINT fk_user_customer
  FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID);
INSERT IGNORE INTO Role (RoleName) VALUES ('Customer');
```

### 2. ติดตั้ง Python packages

```bash
pip install flask flask-cors pymysql pymongo pyjwt bcrypt python-dotenv
```

### 3. Seed อะไหล่ใน MongoDB

```bash
cd backend
python seed_mongo.py
```

### 4. สร้าง Staff accounts

```bash
# Admin
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_ton","password":"1234","firstName":"Ton","lastName":"Manager","role_id":1}'

# Mechanic
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"mech_boy","password":"1234","firstName":"Boy","lastName":"Fixer","role_id":2}'
```

> **หมายเหตุ:** Customer สมัครผ่านหน้า `/register` ของ frontend ได้เลย

### 5. รัน Backend

```bash
cd backend
python app.py
# รันที่ http://localhost:5000
```

### 6. รัน Frontend

```bash
cd frontend
npm install
npm run dev
# รันที่ http://localhost:5173
```

---

## 👤 Role & Permissions

| Feature | Admin (1) | Mechanic (2) | Customer (4) |
|---|:---:|:---:|:---:|
| Dashboard Overview | ✅ Full | ✅ งานตัวเอง | ✅ งานตัวเอง |
| จัดการ Work Orders | ✅ CRUD | ✅ Update status | ✅ สร้าง/ดู |
| จัดการ Parts | ✅ CRUD | ✅ ปรับ stock | 👁️ ดูได้ |
| จัดการ Customers | ✅ | ❌ | ❌ |
| เพิ่ม/ลบรถ | ✅ (ทุกคน) | ❌ | ✅ (ตัวเอง) |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/login` | เข้าสู่ระบบ → JWT token |
| POST | `/register` | สร้าง Staff account (Admin ใช้) |
| POST | `/register/customer` | สมัครสมาชิก Customer (public) |

### Dashboard
| Method | Endpoint | Role |
|---|---|---|
| GET | `/dashboard/admin` | Admin |
| GET | `/dashboard/staff` | Mechanic |
| GET | `/dashboard/customer` | Customer |

### Work Orders
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/workorders` | List (filter by status, search) |
| POST | `/workorders` | สร้างใหม่ |
| PUT | `/workorders/<id>` | แก้ไข |
| PATCH | `/workorders/<id>/status` | เปลี่ยนสถานะ |
| DELETE | `/workorders/<id>` | ลบ (Admin only) |

### Parts (MongoDB)
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/parts` | List (filter: category, search, low_stock) |
| GET | `/parts/categories` | รายการ category |
| POST | `/parts` | เพิ่ม part |
| PUT | `/parts/<part_id>` | แก้ไข |
| PATCH | `/parts/<part_id>/stock` | ปรับ stock (delta) |
| DELETE | `/parts/<part_id>` | ลบ (Admin only) |

### Customer Self-Service
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/customer/vehicles` | ดูรถของตัวเอง |
| POST | `/customer/vehicles` | เพิ่มรถ |
| DELETE | `/customer/vehicles/<id>` | ลบรถ |
| POST | `/customer/workorders` | ขอซ่อม/แต่ง |
| GET | `/customer/parts` | ดูอะไหล่ (ไม่เห็นราคาทุน) |

---

## 🔐 Authentication

ใช้ **JWT Bearer Token** ทุก request ที่ต้องการ auth:

```
Authorization: Bearer <token>
```

Token หมดอายุใน 24 ชั่วโมง (ตั้งค่าใน `config.py`)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | Python Flask + PyMySQL + PyMongo |
| Database | MySQL 8 + MongoDB |
| Auth | JWT (PyJWT) + bcrypt |

---

## 📝 หมายเหตุ

- Customer ที่สร้างผ่าน `/register/customer` จะได้ **CustomerID** ผูกกับ User อัตโนมัติ
- User RoleID=4 ที่สร้างด้วย endpoint เก่า (ไม่มี CustomerID) จะเข้า dashboard ไม่ได้ — ต้องสร้าง account ใหม่ผ่านหน้า Register แทน
- อะไหล่ทั้งหมดเก็บใน MongoDB รัน `seed_mongo.py` เพื่อได้ข้อมูลตัวอย่าง 24 รายการ