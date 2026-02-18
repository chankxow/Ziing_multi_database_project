import pymysql
from config import *

conn = pymysql.connect(
    host=MYSQL_HOST,
    user=MYSQL_USER,
    password=MYSQL_PASSWORD,
    database=MYSQL_DB,
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True
)

def query(sql, params=None):
    with conn.cursor() as cursor:
        cursor.execute(sql, params)
        return cursor.fetchall()

def execute(sql, params=None):
    with conn.cursor() as cursor:
        cursor.execute(sql, params)
        return {"status": "success"}
