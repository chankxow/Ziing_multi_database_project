"""
seed_mongo.py — รัน 1 ครั้งเพื่อเพิ่ม Parts sample data ลง MongoDB

วิธีใช้:
    python seed_mongo.py
"""
from database import get_parts_collection

SAMPLE_PARTS = [
    # Engine
    {"part_id":"ENG-001","name":"Turbocharger GT3582",         "category":"Engine",     "brand":"Garrett",    "price":28500,"stock":3, "compatible_models":["Supra MK5","GTR R35"]},
    {"part_id":"ENG-002","name":"Intercooler 600HP",            "category":"Engine",     "brand":"HKS",        "price":12000,"stock":5, "compatible_models":["Civic FK8","Supra MK5"]},
    {"part_id":"ENG-003","name":"Cold Air Intake Kit",          "category":"Engine",     "brand":"Mishimoto",  "price":4500, "stock":12,"compatible_models":["Universal"]},
    {"part_id":"ENG-004","name":"Performance Exhaust Cat-Back", "category":"Engine",     "brand":"Tomei",      "price":18000,"stock":4, "compatible_models":["GTR R35","Supra MK5"]},
    {"part_id":"ENG-005","name":"High-Flow Fuel Injectors x6",  "category":"Engine",     "brand":"Bosch",      "price":9500, "stock":8, "compatible_models":["Universal"]},
    {"part_id":"ENG-006","name":"Oil Cooler Kit",               "category":"Engine",     "brand":"Setrab",     "price":7800, "stock":6, "compatible_models":["Universal"]},

    # Suspension
    {"part_id":"SUS-001","name":"Coilover Kit Street",          "category":"Suspension", "brand":"KW",         "price":32000,"stock":2, "compatible_models":["Civic FK8","MX-5"]},
    {"part_id":"SUS-002","name":"Coilover Kit Track",           "category":"Suspension", "brand":"Öhlins",     "price":58000,"stock":1, "compatible_models":["Supra MK5","GTR R35"]},
    {"part_id":"SUS-003","name":"Sway Bar Front 22mm",          "category":"Suspension", "brand":"Whiteline",  "price":5800, "stock":6, "compatible_models":["Universal"]},
    {"part_id":"SUS-004","name":"Camber Plates",                "category":"Suspension", "brand":"Tein",       "price":3200, "stock":9, "compatible_models":["Universal"]},
    {"part_id":"SUS-005","name":"Strut Tower Bar",              "category":"Suspension", "brand":"Cusco",      "price":4500, "stock":7, "compatible_models":["Universal"]},

    # Brakes
    {"part_id":"BRK-001","name":"Big Brake Kit 6-Piston",       "category":"Brakes",     "brand":"Brembo",     "price":42000,"stock":2, "compatible_models":["GTR R35","Supra MK5"]},
    {"part_id":"BRK-002","name":"Brake Pads Racing",            "category":"Brakes",     "brand":"Endless",    "price":4800, "stock":15,"compatible_models":["Universal"]},
    {"part_id":"BRK-003","name":"Braided Brake Lines",          "category":"Brakes",     "brand":"Goodridge",  "price":2500, "stock":10,"compatible_models":["Universal"]},
    {"part_id":"BRK-004","name":"Brake Rotors Slotted x4",      "category":"Brakes",     "brand":"DBA",        "price":9600, "stock":4, "compatible_models":["Universal"]},

    # Electronics
    {"part_id":"ELC-001","name":"Standalone ECU Haltech",       "category":"Electronics","brand":"Haltech",    "price":65000,"stock":2, "compatible_models":["Universal"]},
    {"part_id":"ELC-002","name":"Wideband O2 Kit",              "category":"Electronics","brand":"AEM",        "price":6500, "stock":7, "compatible_models":["Universal"]},
    {"part_id":"ELC-003","name":"Boost Controller",             "category":"Electronics","brand":"Blitz",      "price":8500, "stock":4, "compatible_models":["Universal"]},
    {"part_id":"ELC-004","name":"Data Logger",                  "category":"Electronics","brand":"AiM",        "price":22000,"stock":3, "compatible_models":["Universal"]},

    # Exterior
    {"part_id":"EXT-001","name":"Front Lip Spoiler",            "category":"Exterior",   "brand":"Voltex",     "price":9500, "stock":5, "compatible_models":["Civic FK8"]},
    {"part_id":"EXT-002","name":"Carbon Fiber Hood",            "category":"Exterior",   "brand":"Seibon",     "price":35000,"stock":1, "compatible_models":["Supra MK5"]},
    {"part_id":"EXT-003","name":"Wide Body Kit",                "category":"Exterior",   "brand":"Rocket Bunny","price":120000,"stock":1,"compatible_models":["GTR R35"]},

    # Wheels & Tires
    {"part_id":"WHL-001","name":"Forged Wheels 18in x4",        "category":"Wheels",     "brand":"Volk Racing","price":88000,"stock":2, "compatible_models":["Universal"]},
    {"part_id":"WHL-002","name":"Semi-Slick Tire Set x4",       "category":"Wheels",     "brand":"Toyo",       "price":32000,"stock":4, "compatible_models":["Universal"]},
    {"part_id":"WHL-003","name":"Wheel Spacers 10mm x4",        "category":"Wheels",     "brand":"Eibach",     "price":2800, "stock":0, "compatible_models":["Universal"]},  # หมด stock!
]

def seed():
    col = get_parts_collection()
    deleted = col.delete_many({})
    print(f"Cleared {deleted.deleted_count} old records")
    result = col.insert_many(SAMPLE_PARTS)
    print(f"Inserted {len(result.inserted_ids)} parts")
    print("\nSummary by category:")
    for cat in col.aggregate([{"$group":{"_id":"$category","count":{"$sum":1},"low":{"$sum":{"$cond":[{"$lt":["$stock",5]},1,0]}}}}]):
        print(f"  {cat['_id']:15} {cat['count']} items  ({cat['low']} low/out)")

if __name__ == "__main__":
    seed()