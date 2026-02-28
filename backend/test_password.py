import bcrypt

def test_password_hashing():
    print("🔐 Password Security Demonstration")
    print("=" * 50)
    
    # Test password
    plain_password = "mypassword123"
    print(f"📝 Plain password: {plain_password}")
    print()
    
    # Hash the password (what happens during registration)
    print("🔒 Step 1: Hashing password (Registration)")
    password_hash = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    print(f"🔐 Hashed password: {password_hash.decode('utf-8')}")
    print(f"📏 Hash length: {len(password_hash)} characters")
    print()
    
    # Verify the password (what happens during login)
    print("🔑 Step 2: Verifying password (Login)")
    print(f"🔍 Testing with correct password: {plain_password}")
    
    # Test with correct password
    is_correct = bcrypt.checkpw(plain_password.encode('utf-8'), password_hash)
    print(f"✅ Password matches: {is_correct}")
    print()
    
    # Test with wrong password
    wrong_password = "wrongpassword"
    print(f"❌ Testing with wrong password: {wrong_password}")
    is_wrong = bcrypt.checkpw(wrong_password.encode('utf-8'), password_hash)
    print(f"❌ Password matches: {is_wrong}")
    print()
    
    # Security explanation
    print("🔒 Security Features:")
    print("   • One-way hashing (cannot reverse)")
    print("   • Salt added automatically (prevents rainbow table attacks)")
    print("   • Slow computation (prevents brute force attacks)")
    print("   • Different hash each time (due to random salt)")
    print()
    
    # Generate another hash to show uniqueness
    print("🔄 Hashing same password again (different result):")
    password_hash_2 = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    print(f"🔐 New hash: {password_hash_2.decode('utf-8')}")
    print(f"🔍 Hashes are different: {password_hash != password_hash_2}")
    print(f"✅ Both verify original password: {bcrypt.checkpw(plain_password.encode('utf-8'), password_hash_2)}")
    print()
    
    print("🎯 Key Points:")
    print("   • Original password is NEVER stored")
    print("   • Only the hash is stored in database")
    print("   • Hash cannot be reversed to get original password")
    print("   • Verification compares input with stored hash")

if __name__ == "__main__":
    test_password_hashing()
