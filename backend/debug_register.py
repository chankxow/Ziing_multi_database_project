#!/usr/bin/env python3
"""
Debug register process step by step
"""

from db_mysql import execute, query
import bcrypt

def debug_register():
    try:
        print("🔍 Debug Register Process...")
        
        # ข้อมูลทดสอบ
        username = "debuguser"
        password = "test123"
        firstName = "Debug"
        lastName = "User"
        phone = "0809999999"
        email = "debug@test.com"
        
        print(f"📋 ข้อมูล: {username} / {firstName} {lastName}")
        
        # Step 1: ตรวจสอบ username ซ้ำ
        print("\n[1] ตรวจสอบ username ซ้ำ...")
        existing = query("SELECT UserID FROM user WHERE Username = %s", (username,))
        if existing:
            print("❌ Username ซ้ำ")
            return
        print("✅ Username ไม่ซ้ำ")
        
        # Step 2: สร้าง Customer
        print("\n[2] สร้าง Customer...")
        execute("INSERT INTO customer (FirstName, LastName, Phone, Email) VALUES(%s,%s,%s,%s)",
                (firstName, lastName, phone, email))
        customer_id = query("SELECT LAST_INSERT_ID() AS id")[0]["id"]
        print(f"✅ Customer ID: {customer_id}")
        
        # Step 3: ตรวจสอบว่า Customer ถูกสร้างจริง
        print("\n[3] ตรวจสอบ Customer...")
        customer_check = query("SELECT * FROM customer WHERE CustomerID = %s", (customer_id,))
        if customer_check:
            print("✅ Customer ถูกสร้างแล้ว")
            print(f"📄 Customer data: {customer_check[0]}")
        else:
            print("❌ Customer ไม่ถูกสร้าง")
            return
        
        # Step 4: สร้าง User
        print("\n[4] สร้าง User...")
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(f"🔐 Hash: {hashed}")
        
        execute("INSERT INTO user (Username,PasswordHash,FirstName,LastName,RoleID,CustomerID) VALUES(%s,%s,%s,%s,%s,%s)",
                (username, hashed, firstName, lastName, 4, customer_id))
        
        print("✅ User ถูกสร้างแล้ว")
        
        # Step 5: ตรวจสอบ User
        print("\n[5] ตรวจสอบ User...")
        user_check = query("SELECT * FROM user WHERE Username = %s", (username,))
        if user_check:
            print("✅ User ถูกสร้างแล้ว")
            print(f"📄 User data: {user_check[0]}")
        else:
            print("❌ User ไม่ถูกสร้าง")
        
        print("\n🎉 Register Debug สำเร็จ!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_register()
