from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from ranking import rank_bathrooms

app = Flask(__name__)
CORS(app)
with open('backend/data/bathrooms.json') as f:
    bathrooms = json.load(f)

@app.route('/api/top-bathrooms', methods=['POST'])
def get_top_bathrooms():
    user_context = request.json
    top = rank_bathrooms(bathrooms, user_context)
    return jsonify(top)

if __name__ == '__main__':
    app.run(debug=True)