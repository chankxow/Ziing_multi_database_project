# 🧪 วิธีทดสอบ Frontend & Backend

## 🚀 วิธีเร็วที่สุด (ใช้ Docker)

### เริ่มต้นทั้งหมดพร้อมกัน
```bash
docker-compose up -d
```

จากนั้นตรวจสอบสถานะ:
```bash
docker-compose ps
```

ต่อไปเข้าถึง:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **MySQL**: localhost:3306
- **MongoDB**: localhost:27017

---

## 🧪 ทดสอบ Backend

### 1️⃣ ตรวจสอบว่า Backend ทำงานหรือไม่

**วิธี A: ใช้ Browser**
```
http://localhost:5000
```
ควรเห็น: `{"message": "Backend Running 🚀"}`

**วิธี B: ใช้ Terminal (curl)**
```bash
curl http://localhost:5000
```

### 2️⃣ ทดสอบ API Endpoints

#### ดึงลูกค้า (GET)
```bash
curl http://localhost:5000/customers
```

#### เพิ่มลูกค้าใหม่ (POST)
```bash
curl -X POST http://localhost:5000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "FirstName": "สมชาย",
    "LastName": "ใจดี",
    "Phone": "0812345678",
    "Email": "somchai@example.com"
  }'
```

#### ดึงยานพาหนะ (GET)
```bash
curl http://localhost:5000/vehicles
```

#### ดึงชิ้นส่วน (GET - MongoDB)
```bash
curl http://localhost:5000/parts
```

#### เพิ่มชิ้นส่วน (POST - MongoDB)
```bash
curl -X POST http://localhost:5000/parts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "เบรก pad",
    "price": 1200,
    "stock": 50
  }'
```

#### ดึงคำสั่งงาน (GET)
```bash
curl http://localhost:5000/workorders
```

### 3️⃣ ดูบันทึก Backend

```bash
# ดูบันทึก real-time
docker-compose logs -f backend

# ดูบันทึก 50 บรรทัดขาดท้าย
docker-compose logs --tail 50 backend

# ดูบันทึกทั้งหมด
docker-compose logs backend
```

### 4️⃣ เข้าถึง Backend Container

```bash
docker-compose exec backend bash
```

ตอนนี้คุณอยู่ในตัวม่ลิ้งของ Backend:
```bash
# ดูไฟล์
ls -la

# รัน Python command
python -c "import flask; print(flask.__version__)"

# แก้ไขไฟล์
nano app.py
```

### 5️⃣ ใช้ Postman/Insomnia (GUI)

ดีกว่า curl สำหรับการทดสอบ API ที่ซับซ้อน:

1. ดาวน์โหลด [Postman](https://www.postman.com/downloads/) หรือ [Insomnia](https://insomnia.rest/)
2. สร้าง request ใหม่
3. ตั้งค่า:
   - **Method**: GET/POST
   - **URL**: http://localhost:5000/customers
   - **Headers**: Content-Type: application/json
   - **Body** (สำหรับ POST):
   ```json
   {
     "FirstName": "สมชาย",
     "LastName": "ใจดี",
     "Phone": "0812345678",
     "Email": "somchai@example.com"
   }
   ```

---

## 🎨 ทดสอบ Frontend

### 1️⃣ ตรวจสอบว่า Frontend ทำงานหรือไม่

```
http://localhost:5173
```

ควรเห็นหน้า React app

### 2️⃣ ดูบันทึก Frontend

```bash
# ดูบันทึก real-time
docker-compose logs -f frontend

# หรือรัน locally
cd frontend
npm run dev
```

### 3️⃣ ทดสอบ Hot Reload

แก้ไขไฟล์ใน `frontend/src/App.tsx`:
```tsx
return (
  <>
    <h1>สวัสดี! 🚀</h1>
  </>
)
```

บันทึก → ตรวจสอบ http://localhost:5173 → ควรเห็นการเปลี่ยนแปลง

### 4️⃣ เข้าถึง Frontend Container

```bash
docker-compose exec frontend bash
```

ตอนนี้อยู่ใน Frontend container:
```bash
# ตรวจสอบ npm packages
npm list

# รัน build
npm run build
```

### 5️⃣ Open Browser DevTools

กด `F12` เพื่อเปิด DevTools:
- **Console**: ตรวจสอบ JavaScript errors
- **Network**: ดูการร้องขอ API
- **Application**: ตรวจสอบ local storage, cookies

---

## 🔗 ทดสอบการเชื่อมต่อ Frontend ↔ Backend

### 1️⃣ ตรวจสอบว่า Frontend เชื่อมต่อ Backend ได้

ใน `frontend/src/App.tsx`, เพิ่มโค้ดนี้:

```tsx
import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // ทดสอบการเชื่อมต่อ
    fetch('http://localhost:5000')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setError(err.message))
  }, [])

  return (
    <div>
      <h1>🚀 ทดสอบการเชื่อมต่อ</h1>
      {data && <p>✅ Backend ตอบสนอง: {JSON.stringify(data)}</p>}
      {error && <p>❌ ข้อผิดพลาด: {error}</p>}
    </div>
  )
}

export default App
```

บันทึก → ตรวจสอบ http://localhost:5173

### 2️⃣ ดূบันทึก Network ใน DevTools

1. เปิด DevTools (F12)
2. ไปที่ **Network** tab
3. รีเฟรช หน้า
4. ตรวจสอบการร้องขอไปยัง `http://localhost:5000`
5. ตรวจสอบ Response

---

## 🛠️ Tools ที่ดีสำหรับทดสอบ

### API Testing
| Tool | ข้อดี | ข้อเสีย |
|------|-------|--------|
| **curl** | Built-in, ฟรี | Command line เท่านั้น |
| **Postman** | GUI, user-friendly | ใหญ่, ต้องสมัครสมาชิก |
| **Insomnia** | GUI, lightweight | น้อย features than Postman |
| **REST Client (VS Code)** | Built-in editor | เล็กน้อย |

### Browser DevTools
```bash
# ใช้ Chrome DevTools (F12)
- Console: ตรวจสอบ JS errors
- Network: ดูการร้องขอ HTTP
- Application: ตรวจสอบ localStorage
```

---

## 🐛 Debugging

### Backend Logs มีเรื่องไป

```bash
# ดูบันทึก
docker-compose logs -f backend

# ตรวจสอบ container กำลังทำงาน
docker-compose ps

# Restart backend
docker-compose restart backend

# ลบและสร้าง backend ใหม่
docker-compose up -d --build backend
```

### Frontend ไม่เชื่อมต่อ Backend

```bash
# 1. ตรวจสอบ Backend port
curl http://localhost:5000

# 2. ตรวจสอบ CORS (ตรวจ frontend DevTools)
# Error: "has been blocked by CORS policy"
# → Backend requires CORS headers

# 3. ดูบันทึก Frontend
docker-compose logs -f frontend

# 4. ตรวจสอบ API URL ใน .env
cat .env | grep VITE_API_URL
```

### CORS Error

ถ้า Backend ให้ error: `CORS policy: No 'Access-Control-Allow-Origin'`

ตรวจสอบ `backend/app.py`:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # ต้องมีบรรทัดนี้
```

---

## 📋 Checklist ทดสอบ Complete

- [ ] Backend ทำงาน (http://localhost:5000)
- [ ] MySQL เชื่อมต่อได้ (docker exec mysql ...)
- [ ] MongoDB เชื่อมต่อได้ (docker exec mongodb ...)
- [ ] Frontend ทำงาน (http://localhost:5173)
- [ ] API endpoint ทั้งหมดตอบสนอง
- [ ] Frontend เรียก Backend ได้สำเร็จ
- [ ] Hot reload ทำงาน (แก้ไขไฟล์ → เห็นการเปลี่ยน)
- [ ] ไม่มี console errors

---

## ⚡ Quick Test Commands

วาง commands นี้ไว้สำหรับการทดสอบเร็ว:

```bash
# ตรวจสอบ API health
curl http://localhost:5000

# ทดสอบ Frontend
curl http://localhost:5173

# ดูบันทึกทั้งหมด
docker-compose logs -f

# Restart ทั้งหมด
docker-compose down && docker-compose up -d

# ลบและสร้างใหม่ (hard reset)
docker-compose down -v && docker-compose up -d --build
```

---

## 🎯 Summary

**ทดสอบแบบรวดเร็ว:**
```bash
# 1. เริ่มต้น
docker-compose up -d

# 2. เทส Backend
curl http://localhost:5000

# 3. เทส Frontend
# เปิด http://localhost:5173 ใน browser

# 4. เทส API
curl -X GET http://localhost:5000/customers

# 5. เทส connection
# เปิด DevTools (F12) ใน Frontend → ตรวจสอบ Network
```

Happy Testing! 🎉
