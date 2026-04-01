#!/usr/bin/env python3
"""
สร้าง Test User สำหรับทดสอบ register
"""

import bcrypt
from db_mysql import execute, query

def create_test_user():
    try:
        username = "testuser"
        password = "test123"
        firstName = "Test"
        lastName = "User"
        
        # เช็คว่ามี user นี้อยู่แล้วหรือไม่
        existing = query("SELECT UserID FROM User WHERE Username = %s", (username,))
        if existing:
            print(f"❌ User '{username}' มีอยู่แล้ว")
            return False
        
        # สร้าง bcrypt hash
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # สร้าง customer record ก่อน
        execute(
            "INSERT INTO Customer (FirstName, LastName, Phone, Email) VALUES (%s,%s,%s,%s)",
            (firstName, lastName, "0800000000", f"{username}@test.com")
        )
        customer_id = query("SELECT LAST_INSERT_ID() AS id")[0]["id"]
        
        # สร้าง user (RoleID = 4 = Customer)
        execute(
            "INSERT INTO User (Username, PasswordHash, FirstName, LastName, RoleID, CustomerID) VALUES (%s,%s,%s,%s,%s,%s)",
            (username, hashed, firstName, lastName, 4, customer_id)
        )
        
        print(f"✅ สร้าง Test User สำเร็จ!")
        print(f"📋 Username: {username}")
        print(f"🔑 Password: {password}")
        print(f"👤 Role: Customer")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 สร้าง Test User ใหม่...")
    success = create_test_user()
    if success:
        print("✅ พร้อมใช้งาน!")
        print("💡 ลอง login ด้วย:")
        print("   Username: testuser")
        print("   Password: test123")
