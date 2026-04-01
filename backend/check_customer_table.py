#!/usr/bin/env python3
"""
ตรวจสอบโครงสร้างตาราง customer อย่างละเอียด
"""

from db_mysql import query

def check_customer_table():
    try:
        print("🔍 ตรวจสอบตาราง customer...")
        
        # ดูโครงสร้าง
        print("\n📋 โครงสร้างตาราง customer:")
        desc = query("DESCRIBE customer")
        for col in desc:
            print(f"   - {col['Field']}: {col['Type']} | Null: {col['Null']} | Key: {col['Key']} | Default: {col['Default']}")
        
        # ดูข้อมูลปัจจุบัน
        print("\n📄 ข้อมูลในตาราง customer:")
        customers = query("SELECT * FROM customer")
        if customers:
            for customer in customers:
                print(f"   ID: {customer['CustomerID']} | {customer['FirstName']} {customer['LastName']} | {customer['Email']}")
        else:
            print("   (ไม่มีข้อมูล)")
        
        # ทดสอบ INSERT ง่ายๆ
        print("\n🧪 ทดสอบ INSERT ง่ายๆ:")
        try:
            from db_mysql import execute
            execute("INSERT INTO customer (FirstName, LastName) VALUES (%s,%s)", ("Test", "User"))
            last_id = query("SELECT LAST_INSERT_ID() AS id")[0]["id"]
            print(f"✅ INSERT สำเร็จ! ID: {last_id}")
            
            # ลบข้อมูลทดสอบ
            execute("DELETE FROM customer WHERE CustomerID = %s", (last_id,))
            print("🗑️ ลบข้อมูลทดสอบแล้ว")
            
        except Exception as e:
            print(f"❌ INSERT ล้มเหลว: {e}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_customer_table()
