from flask import Flask, request, jsonify
import json
from ranking import rank_bathrooms

app = Flask(__name__)

with open('data/bathrooms.json') as f:
    bathrooms = json.load(f)

@app.route('/top-bathrooms', methods=['POST'])
def get_top_bathrooms():
    user_context = request.json
    top = rank_bathrooms(bathrooms, user_context)
    return jsonify(top)

if __name__ == '__main__':
    app.run(debug=True)