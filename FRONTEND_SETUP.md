# 🎨 Frontend Development Setup

## 🚀 วิธีการตั้งค่า (แนะนำ)

### สถาปัตยกรรมที่ดีที่สุด:

```
┌─────────────────────────────────────┐
│  Your Computer (Local Machine)      │
├─────────────────────────────────────┤
│ Frontend                            │ <- npm run dev (localhost:5173)
│ └-> http://localhost:5000 (API)     │
└─────────────────────────────────────┘
            ↓ API calls
┌─────────────────────────────────────┐
│  Docker Container (Isolated)        │
├─────────────────────────────────────┤
│ Backend + MySQL + MongoDB           │
│ └-> localhost:5000                  │
└─────────────────────────────────────┘
```

---

## 📋 ขั้นตอน (ใช้โดยเลือก)

### **Option 1: Backend in Docker + Frontend Local (แนะนำ ⭐)**

**ข้อดี:**
- ✅ Hot reload frontend เร็ว
- ✅ Easy debugging ใน VS Code
- ✅ Databases พร้อมใช้งาน

**ขั้นตอน:**

**Terminal 1: เริ่มต้น Docker (Backend, MySQL, MongoDB)**
```bash
docker-compose up -d
```

ตรวจสอบ:
```bash
docker-compose ps
# API should respond
curl http://localhost:5000
```

**Terminal 2: เริ่มต้น Frontend local**
```bash
cd frontend

# ติดตั้ง dependencies (ครั้งแรก)
npm install

# รัน dev server
npm run dev
```

ควรเห็น:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
```

**Browser:**
```
http://localhost:5173
```

---

### **Option 2: ทั้งหมดใน Docker**

**ข้อเสีย:**
- ❌ Hot reload ช้า
- ❌ Debugging ยากกว่า
- ❌ Port conflicts

**ถ้าต้องการใช้:**

1. **Enable frontend ใน docker-compose.yml**
   - Uncomment `frontend:` section
   - Comment `frontend: ↓`

2. **รับ dependencies ให้ complete**
   ```bash
   cd frontend
   npm install
   docker-compose up -d --build
   ```

3. **เข้าถึง**
   ```
   http://localhost:5173
   ```

---

## 🔧 Frontend Configuration

### .env file
ถ้าต้องการเปลี่ยน API URL:

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000
```

### Vite Config
ตรวจสอบ `frontend/vite.config.ts` มี:
```typescript
export default defineConfig({
  server: {
    host: '0.0.0.0',  // เพื่อให้เข้าถึงได้จาก Docker
  }
})
```

---

## 📦 Dependencies

### ติดตั้ง (ครั้งแรก)
```bash
cd frontend
npm install
```

### Update dependencies
```bash
npm update
```

### ลบและติดตั้งใหม่
```bash
rm -rf node_modules
npm install
```

---

## 🚀 Commands

| Command | ทำอะไร |
|---------|--------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview prod build locally |
| `npm run lint` | Check code |

---

## 🐛 Troubleshooting Frontend

### Port 5173 already in use
```bash
# ค้นหา process
netstat -ano | findstr 5173

# Kill process (Windows)
taskkill /PID <PID> /F

# หรือใช้ port อื่น
npm run dev -- --port 5174
```

### Dependencies ไม่ติดตั้ง
```bash
rm -rf node_modules package-lock.json
npm install
```

### API ไม่ตอบสนอง
```bash
# ตรวจสอบ Backend ทำงาน
curl http://localhost:5000

# ตรวจสอบ .env
cat .env | grep VITE_API_URL
```

### CORS Error
ตรวจสอบ `backend/app.py` มี:
```python
from flask_cors import CORS
CORS(app)
```

---

## 🎯 Best Practice สำหรับ Development

### ✅ ขั้นตอนแรก (ทำ 1 ครั้ง)
```bash
# 1. เริ่ม Docker
docker-compose up -d

# 2. ติดตั้ง npm dependencies
cd frontend && npm install
```

### ✅ ทุกวัน
```bash
# Terminal 1: Docker (ปล่อยไว้รันตามปกติ)
docker-compose up -d

# Terminal 2: Frontend
cd frontend
npm run dev
```

### ✅ เข้าถึง
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
MySQL:    localhost:3307 (ถ้าต้องการเชื่อมต่อ)
MongoDB:  localhost:27017
```

---

## 📝 สรุป Recommended Setup

**ใช้ Option 1 (Backend Docker + Frontend Local):**

```bash
# Terminal 1: Docker backend
docker-compose up -d

# Terminal 2: Frontend dev server
cd frontend && npm run dev

# Browser
http://localhost:5173
```

**ทำไมดี:**
- 🚀 Hot reload รวดเร็ว
- 👨‍💻 Debugging ง่าย
- 🔧 ลดปัญหา Docker
- 📊 ติดตสถานะจริง

Happy Coding! 🎉
