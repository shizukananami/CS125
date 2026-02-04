import os, json
from ranking import rank_bathrooms

BASE_DIR = os.path.dirname(__file__)
with open(os.path.join(BASE_DIR, 'data', 'bathrooms.json')) as f:
    bathrooms = json.load(f)

user_context = {
    "preferences": ["baby_changing"],
    "time": "14:30",
    "location": [33.6846, -117.8265]
}

top_bathrooms = rank_bathrooms(bathrooms, user_context)
print(top_bathrooms)