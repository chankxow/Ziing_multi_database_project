import bcrypt
from db_mysql import query

# Test password check with existing users
users = ['admin_ton', 'mech_boy', 'rec_jane']
test_passwords = ['admin123', 'staff123', 'rec123', 'test123', 'password', '123456']

for username in users:
    print(f"\n=== Testing {username} ===")
    user_data = query("SELECT * FROM User WHERE Username = %s", (username,))
    
    if user_data:
        user = user_data[0]
        stored_hash = user['PasswordHash']
        print(f"Hash: {stored_hash}")
        print(f"Hash type: {type(stored_hash)}")
        print(f"Hash length: {len(stored_hash)}")
        
        for test_pwd in test_passwords:
            try:
                if isinstance(stored_hash, str):
                    stored_hash_bytes = stored_hash.encode('utf-8')
                else:
                    stored_hash_bytes = stored_hash
                    
                if bcrypt.checkpw(test_pwd.encode('utf-8'), stored_hash_bytes):
                    print(f"✅ Password found: {test_pwd}")
                    break
                else:
                    print(f"❌ {test_pwd} - not match")
            except Exception as e:
                print(f"❌ {test_pwd} - error: {e}")
    else:
        print("User not found")
