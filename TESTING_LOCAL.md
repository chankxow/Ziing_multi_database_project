# 🧪 วิธีทดสอบแบบ Local (ไม่ใช้ Docker)

## 📋 วิธีเลือก

| วิธี | ข้อดี | ข้อเสีย |
|------|-------|--------|
| **Docker** (แนะนำ) | ง่ายตั้งค่า, ทุกคนเหมือนกัน | ต้องมี Docker |
| **Local** | เร็ว, ควบคุมได้ | ต้องติดตั้งหลายอย่าง |

---

## 🚀 ทดสอบ Backend แบบ Local (ไม่ใช้ Docker)

### 1️⃣ ตั้งค่า Virtual Environment

```bash
cd backend

# สร้าง venv
python -m venv venv

# เปิดใช้งาน venv
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2️⃣ ติดตั้ง Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ ตั้งค่าไฟล์ .env (Local)

สร้าง `backend/.env`:

```env
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP=app.py

# สำหรับ MySQL ที่รันบน local
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=CarCustomShop

# สำหรับ MongoDB ที่รันบน local
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=CarCustomShop
```

### 4️⃣ รัน Backend

```bash
flask run
```

ควรเห็น:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### 5️⃣ ทดสอบ API

ใน Terminal ใหม่:

```bash
# ทดสอบ Health check
curl http://localhost:5000

# ทดสอบ Customers
curl http://localhost:5000/customers

# เพิ่มลูกค้า
curl -X POST http://localhost:5000/customers \
  -H "Content-Type: application/json" \
  -d '{"FirstName":"สมชาย","LastName":"ใจดี","Phone":"0812345678","Email":"somchai@example.com"}'
```

---

## 🎨 ทดสอบ Frontend แบบ Local (ไม่ใช้ Docker)

### 1️⃣ ติดตั้ง Node.js

ดาวน์โหลดจาก: https://nodejs.org/ (บาน LTS)

### 2️⃣ ติดตั้ง Dependencies

```bash
cd frontend
npm install
```

### 3️⃣ ตั้งค่า .env

สร้าง `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4️⃣ รัน Dev Server

```bash
npm run dev
```

ควรเห็น:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 5️⃣ เปิดใน Browser

```
http://localhost:5173
```

---

## 🗄️ ตั้งค่า Database แบบ Local

### MySQL Local

**Windows:**
```bash
# ดาวน์โหลด MySQL Community Server
# https://dev.mysql.com/downloads/mysql/

# หรือใช้ Homebrew (Mac)
brew install mysql
brew services start mysql

# เข้าถึง
mysql -u root -p
```

**ใน MySQL:**
```sql
CREATE DATABASE CarCustomShop;
CREATE USER 'shopuser'@'localhost' IDENTIFIED BY 'shoppass';
GRANT ALL PRIVILEGES ON CarCustomShop.* TO 'shopuser'@'localhost';
FLUSH PRIVILEGES;
```

### MongoDB Local

**Windows:**
```bash
# ดาวน์โหลด MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# หรือใช้ Homebrew (Mac)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**ทดสอบ:**
```bash
# เข้าถึง mongosh
mongosh

# สร้าง database
use CarCustomShop
```

---

## 🔄 ทดสอบแบบ Local ขั้นต้น

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate  # หรือ venv\Scripts\activate บน Windows
flask run
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3: Test
```bash
# ทดสอบ API
curl http://localhost:5000/customers
```

### Browser
```
http://localhost:5173
```

---

## 🐛 Troubleshooting Local Setup

### Backend ไม่ทำงาน

```bash
# ตรวจสอบ Python version
python --version  # ควร 3.8+

# ตรวจสอบว่า venv เปิด
which python  # Linux/Mac
where python  # Windows

# ติดตั้ง dependencies อีกครั้ง
pip install -r requirements.txt --force-reinstall
```

### Frontend ไม่ทำงาน

```bash
# ตรวจสอบ Node version
node --version  # ควร 18+
npm --version   # ควร 9+

# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
npm install
```

### MySQL ไม่เชื่อมต่อ

```bash
# ตรวจสอบว่ากำลังทำงาน
mysql -u root -p

# ลองสร้างโปรแกรมใหม่ (Windows)
mysql -u root -p -e "SELECT 1"
```

### MongoDB ไม่เชื่อมต่อ

```bash
# ตรวจสอบว่ากำลังทำงาน
mongosh

# ถ้าไม่ได้, เริ่มต้นบริการ
mongod  # macOS/Linux
# หรือเปิดบริการ MongoDB จาก Services (Windows)
```

---

## 📝 .env ทั้งหมดที่ต้องการ

### `backend/.env` (Local)
```env
FLASK_ENV=development
FLASK_DEBUG=1
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=shopuser
MYSQL_PASSWORD=shoppass
MYSQL_DB=CarCustomShop
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=CarCustomShop
```

### `frontend/.env` (Local)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🎯 เลือกวิธีไหน?

**ใช้ Docker ถ้า:**
- ✅ ต้องการตั้งค่าเร็ว
- ✅ ทีมมีหลายคน (เหมือนกันทุกคน)
- ✅ ไม่อยากติดตั้งเยอะ

**ใช้ Local ถ้า:**
- ✅ ต้องการทำงานเร็ว
- ✅ Error debugging ง่ายกว่า
- ✅ ใช้ IDE ตรวจสอบได้ดี
- ✅ Hot reload ดีกว่า

---

## ⚡ Quick Local Setup

### ครั้งแรก (5 นาที)

```bash
# Setup Backend
cd backend
python -m venv venv
source venv/bin/activate  # หรือ venv\Scripts\activate
pip install -r requirements.txt
# สร้าง .env file ด้วย values จาก localhost

# Setup Frontend
cd ../frontend
npm install
# สร้าง .env file ด้วย VITE_API_URL=http://localhost:5000
```

### ทีละ run (สองครั้ง)

```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate && flask run

# Terminal 2: Frontend
cd frontend && npm run dev
```

### เปิด Browser
```
http://localhost:5173
```

---

## 🆚 Comparison: Docker vs Local

| สิ่งที่เปรียบเทียบ | Docker | Local |
|--------|--------|-------|
| **Setup Time** | 2-3 นาที | 5-10 นาที |
| **Start Speed** | ช้า (containers) | เร็ว |
| **Database Reset** | ง่าย (docker-compose down -v) | ต้องลบ DB เอง |
| **Hot Reload** | ต่อเชื่อม | ดีมาก |
| **IDE Support** | ปานกลาง | ที่สุด |
| **Learning Curve** | ขึ้นต่อ Docker knowledge | น้อย |
| **Team Consistency** | สูงมาก | ต่ำ (โปรแกรมต่างกัน) |

---

## 🚀 แนะนำ

**สำหรับการพัฒนา:** ใช้ Local ด้วย Python venv + Node

**สำหรับ Production & Team Work:** ใช้ Docker

**ทั้งสองวิธี OK:** ขึ้นอยู่กับความสะดวก!
