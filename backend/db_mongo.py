from pymongo import MongoClient
from config import *

client = MongoClient(MONGO_URI)
mongo_db = client[MONGO_DB]

parts_collection = mongo_db["parts"]
