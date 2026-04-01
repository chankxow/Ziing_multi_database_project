#!/usr/bin/env python3
"""
แก้ไขปัญหา Auto Increment
"""

from db_mysql import execute, query

def fix_auto_increment():
    try:
        print("🔧 แก้ไขปัญหา Auto Increment...")
        
        # ดูค่าปัจจุบัน
        print("\n📊 ตรวจสอบค่าปัจจุบัน:")
        max_id = query("SELECT MAX(CustomerID) as max_id FROM customer")[0]["max_id"]
        print(f"🔢 ค่า MAX ID ปัจจุบัน: {max_id}")
        
        # ดู auto increment value
        try:
            auto_inc = query("SHOW TABLE STATUS LIKE 'customer'")[0]["Auto_increment"]
            print(f"🔢 Auto Increment ปัจจุบัน: {auto_inc}")
        except:
            print("❌ ไม่สามารถดู Auto Increment ได้")
        
        # แก้ไข auto increment
        print("\n🔧 แก้ไข Auto Increment...")
        new_increment = max_id + 1 if max_id else 1
        execute(f"ALTER TABLE customer AUTO_INCREMENT = {new_increment}")
        print(f"✅ ตั้งค่า Auto Increment เป็น: {new_increment}")
        
        # ตรวจสอบอีกครั้ง
        auto_inc_after = query("SHOW TABLE STATUS LIKE 'customer'")[0]["Auto_increment"]
        print(f"🔢 Auto Increment หลังแก้ไข: {auto_inc_after}")
        
        # ทดสอบ INSERT
        print("\n🧪 ทดสอบ INSERT ใหม่:")
        execute("INSERT INTO customer (FirstName, LastName) VALUES (%s,%s)", ("Test", "User"))
        last_id = query("SELECT LAST_INSERT_ID() AS id")[0]["id"]
        print(f"✅ INSERT สำเร็จ! ID: {last_id}")
        
        # ลบข้อมูลทดสอบ
        execute("DELETE FROM customer WHERE CustomerID = %s", (last_id,))
        print("🗑️ ลบข้อมูลทดสอบแล้ว")
        
        print("\n🎉 แก้ไข Auto Increment สำเร็จ!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    fix_auto_increment()
