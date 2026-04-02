import pymysql
import os
from config import MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB

def get_connection():
    # Aiven MySQL requires SSL — detect by hostname
    use_ssl = "aivencloud.com" in (MYSQL_HOST or "")
    
    ssl_params = {"ssl": {"ssl_mode": "REQUIRED"}} if use_ssl else {}
    
    return pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
        connect_timeout=10,
        **ssl_params,
    )

def query(sql, params=None):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            return cursor.fetchall()
    finally:
        conn.close()

def execute(sql, params=None):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            return {"status": "success"}
    finally:
        conn.close()