# 🧪 การทดสอบ Backend

## ✅ ขั้นตอนทดสอบ Backend

### 1️⃣ ตรวจสอบว่า Backend ทำงาน

**วิธี A: ใช้ curl (easiest)**
```bash
curl http://localhost:5000
```

ควรเห็น:
```json
{"message": "Backend Running 🚀"}
```

**วิธี B: เปิด Browser**
```
http://localhost:5000
```

---

### 2️⃣ ทดสอบ API Endpoints

#### ดึงลูกค้า (GET - MySQL)
```bash
curl http://localhost:5000/customers
```

ควรเห็น:
```json
[]  # ว่างหรือมีข้อมูล
```

#### เพิ่มลูกค้าใหม่ (POST - MySQL)
```bash
curl -X POST http://localhost:5000/customers ^
  -H "Content-Type: application/json" ^
  -d "{\"FirstName\":\"สมชาย\",\"LastName\":\"ใจดี\",\"Phone\":\"0812345678\",\"Email\":\"somchai@example.com\"}"
```

ควรเห็น:
```json
{"status": "added"}
```

#### ดึงยานพาหนะ (GET - MySQL)
```bash
curl http://localhost:5000/vehicles
```

#### ดึงชิ้นส่วน (GET - MongoDB)
```bash
curl http://localhost:5000/parts
```

ควรเห็น:
```json
[]  # ว่างหรือมีข้อมูล
```

#### เพิ่มชิ้นส่วน (POST - MongoDB)
```bash
curl -X POST http://localhost:5000/parts ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"เบรก pad\",\"price\":1200,\"stock\":50}"
```

ควรเห็น:
```json
{"status": "part added"}
```

#### ดึงคำสั่งงาน (GET - MySQL)
```bash
curl http://localhost:5000/workorders
```

---

### 3️⃣ ดูบันทึก Backend

**ดูบันทึก Real-time**
```bash
docker-compose logs -f backend
```

ควรเห็น:
```
car_custom_backend  | * Running on http://0.0.0.0:5000
car_custom_backend  | * Debug mode: on
```

**ดูบันทึก 50 บรรทัดล่าสุด**
```bash
docker-compose logs --tail 50 backend
```

**หยุดดูบันทึก**
```
Ctrl + C
```

---

### 4️⃣ ตรวจสอบฐานข้อมูล

#### MySQL
```bash
# เข้าถึง MySQL container
docker-compose exec mysql mysql -u shopuser -pshoppass CarCustomShop

# ใน MySQL shell
SHOW TABLES;
SELECT * FROM Customer;
EXIT;
```

#### MongoDB
```bash
# เข้าถึง MongoDB container
docker-compose exec mongodb mongosh -u admin -p adminpass

# ใน MongoDB shell
use CarCustomShop
db.parts.find()
exit
```

---

## 🔧 ใช้ Postman/Insomnia (GUI - ง่ายกว่า)

### ดาวน์โหลด:
- [Postman](https://www.postman.com/downloads/)
- [Insomnia](https://insomnia.rest)

### ขั้นตอน:

1. **สร้าง Request ใหม่**
   - Name: `Get Customers`
   - Method: `GET`
   - URL: `http://localhost:5000/customers`
   - Click **Send**

2. **สร้าง POST Request**
   - Name: `Add Customer`
   - Method: `POST`
   - URL: `http://localhost:5000/customers`
   - Headers: `Content-Type: application/json`
   - Body (raw):
   ```json
   {
     "FirstName": "สมชาย",
     "LastName": "ใจดี",
     "Phone": "0812345678",
     "Email": "somchai@example.com"
   }
   ```
   - Click **Send**

---

## 📋 Test Cases ที่สำคัญ

### Health Check
- [ ] `GET /` → `{"message": "Backend Running 🚀"}`

### MySQL Tests
- [ ] `GET /customers` → ได้ข้อมูลหรือ array ว่าง
- [ ] `POST /customers` → เพิ่มลูกค้าสำเร็จ
- [ ] `GET /vehicles` → ได้ข้อมูล
- [ ] `GET /workorders` → ได้ข้อมูล

### MongoDB Tests
- [ ] `GET /parts` → ได้ข้อมูลหรือ array ว่าง
- [ ] `POST /parts` → เพิ่มชิ้นส่วนสำเร็จ

### Database Connection
- [ ] MySQL เชื่อมต่อได้
- [ ] MongoDB เชื่อมต่อได้

---

## 🐛 ถ้า Error เกิดขึ้น

### Backend ไม่ตอบสนอง
```bash
# 1. ตรวจสอบว่า Docker running
docker-compose ps

# 2. ดูบันทึก
docker-compose logs backend

# 3. Restart backend
docker-compose restart backend
```

### 502 Bad Gateway (Frontend เรียก Backend)
```bash
# ตรวจสอบ Backend ทำงาน
curl http://localhost:5000

# ตรวจสอบ CORS ใน backend/app.py
# ต้องมี: from flask_cors import CORS; CORS(app)
```

### Database Connection Error
```bash
# ตรวจสอบ MySQL
docker-compose exec mysql mysql -u shopuser -pshoppass CarCustomShop

# ตรวจสอบ MongoDB
docker-compose exec mongodb mongosh admin
```

### Timeout Error
```bash
# Wait ให้ MySQL & MongoDB ready
docker-compose ps
# STATUS ต้องเป็น "Up (healthy)"

# รอจนกว่า healthy
sleep 30
```

---

## 💡 Tips

### Copy/Paste curl commands
```bash
# Windows PowerShell ต้องใช้ backtick หรือ quotes
curl http://localhost:5000/customers

# ถ้า error ให้ลองใช้เครื่องหมายคำพูด
curl "http://localhost:5000/customers"
```

### Save response ลงไฟล์
```bash
curl http://localhost:5000/customers > response.json
```

### ดู response headers
```bash
curl -i http://localhost:5000/customers
```

---

## 🎯 Quick Test Script

**สร้างไฟล์ `test-backend.ps1`:**

```powershell
# Test Backend

Write-Host "🧪 Testing Backend..." -ForegroundColor Green

# 1. Health Check
Write-Host "`n1️⃣ Health Check"
curl http://localhost:5000

# 2. Customers
Write-Host "`n2️⃣ Get Customers"
curl http://localhost:5000/customers

# 3. Add Customer
Write-Host "`n3️⃣ Add Customer"
curl -X POST http://localhost:5000/customers `
  -H "Content-Type: application/json" `
  -d '{"FirstName":"สมชาย","LastName":"ใจดี","Phone":"0812345678","Email":"somchai@example.com"}'

# 4. Parts
Write-Host "`n4️⃣ Get Parts"
curl http://localhost:5000/parts

Write-Host "`n✅ Test Complete!" -ForegroundColor Green
```

**รัน:**
```bash
.\test-backend.ps1
```

---

## ✅ Checklist ก่อนนับการทดสอบเสร็จ

- [ ] Backend running: `curl http://localhost:5000` ✅
- [ ] MySQL connected: `docker-compose exec mysql ...` ✅
- [ ] MongoDB connected: `docker-compose exec mongodb ...` ✅
- [ ] All endpoints respond ✅
- [ ] Data saves ไป database ✅
- [ ] Logs clean (no errors) ✅

---

Happy Testing! 🎉
