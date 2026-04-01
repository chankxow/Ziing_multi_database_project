#!/usr/bin/env python3
"""
ทดสอบ login ผ่าน backend API
"""

import requests
import json

def test_login():
    url = "http://localhost:5000/login"
    headers = {"Content-Type": "application/json"}
    data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        print("🔍 ทดสอบ login...")
        response = requests.post(url, headers=headers, json=data)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Login สำเร็จ!")
            print(f"🎫 Token: {result.get('token', 'N/A')[:50]}...")
            print(f"👤 User: {result.get('user', 'N/A')}")
        else:
            print("❌ Login ล้มเหลว!")
            
    except requests.exceptions.ConnectionError:
        print("❌ ไม่สามารถเชื่อมต่อกับ backend ได้")
        print("💡 ตรวจสอบว่า backend รันอยู่: python .\\backend\\app.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
