import bcrypt
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# ใช้ environment variables แทน hardcode
conn = pymysql.connect(
    host=os.getenv("MYSQL_HOST", "localhost"),
    port=int(os.getenv("MYSQL_PORT", 3306)),
    user=os.getenv("MYSQL_USER", "root"),
    password=os.getenv("MYSQL_PASSWORD", ""),
    database=os.getenv("MYSQL_DB", "CarCustomShop"),
)
cur = conn.cursor()

username  = "admin_"
password  = "1234"
firstName = "Ton"
lastName  = "Manager"

hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
cur.execute(
    "INSERT INTO User (Username, PasswordHash, FirstName, LastName, RoleID) VALUES (%s,%s,%s,%s,1)",
    (username, hashed, firstName, lastName)
)
conn.commit()
print("สร้าง Admin สำเร็จ")
conn.close()