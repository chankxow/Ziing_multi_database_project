import pymysql
import pymongo
from pymongo import MongoClient
from config import get_config
import logging

# Get configuration
config = get_config()

# MySQL connection
def get_mysql_connection():
    """Create MySQL database connection"""
    try:
        connection = pymysql.connect(
            host=config.MYSQL_HOST,
            port=config.MYSQL_PORT,
            user=config.MYSQL_USER,
            password=config.MYSQL_PASSWORD,
            database=config.MYSQL_DB,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except Exception as e:
        logging.error(f"MySQL connection failed: {str(e)}")
        raise

def query(sql, params=None):
    """Execute MySQL query and return results"""
    connection = None
    try:
        connection = get_mysql_connection()
        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            if sql.strip().upper().startswith('SELECT'):
                result = cursor.fetchall()
                # Convert tuples to lists for consistency
                if result and isinstance(result[0], tuple):
                    result = [list(row) for row in result]
                return result
            else:
                connection.commit()
                # For INSERT, return last_insert_id, for others return rowcount
                if sql.strip().upper().startswith('INSERT'):
                    return cursor.lastrowid if cursor.lastrowid else True
                else:
                    return cursor.rowcount if cursor.rowcount else True
    except Exception as e:
        if connection:
            connection.rollback()
        logging.error(f"MySQL query failed: {str(e)}")
        raise
    finally:
        if connection:
            connection.close()

def execute(sql, params=None):
    """Execute MySQL statement (INSERT, UPDATE, DELETE)"""
    connection = None
    try:
        connection = get_mysql_connection()
        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            connection.commit()
            return cursor.rowcount
    except Exception as e:
        if connection:
            connection.rollback()
        logging.error(f"MySQL execute failed: {str(e)}")
        raise
    finally:
        if connection:
            connection.close()

# MongoDB connection
_mongo_client = None
_mongo_db = None

def get_mongo_client():
    """Get MongoDB client"""
    global _mongo_client
    if _mongo_client is None:
        try:
            _mongo_client = MongoClient(
                host=config.MONGO_HOST,
                port=config.MONGO_PORT,
                serverSelectionTimeoutMS=5000
            )
            # Test connection
            _mongo_client.server_info()
        except Exception as e:
            logging.error(f"MongoDB connection failed: {str(e)}")
            raise
    return _mongo_client

def get_mongo_database():
    """Get MongoDB database"""
    global _mongo_db
    if _mongo_db is None:
        client = get_mongo_client()
        _mongo_db = client[config.MONGO_DB]
    return _mongo_db

def get_parts_collection():
    """Get parts collection from MongoDB"""
    db = get_mongo_database()
    return db.parts

def check_db_connection():
    """Check database connections"""
    try:
        # Test MySQL
        mysql_conn = get_mysql_connection()
        with mysql_conn.cursor() as cursor:
            cursor.execute("SELECT 1")
        mysql_conn.close()
        
        # Test MongoDB
        mongo_client = get_mongo_client()
        mongo_client.server_info()
        
        logging.info("Database connections successful")
        return True
    except Exception as e:
        logging.error(f"Database connection check failed: {str(e)}")
        raise
