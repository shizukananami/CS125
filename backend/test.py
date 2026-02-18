import os, json
from ranking import rank_bathrooms
import time

BASE_DIR = os.path.dirname(__file__)
with open(os.path.join(BASE_DIR, 'data', 'bathrooms.json')) as f:
    bathrooms = json.load(f)


# def run_example(example_name, user_context):
#     print(f"\n===== {example_name} =====")
#     print("User Context:", user_context)

#     start = time.time()
#     results = rank_bathrooms(bathrooms, user_context, [], 3)
#     latency = (time.time() - start) * 1000  # ms

#     print("\nTop Results:")
#     for i, b in enumerate(results, 1):
#         print(f"{i}. {b['name']} | Amenities: {b.get('amenities')}")

#     print(f"\nLatency: {latency:.2f} ms")
#     return results

# def precision_at_k(results, required_feature):
#     relevant = 0

#     for b in results:
#         if required_feature in b.get("amenities", []):
#             relevant += 1

#     return relevant / len(results) if results else 0

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


user_history = {"d02ad30d-30dd-47f8-b670-2abb2340da43" : 10}
context2 = {
    "time": "09:00",
    "location": [33.6846, -117.8200]
}
results3 = rank_bathrooms(bathrooms, context2, user_history, 3)
print("\nExample 3 - User History Preference")
for b in results3:
    print(b["name"])