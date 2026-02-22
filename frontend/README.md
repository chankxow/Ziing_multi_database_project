# 🎨 Frontend - ส่วนติดต่อผู้ใช้

## ภาพรวม

นี่คือส่วน Frontend ของโปรเจกต์ร้านแต่งรถ สร้างด้วย React, TypeScript, และ Vite

### เทคโนโลยี
- **React 18** - ไลบรารี UI
- **TypeScript** - Static type checking
- **Vite** - Build tool สมัยใหม่ที่รวดเร็ว
- **CSS** - Styling

---

## 🚀 เริ่มต้นอย่างรวดเร็ว

### ติดตั้งการพึ่งพา
```bash
npm install
```

### เรียกใช้เซิร์ฟเวอร์การพัฒนา
```bash
npm run dev
```
สามารถจะเปิดที่ `http://localhost:5173`

### สร้างสำหรับการใช้งานจริง
```bash
npm run build
```

---

## 📁 โครงสร้างไฟล์โปรเจกต์

frontend/
├── src/
│   ├── App.tsx              # ไฟล์หลักของ App
│   ├── App.css              # สไตล์ของ App
│   ├── main.tsx             # จุดเข้าแอปพลิเคชัน
│   ├── index.css            # สไตล์ส่วนกลาง
│   └── assets/              # รูปภาพและไฟล์สื่อ
├── public/                  # ไฟล์ static
├── index.html               # ไฟล์ HTML หลัก
├── vite.config.ts           # การกำหนดค่า Vite
├── tsconfig.json            # การกำหนดค่า TypeScript
├── package.json             # การพึ่งพาและสคริปต์
└── Dockerfile               # สำหรับสร้าง Docker image

---

## 📦 Scripts ที่มีประโยชน์

| คำสั่ง | รายละเอียด |
|--------|----------|
| npm run dev | เริ่มต้นเซิร์ฟเวอร์พัฒนา |
| npm run build | สร้างเวอร์ชั่นสำหรับการใช้งานจริง |

---

## 🔌 การเชื่อมต่อ Backend

### ตัวแปรสภาพแวดล้อม
สร้างไฟล์ `.env` ในโฟลเดอร์ frontend:

VITE_API_URL=http://localhost:5000

---

## 📚 เอกสารอ้างอิง

- Vite Documentation: https://vitejs.dev/
- React Documentation: https://react.dev/
- TypeScript Documentation: https://www.typescriptlang.org/

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
