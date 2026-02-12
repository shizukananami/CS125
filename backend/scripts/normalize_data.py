#!/usr/bin/env python3
import json
import os
import shutil
from datetime import datetime


DATA_FILE = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data", "bathrooms.json"))


def is_number(x):
    try:
        float(x)
        return True
    except Exception:
        return False


def normalize_entry(e):
    updated = False

    # id
    if not e.get("id"):
        e["id"] = str(datetime.utcnow().timestamp()).replace('.', '')
        updated = True

    # name
    name = (e.get("name") or "").strip()
    if name != e.get("name"):
        e["name"] = name
        updated = True

    # amenities
    amenities = e.get("amenities")
    if not isinstance(amenities, list):
        e["amenities"] = []
        updated = True

    # location: must be [lat, lon] numbers
    loc = e.get("location")
    valid_loc = False
    if isinstance(loc, (list, tuple)) and len(loc) >= 2 and is_number(loc[0]) and is_number(loc[1]):
        # coerce to floats
        lat = float(loc[0])
        lon = float(loc[1])
        e["location"] = [lat, lon]
        valid_loc = True
    else:
        # invalid location: remove entry by signalling None
        return None, True

    # ratings
    ratings = e.get("ratings") or {}
    cleanliness = ratings.get("cleanliness")
    safety = ratings.get("safety")
    overall = ratings.get("overall")
    try:
        cleanliness = float(cleanliness) if cleanliness is not None and is_number(cleanliness) else 0.0
    except Exception:
        cleanliness = 0.0
    try:
        safety = float(safety) if safety is not None and is_number(safety) else 0.0
    except Exception:
        safety = 0.0
    try:
        overall = float(overall) if overall is not None and is_number(overall) else 0.0
    except Exception:
        overall = 0.0
    new_ratings = {"cleanliness": cleanliness, "safety": safety, "overall": overall}
    if new_ratings != ratings:
        e["ratings"] = new_ratings
        updated = True

    # opening_hours
    oh = e.get("opening_hours")
    if not isinstance(oh, str) or '-' not in (oh or ''):
        e["opening_hours"] = "00:00-23:59"
        updated = True

    # crowd_updates
    if not e.get("crowd_updates"):
        e["crowd_updates"] = "unknown"
        updated = True

    # source
    if not isinstance(e.get("source"), dict):
        e["source"] = {"name": "unknown"}
        updated = True

    # fetched_at
    if not e.get("fetched_at"):
        e["fetched_at"] = datetime.utcnow().isoformat() + "Z"
        updated = True

    return e, updated


def main():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    new_data = []
    skipped = 0
    changed = 0
    for entry in data:
        normalized, did_change = normalize_entry(entry)
        if normalized is None:
            skipped += 1
            continue
        new_data.append(normalized)
        if did_change:
            changed += 1

    # write backup
    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    backup = f"{DATA_FILE}.bak.normalize.{ts}"
    shutil.copy2(DATA_FILE, backup)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)

    print(f"Normalized {len(new_data)} entries; changed: {changed}; skipped (no loc): {skipped}; backup: {backup}")


if __name__ == '__main__':
    main()
