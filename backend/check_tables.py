#!/usr/bin/env python3
"""
ตรวจสอบตารางใน MySQL
"""

from db_mysql import query

def check_tables():
    try:
        print("🔍 ตรวจสอบตารางทั้งหมด...")
        
        # ดูตารางทั้งหมด
        tables = query("SHOW TABLES")
        print(f"📋 จำนวนตาราง: {len(tables)}")
        
        table_names = []
        for table in tables:
            table_name = list(table.values())[0]
            table_names.append(table_name)
            print(f"   - {table_name}")
        
        # ตรวจสอบตารางที่จำเป็น
        required_tables = ['User', 'Customer', 'Role']
        for table in required_tables:
            if table in table_names:
                count = query(f"SELECT COUNT(*) as count FROM {table}")[0]['count']
                print(f"✅ {table}: {count} records")
            else:
                print(f"❌ {table}: ไม่พบตาราง")
        
        # ตรวจสอบโครงสร้างตาราง Customer
        if 'Customer' in table_names:
            print("\n🔍 โครงสร้างตาราง Customer:")
            desc = query("DESCRIBE Customer")
            for col in desc:
                print(f"   - {col['Field']}: {col['Type']} {col['Null']} {col['Key']}")
        
        # ตรวจสอบโครงสร้างตาราง User  
        if 'User' in table_names:
            print("\n🔍 โครงสร้างตาราง User:")
            desc = query("DESCRIBE User")
            for col in desc:
                print(f"   - {col['Field']}: {col['Type']} {col['Null']} {col['Key']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_tables()
