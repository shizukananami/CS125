from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from ranking import rank_bathrooms

app = Flask(__name__)
CORS(app)
user_history = {}
with open('data/bathrooms.json') as f:
    bathrooms = json.load(f)

@app.route('/api/top-bathrooms', methods=['POST'])
def get_top_bathrooms():
    user_context = request.json
    top = rank_bathrooms(bathrooms, user_context, user_history)
    return jsonify(top)

@app.route('/api/record-visit', methods=['POST'])
def record_visit():
    data = request.json
    bathroom_id = data.get("bathroom_id")

    if bathroom_id:
        user_history[bathroom_id] = user_history.get(bathroom_id, 0) + 1

    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)