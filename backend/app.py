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
    filters = user_context.get('filters', {}) 
    filtered = []
    for bathroom in bathrooms:
        if 'amenities' in filters:
            required = set(filters['amenities'])
            if not required.issubset(set(bathroom.get('amenities', []))):
                continue
        if 'crowd' in filters:
            if bathroom.get('crowd_updates', 'medium') != filters['crowd']:
                continue
        filtered.append(bathroom)
    top = rank_bathrooms(filtered, user_context, user_history)
    return jsonify(top)

@app.route('/api/record-visit', methods=['POST'])
def record_visit():
    data = request.json
    bathroom_id = data.get("bathroom_id")

    if bathroom_id:
        user_history[bathroom_id] = user_history.get(bathroom_id, 0) + 1

    return jsonify({"status": "ok"})

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host="0.0.0.0", port=5000, debug=True)