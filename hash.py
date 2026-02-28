import bcrypt

def hash_password(password):
    """Hash password ด้วย bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Hash passwords สำหรับ test users
test_password = "test123"
hashed = hash_password(test_password)
print(f"Hashed password for 'test123': {hashed}")

# Hash สำหรับแต่ละ user
users = [
    ("admin", "Admin", "User", 1),
    ("staff", "Staff", "User", 2), 
    ("customer", "Customer", "User", 3)
]

print("\n--- SQL INSERT Statements ---")
for username, first_name, last_name, role_id in users:
    hashed_pwd = hash_password(test_password)
    print(f"""INSERT INTO User (Username, PasswordHash, FirstName, LastName, RoleID) 
VALUES ('{username}', '{hashed_pwd}', '{first_name}', '{last_name}', {role_id});""")
