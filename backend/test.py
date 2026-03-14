import os, json
from ranking import rank_bathrooms, simple_distance
import time

BASE_DIR = os.path.dirname(__file__)
with open(os.path.join(BASE_DIR, 'data', 'bathrooms.json')) as f:
    bathrooms = json.load(f)


def run_example(example_name, user_context):
    print(f"\n===== {example_name} =====")
    print("User Context:", user_context)

    start = time.time()
    results = rank_bathrooms(bathrooms, user_context, [], 3)
    latency = (time.time() - start) * 1000  # ms

    print("\nTop Results:")
    for i, b in enumerate(results, 1):
        print(f"{i}. {b['name']} | Amenities: {b.get('amenities')}")

    print(f"\nLatency: {latency:.2f} ms")
    return results

def precision_at_k(results, required_feature):
    relevant = 0

    for b in results:
        if required_feature in b.get("amenities", []):
            relevant += 1

    return relevant / len(results) if results else 0

# context1 = {
#     "preferences": ["baby_changing"],
#     "time": "14:30",
#     "location": [33.6846, -117.8265]
# }

# results1 = run_example("Example 1 - Baby Changing Preference", context1)
# print("Precision@3:", precision_at_k(results1, "baby_changing"))

# context2 = {
#     "preferences": ["wheelchair"],
#     "time": "09:00",
#     "location": [33.6846, -117.8200]
# }

# results2 = run_example("Example 2 - Wheelchair Morning", context2)
# print("Precision@3:", precision_at_k(results2, "wheelchair"))


# user_history = {"d02ad30d-30dd-47f8-b670-2abb2340da43" : 10}
# context3 = {
#     "time": "09:00",
#     "location": [33.6846, -117.8200]
# }
# results3 = rank_bathrooms(bathrooms, context3, user_history, 3)
# print("\nExample 3 - User History Preference")
# for b in results3:
#     print(b["name"])

# example filters
filters = {
    "amenities": ["wheelchair"]
}
context4 = {
    "time": "09:00",
    "location": [33.6846, -117.8200]
}
user_lat, user_lng = context4["location"]
filtered_bathrooms = []
for bathroom in bathrooms:
    if 'amenities' in filters:
        required = set(filters['amenities'])
        if not required.issubset(set(bathroom.get('amenities', []))):
            continue
    filtered_bathrooms.append(bathroom)

results4 = rank_bathrooms(filtered_bathrooms, context4, user_history={})

print("filter example 1: Wheelchair Accessibility Filter")
for b in results4[:3]:
    dist = simple_distance(user_lat, user_lng, b["location"][0], b["location"][1])
    print(b["name"], "distance:", dist)
    print(b['name'], "-", b.get('amenities', []), "cleanliness: ", b.get('ratings', {}).get('cleanliness', 'N/A'), "safety: ", b.get('ratings', {}).get('safety', 'N/A'))
print("Precision@3:", precision_at_k(results4, "wheelchair"))

context5 = {
    "urgency": "high",
    "time": "12:00",
    "location": [33.6846, -117.8200]
}

results5 = rank_bathrooms(bathrooms, context5, user_history={})

print("Example 2: High Urgency Ranking")

user_lat, user_lng = context5["location"]

for b in results5[:3]:
    dist = simple_distance(user_lat, user_lng, b["location"][0], b["location"][1])
    print(b["name"], "distance:", dist)
    print(b['name'], "-", b.get('amenities', []), "cleanliness: ", b.get('ratings', {}).get('cleanliness', 'N/A'), "safety: ", b.get('ratings', {}).get('safety', 'N/A'))
