# test_search.py
from db_mongo import get_parts_collection
col = get_parts_collection()
result = list(col.find({"name": {"$regex": "turbo", "$options": "i"}}, {"_id": 0, "name": 1}))
print(result)