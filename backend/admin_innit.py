import bcrypt
import pymysql

conn = pymysql.connect(host="localhost", user="root", password="Finemotion175%", database="CarCustomShop")
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