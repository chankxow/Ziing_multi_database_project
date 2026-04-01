#!/usr/bin/env python3
"""
ทดสอบ register ผ่าน backend API
"""

import requests
import json

def test_register():
    url = "http://localhost:5000/register/customer"
    headers = {"Content-Type": "application/json"}
    data = {
        "username": "newuser123",
        "password": "test123",
        "firstName": "New",
        "lastName": "User",
        "phone": "0801234567",
        "email": "newuser@test.com"
    }
    
    try:
        print("🔍 ทดสอบ register...")
        print(f"📊 ส่งข้อมูล: {data}")
        
        response = requests.post(url, headers=headers, json=data)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 201:
            result = response.json()
            print("✅ Register สำเร็จ!")
            print(f"👤 Customer ID: {result.get('customer_id', 'N/A')}")
        else:
            print("❌ Register ล้มเหลว!")
            
    except requests.exceptions.ConnectionError:
        print("❌ ไม่สามารถเชื่อมต่อกับ backend ได้")
        print("💡 ตรวจสอบว่า backend รันอยู่: python .\\backend\\app.py")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_duplicate_register():
    url = "http://localhost:5000/register/customer"
    headers = {"Content-Type": "application/json"}
    data = {
        "username": "admin",  # username ที่มีอยู่แล้ว
        "password": "test123",
        "firstName": "Test",
        "lastName": "Dup",
        "phone": "0809999999",
        "email": "dup@test.com"
    }
    
    try:
        print("\n🔍 ทดสอบ register ซ้ำ...")
        response = requests.post(url, headers=headers, json=data)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 400:
            print("✅ ตรวจจับ username ซ้ำได้ถูกต้อง")
        else:
            print("❌ ไม่ตรวจจับ username ซ้ำ")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_register()
    test_duplicate_register()
