#!/usr/bin/env python3
"""
สร้าง Admin User ใหม่ด้วย bcrypt hash ที่ถูกต้อง
"""

import bcrypt
import pymysql
from db_mysql import execute, query

def create_admin_user():
    try:
        username = "admin"
        password = "admin123"
        firstName = "Admin"
        lastName = "User"
        
        # เช็คว่ามี user นี้อยู่แล้วหรือไม่
        existing = query("SELECT UserID FROM User WHERE Username = %s", (username,))
        if existing:
            print(f"❌ User '{username}' มีอยู่แล้ว")
            return False
        
        # สร้าง bcrypt hash ที่ถูกต้อง
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(f"🔐 Generated hash: {hashed}")
        
        # สร้าง admin user (RoleID = 1)
        execute(
            "INSERT INTO User (Username, PasswordHash, FirstName, LastName, RoleID) VALUES (%s,%s,%s,%s,%s)",
            (username, hashed, firstName, lastName, 1)
        )
        
        print(f"✅ สร้าง Admin User สำเร็จ!")
        print(f"📋 Username: {username}")
        print(f"🔑 Password: {password}")
        print(f"👤 Role: Admin")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 สร้าง Admin User ใหม่...")
    success = create_admin_user()
    if success:
        print("✅ พร้อมใช้งาน!")
        print("💡 ลอง login ด้วย:")
        print("   Username: admin")
        print("   Password: admin123")
    else:
        print("❌ สร้างไม่สำเร็จ")
