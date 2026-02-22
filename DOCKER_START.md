# 🚀 Docker Compose Quick Start

## ขั้นตอนการเริ่มต้น

### 1️⃣ ตรวจสอบ .env ให้ถูกต้อง
```bash
# ตรวจสอบ backend/.env (ควร MYSQL_HOST=mysql สำหรับ Docker)
type backend\.env | findstr MYSQL_HOST
# Output: MYSQL_HOST=mysql ✅
```

### 2️⃣ เริ่มต้นบริการทั้งหมด
```bash
docker-compose up -d
```

ควรเห็น:
```
✓ car_custom_mysql
✓ car_custom_mongodb
✓ car_custom_backend
✓ car_custom_frontend
```

### 3️⃣ ตรวจสอบสถานะ
```bash
docker-compose ps
```

ควรเห็น STATUS = "Up" ทั้งหมด

### 4️⃣ เข้าถึงบริการ
```
✓ Backend:  http://localhost:5000
✓ Frontend: http://localhost:5173
✓ MySQL:    localhost:3307 (ถ้าเชื่อมต่อจากที่อื่น)
✓ MongoDB:  localhost:27017
```

---

## 🧪 ทดสอบว่าทำงานหรือไม่

### Backend Health Check
```bash
curl http://localhost:5000
# ควรเห็น: {"message": "Backend Running 🚀"}
```

### ดูบันทึก
```bash
# ทั้งหมด
docker-compose logs -f

# เฉพาะ Backend
docker-compose logs -f backend

# MySQL
docker-compose logs -f mysql

# MongoDB
docker-compose logs -f mongodb
```

---

## 🛑 หยุดบริการ

### หยุดแต่เก็บข้อมูล
```bash
docker-compose stop
```

### หยุดและลบ containers (ลบข้อมูล)
```bash
docker-compose down
```

### หยุดและลบข้อมูลทั้งหมด (Hard Reset)
```bash
docker-compose down -v
```

---

## 🔄 Restart บริการ

### Restart ทั้งหมด
```bash
docker-compose restart
```

### Restart เฉพาะ Backend
```bash
docker-compose restart backend
```

### Rebuild (เมื่อเปลี่ยน Dockerfile)
```bash
docker-compose up -d --build
```

---

## 🐛 ถ้าเกิด Error

### MySQL Port already in use (3307)
```bash
# ตรวจสอบ port
netstat -ano | findstr 3307

# หรือเปลี่ยน port ใน docker-compose.yml
# - "3308:3306"  # ใช้ 3308 แทน 3307
```

### Backend ไม่เชื่อมต่อ Database
```bash
# ดูบันทึก
docker-compose logs backend

# Wait ให้ MySQL ready
docker-compose ps
# ต้อง mysql STATUS = "healthy"
```

### Frontend ไม่เชื่อมต่อ Backend
```bash
# ตรวจสอบ VITE_API_URL ใน docker-compose.yml
# - VITE_API_URL=http://localhost:5000

# ดูบันทึก Frontend
docker-compose logs frontend
```

---

## 📝 .env ที่ใช้กับ Docker

### backend/.env (สำหรับ Docker)
```env
MYSQL_HOST=mysql          # ✅ Docker service name
MONGO_HOST=mongodb        # ✅ Docker service name
MYSQL_USER=shopuser
MYSQL_PASSWORD=shoppass
```

### ⚠️ สำคัญ!
- ✅ ใช้ `MYSQL_HOST=mysql` สำหรับ Docker
- ❌ ไม่ใช้ `localhost` กับ Docker (localhost = container itself)

---

## 🎯 Common Commands

```bash
# Start
docker-compose up -d

# Status
docker-compose ps

# Logs
docker-compose logs -f

# Stop
docker-compose stop

# Remove
docker-compose down

# Reset (delete data)
docker-compose down -v

# Rebuild
docker-compose up -d --build

# Restart one service
docker-compose restart backend
```

---

## ✅ Checklist

- [ ] .env มี MYSQL_HOST=mysql
- [ ] docker-compose up -d เสร็จ
- [ ] docker-compose ps แสดง healthy ทั้งหมด
- [ ] curl http://localhost:5000 ตอบสนอง
- [ ] http://localhost:5173 เปิดได้
- [ ] ไม่มี error ใน logs

---

Happy! 🎉
