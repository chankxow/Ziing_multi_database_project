# 📋 Git Ignore & Best Practices

## 🚫 ไฟล์/โฟลเดอร์ที่ไม่ควร Push

### Python
```
backend/venv/                 # Python virtual environment
backend/env/                  # Alternative virtual environment
__pycache__/                  # Python cache files
*.pyc                         # Compiled Python files
*.egg-info/                   # Egg info from setup.py
.pytest_cache/                # Pytest cache
```

### Node.js/Frontend
```
frontend/node_modules/        # NPM packages (ใหญ่เกิน ~500MB)
frontend/dist/                # Built production files
frontend/*.local              # Local dev files (*.vscode.env)
npm-debug.log*                # NPM debug logs
yarn-debug.log*               # Yarn debug logs
```

### สภาพแวดล้อม & Secrets
```
.env                          # ⚠️ IMPORTANT: Credentials & passwords
.env.local                    # Local development overrides
backend/.env                  # Backend specific env
frontend/.env                 # Frontend specific env
```

### IDE & Editor
```
.vscode/                      # VS Code settings
!.vscode/extensions.json      # (แต่เก็บข้อมูลส่วนขยายแนะนำ)
.idea/                        # JetBrains IDE
*.sublime-workspace           # Sublime Text
*.sublime-project             # Sublime Project
```

### OS Specific
```
.DS_Store                     # macOS folder metadata
Thumbs.db                     # Windows image cache
Desktop.ini                   # Windows folder properties
ehthumbs.db                   # Windows thumbnail cache
```

### Docker
```
docker-compose.override.yml   # Local Docker overrides
.dockerignore                 # Docker ignore file
```

### Database
```
*.db                          # SQLite databases
*.sqlite                      # SQLite databases
*.sqlite3                     # SQLite databases
mysql-data/                   # MySQL data volume
mongo-data/                   # MongoDB data volume
```

### Logs & Temporary Files
```
logs/                         # Application logs
*.log                         # Log files
*.tmp                         # Temporary files
*.bak                         # Backup files
*.swp                         # Vim swap files
.cache/                       # Cache directories
```

---

## ✅ ไฟล์ที่ควร Push

```
✓ .gitignore                  # Git ignore rules
✓ .gitattributes              # Git attributes (line endings, binary)
✓ .env.example                # Template environment (ไม่มี values จริง)
✓ backend/requirements.txt    # Python dependencies
✓ package.json & package-lock.json  # NPM dependencies
✓ Dockerfile                  # Container definitions
✓ docker-compose.yml          # Service orchestration
✓ *.md (README, DOCKER.md)    # Documentation
✓ Source code (.py, .tsx, .ts, .js)
✓ Configuration files (vite.config.ts, tsconfig.json)
```

---

## 🔒 ความปลอดภัย

### ⚠️ NEVER Push:
- `.env` files with actual credentials
- Passwords, API keys, tokens
- Database credentials
- Private keys
- AWS keys or similar

### ✅ Safe to Push:
- `.env.example` - ตัวอย่าง (สมมติค่า)
- `.gitignore` - ระบุสิ่งที่ซ่อน
- Public documentation

### เทคนิคที่ดี:
1. **ใช้ .env.example:**
   ```
   # .env.example
   MYSQL_PASSWORD=your_password_here
   
   # นอก .env (ล้มเหลว):
   MYSQL_PASSWORD=actualPassword123
   ```

2. **ตรวจสอบก่อน Commit:**
   ```bash
   git status              # ตรวจสอบไฟล์ที่เปลี่ยน
   git diff               # ดูการเปลี่ยนแปลง
   ```

3. **ใช้ git-secrets (ตัวเลือก):**
   ```bash
   # ติดตั้ง git-secrets เพื่อป้องกัน secrets
   brew install git-secrets
   git secrets --install
   ```

---

## 📝 Commit Best Practices

### Good Commit Message:
```
feat: เพิ่มการ authenticate ลูกค้า
fix: แก้ไข bug การเชื่อมต่อ MongoDB
docs: อัปเดต README
chore: อัปเดต dependencies
```

### Bad Commit Message:
```
updated stuff
fix bug
asdf
```

---

## 🚀 Workflow

1. **ก่อน Push:**
   ```bash
   git status                  # ตรวจสอบสิ่งที่จะ push
   git diff                     # ดูรายละเอียด
   ```

2. **ตรวจสอบ .gitignore:**
   ```bash
   # ดูไฟล์ที่ถูก track
   git check-ignore -v .env
   
   # ดูไฟล์ที่ไม่ถูก ignore
   git ls-files
   ```

3. **ถ้าทำผิด (push .env โดยบังเอิญ):**
   ```bash
   # ลบออกจาก git history
   git rm --cached .env
   git commit -m "Remove .env file"
   git push
   
   # ⚠️ แต่ git history ยังจำ credentials!
   # ดีกว่า: เปลี่ยน credentials ทันที
   ```

---

## 📦 File Size Limits

สำหรับ GitHub ฟรี:
- Single file max: 100MB
- Repository สมบูรณ์: ไม่มีขีด จำกัด
- แต่ **ใหญ่เกิน 50MB = ช้า**

### ต้องหลีกเลี่ยง:
- `node_modules/` (~500MB สำหรับโปรเจกต์ขนาดใหญ่)
- Database files
- Build artifacts (`dist/`, `build/`)
- Binary files ที่สร้างจาก source

---

## 🛠️ Tools

### VS Code สำหรับ .gitignore:
- Extension: "gitignore"
- Syntax highlighting & templates

### Command Line Check:
```bash
# ดูไฟล์ที่ไม่ได้ track
git status

# ดูไฟล์ในโปรเจกต์
git ls-files

# ลบไฟล์ผิดพลาดจาก git
git rm --cached filename
```

---

## ✨ Summary

**Quick Checklist ก่อน Push:**
- [ ] No `.env` files with credentials
- [ ] No `node_modules/` หรือ `venv/`
- [ ] No `.pyc` หรือ `__pycache__`
- [ ] No IDE settings files
- [ ] No build output files (`dist/`, `build/`)
- [ ] No database files
- [ ] No log files

หากปฏิบัติตามนี้ repository ของคุณจะสะอาด, ปลอดภัย, และมีขนาดเล็ก! ✨
