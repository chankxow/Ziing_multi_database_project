from flask import Flask, jsonify, request
from flask_cors import CORS

from db_mysql import query, execute
from db_mongo import parts_collection

app = Flask(__name__)
CORS(app)   # 🔥 สำคัญมากสำหรับ React

# =========================
# Root Test
# =========================
@app.route("/")
def home():
    return jsonify({"message": "Backend Running 🚀"})

# =========================
# Customers API (MySQL)
# =========================
@app.route("/customers", methods=["GET"])
def get_customers():
    data = query("SELECT * FROM Customer")
    return jsonify(data)

@app.route("/customers", methods=["POST"])
def add_customer():
    body = request.json

    sql = """
        INSERT INTO Customer (FirstName, LastName, Phone, Email)
        VALUES (%s, %s, %s, %s)
    """

    execute(sql, (
        body["FirstName"],
        body["LastName"],
        body["Phone"],
        body["Email"]
    ))

    return jsonify({"status": "added"})
    
# =========================
# Vehicles API (MySQL)
# =========================
@app.route("/vehicles", methods=["GET"])
def get_vehicles():
    data = query("SELECT * FROM Vehicle")
    return jsonify(data)

# =========================
# Parts API (MongoDB)
# =========================
@app.route("/parts", methods=["GET"])
def get_parts():
    parts = list(parts_collection.find({}, {"_id": 0}))
    return jsonify(parts)

@app.route("/parts", methods=["POST"])
def add_part():
    body = request.json
    parts_collection.insert_one(body)
    return jsonify({"status": "part added"})

# =========================
# Work Orders API (MySQL)
# =========================
@app.route("/workorders", methods=["GET"])
def get_workorders():
    data = query("SELECT * FROM WorkOrder")
    return jsonify(data)

# =========================
# Error Handling
# =========================
@app.errorhandler(Exception)
def handle_error(e):
    return jsonify({"error": str(e)}), 500

# =========================
# Run Server
# =========================
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
