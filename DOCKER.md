# คู่มือการตั้งค่า Docker

## ข้อกำหนดเบื้องต้น
- Docker Desktop ติดตั้งและทำงานอยู่
- Docker Compose ติดตั้ง (มาพร้อมกับ Docker Desktop)

## การรันโปรเจกต์ด้วย Docker

### 1. คัดลอกไฟล์ Environment
```bash
cp .env.example .env
```

### 2. เริ่มต้นทุกบริการ
```bash
docker-compose up -d
```

สิ่งนี้จะเริ่มต้น:
- **MySQL** บน `localhost:3306`
- **MongoDB** บน `localhost:27017`
- **Flask Backend** บน `localhost:5000`
- **Frontend** บน `localhost:5173` (ตัวเลือก)

### 3. ตรวจสอบสถานะบริการ
```bash
docker-compose ps
```

### 4. ดูบันทึก
```bash
# ทุกบริการ
docker-compose logs -f

# บริการเฉพาะ
docker-compose logs -f backend
docker-compose logs -f mysql
docker-compose logs -f mongodb
```

## การกำหนดค่าฐานข้อมูล

### MySQL
- **โฮสต์**: `mysql` (ใน Docker) หรือ `localhost` (การเข้าถึงแบบโลคัล)
- **พอร์ต**: `3306`
- **ชื่อผู้ใช้**: `shopuser`
- **รหัสผ่าน**: `shoppass`
- **ฐานข้อมูล**: `CarCustomShop`

### MongoDB
- **โฮสต์**: `mongodb` (ใน Docker) หรือ `localhost` (การเข้าถึงแบบโลคัล)
- **พอร์ต**: `27017`
- **ฐานข้อมูล**: `CarCustomShop`

## คำสั่งที่มีประโยชน์

### คำสั่ง Backend
```bash
# ดูบันทึก backend
docker-compose logs -f backend

# เข้าถึง backend container
docker-compose exec backend bash

# รันการย้ายฐานข้อมูลหรือเตรียมใช้งาน
docker-compose exec backend flask db init
```

### คำสั่งฐานข้อมูล
```bash
# เข้าถึง MySQL CLI
docker-compose exec mysql mysql -u shopuser -pshoppass CarCustomShop

# เข้าถึง MongoDB CLI
docker-compose exec mongodb mongosh admin --username admin --password adminpass
```

### หยุดและล้างข้อมูล
```bash
# หยุดทุกบริการ
docker-compose down

# หยุดและลบโวลูม (เตือน: สิ่งนี้จะลบข้อมูลฐานข้อมูล)
docker-compose down -v

# สร้าง containers ใหม่
docker-compose build
docker-compose up -d
```

## จุดปลายทาง API

URL พื้นฐาน: `http://localhost:5000`

- `GET /` - ตรวจสอบสุขภาพ
- `GET /customers` - รับลูกค้าทั้งหมด
- `POST /customers` - เพิ่มลูกค้าใหม่
- `GET /vehicles` - รับยานพาหนะทั้งหมด
- `GET /parts` - รับชิ้นส่วนทั้งหมด (MongoDB)
- `POST /parts` - เพิ่มชิ้นส่วนใหม่ (MongoDB)
- `GET /workorders` - รับคำสั่งงานทั้งหมด

## หมายเหตุการพัฒนา

### แก้ไขโค้ด Backend
การเปลี่ยนแปลงโค้ดในโฟลเดอร์ `backend/` จะแสดงอยู่โดยอัตโนมัติเนื่องจากการติดตั้งโวลูม Flask จะสร้างใหม่โดยอัตโนมัติในโหมดการพัฒนา

### แก้ไขโค้ด Frontend
การเปลี่ยนแปลงโค้ดในโฟลเดอร์ `frontend/src/` จะแสดงอยู่โดยอัตโนมัติ เซิร์ฟเวอร์ Vite dev จะสร้างใหม่โดยอัตโนมัติ

### การเตรียมใช้งานฐานข้อมูล
วางสคริปต์การเตรียมใช้งาน SQL ในไดเรกทอรี `backend/sql/` จะถูกดำเนินการโดยอัตโนมัติเมื่อ MySQL เริ่มต้นครั้งแรก

## การแก้ไขปัญหา

### ข้อผิดพลาดการปฏิเสธการเชื่อมต่อ
ตรวจสอบให้แน่ใจว่าทุกบริการทำงานอยู่:
```bash
docker-compose ps
```

### ฐานข้อมูลไม่ได้รับการเตรียมใช้งาน
ลบโวลูมและเริ่มต้นใหม่:
```bash
docker-compose down -v
docker-compose up -d
```

### มีการใช้พอร์ตอยู่แล้ว
เปลี่ยนพอร์ตใน `docker-compose.yml` หรือยุติกระบวนการที่ใช้พอร์ตเหล่านั้น:
- MySQL: 3306
- MongoDB: 27017
- Backend: 5000
- Frontend: 5173

## หมายเหตุการใช้งานจริง

สำหรับการปรับใช้ในการใช้งานจริง:
1. อัปเดตไฟล์ `.env` ด้วยข้อมูลประจำตัวที่ปลอดภัย
2. ตั้งค่า `FLASK_ENV=production`
3. ตั้งค่า `FLASK_DEBUG=0`
4. ใช้การกำหนดค่าฐานข้อมูลระดับการใช้งานจริง
5. นำการบันทึกและการติดตามที่เหมาะสมไปใช้
