import argparse
import json
import os
import shutil
import time
import uuid
from datetime import datetime

import requests


REFUGE_API = "https://www.refugerestrooms.org/api/v1/restrooms"
REFUGE_BY_LOCATION = "https://www.refugerestrooms.org/api/v1/restrooms/by_location"
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "bathrooms.json")


def fetch_pages(per_page=50, max_pages=0):
    page = 1
    while True:
        params = {"page": page, "per_page": per_page}
        resp = requests.get(REFUGE_API, params=params, timeout=30)
        resp.raise_for_status()
        items = resp.json()
        if not items:
            break
        for it in items:
            yield it
        page += 1
        if max_pages and page > max_pages:
            break


def fetch_by_location(lat, lng, radius_km=10, per_page=50, max_pages=0, max_results=0):
    """Fetch restrooms near a lat/lng using the /by_location endpoint.

    The Refuge API accepts `lat` and `lng` and returns nearby restrooms. This
    helper paginates over results similar to fetch_pages but scoped to a point.
    """
    page = 1
    yielded = 0
    while True:
        params = {"lat": lat, "lng": lng, "per_page": per_page, "page": page}
        resp = requests.get(REFUGE_BY_LOCATION, params=params, timeout=30)
        resp.raise_for_status()
        items = resp.json()
        if not items:
            break
        for it in items:
            yield it
            yielded += 1
            if max_results and yielded >= max_results:
                return
        page += 1
        if max_pages and page > max_pages:
            break


def normalize_refuge_item(item):
    # Basic normalization to project schema
    name = (item.get("name") or "").strip()
    # latitude/longitude keys (Refuge API uses 'latitude' and 'longitude')
    lat = item.get("latitude")
    lon = item.get("longitude")
    try:
        lat = float(lat) if lat is not None and lat != "" else None
        lon = float(lon) if lon is not None and lon != "" else None
    except Exception:
        lat = lon = None

    location = [lat, lon] if lat is not None and lon is not None else None

    # Amenities: map known boolean flags from Refuge API into our tags
    amenities = []
    if item.get("accessible") or item.get("wheelchair"):
        amenities.append("wheelchair")
    if item.get("changing_table") or item.get("baby_changing"):
        amenities.append("baby_changing")
    # Refuge uses 'unisex' for gender-neutral restrooms; map to 'gender_neutral'
    if item.get("unisex"):
        amenities.append("gender_neutral")

    # Ratings: external may have overall rating; normalize to object
    # Ratings: Refuge exposes an overall `rating`; cleanliness/safety not provided
    overall = item.get("rating") or item.get("score")
    try:
        overall = float(overall) if overall is not None and overall != "" else 0.0
    except Exception:
        overall = 0.0

    # Use safe numeric defaults so downstream code won't break
    ratings = {"cleanliness": 0.0, "safety": 0.0, "overall": overall}

    # Default opening hours to always-open if missing to avoid parsing errors
    opening_hours = item.get("opening_hours") or item.get("hours") or "00:00-23:59"

    cleaned = {
        "id": str(uuid.uuid4()),
        "name": name,
        "amenities": amenities,
        "location": location,
        "ratings": ratings,
        "opening_hours": opening_hours,
        "crowd_updates": item.get("accessibility_notes") or item.get("notes") or "unknown",
        "source": {"name": "refugerestrooms", "external_id": item.get("id")},
        "fetched_at": datetime.utcnow().isoformat() + "Z",
    }

    return cleaned


def load_existing(path):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_with_backup(path, data):
    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    backup = f"{path}.bak.{ts}"
    shutil.copy2(path, backup)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(data)} entries to {path} (backup: {backup})")


def main(args):
    per_page = args.per_page
    max_pages = args.max_pages
    dry = args.dry_run

    data_file = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data", "bathrooms.json"))
    existing = load_existing(data_file)
    existing_names = { (e.get("name") or "").strip().lower(): e for e in existing }

    new_items = []
    count = 0
    if args.by_location:
        lat, lng = args.by_location
        print(f"Fetching from Refuge by_location around {lat},{lng}...")
        generator = fetch_by_location(lat=float(lat), lng=float(lng), radius_km=args.radius_km, per_page=per_page, max_pages=max_pages, max_results=args.max_results)
    else:
        print("Fetching pages from Refuge API...")
        generator = fetch_pages(per_page=per_page, max_pages=max_pages)

    for raw in generator:
        count += 1
        cleaned = normalize_refuge_item(raw)
        key = (cleaned.get("name") or "").strip().lower()
        if not key or not cleaned.get("location"):
            print(f"Skipping entry with missing name or location: {raw.get('id')}")
            continue
        if key in existing_names:
            # exact name dedupe: skip
            continue
        new_items.append(cleaned)

    print(f"Found {len(new_items)} new items (scanned {count} remote items).")
    if not new_items:
        return

    if dry:
        print("Dry run — would add the following items:")
        for it in new_items[:20]:
            print("-", it.get("name"), it.get("location"))
        return

    merged = existing + new_items
    save_with_backup(data_file, merged)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--per-page", type=int, default=50)
    parser.add_argument("--max-pages", type=int, default=0, help="0=unbounded until API returns empty page")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--by-location", nargs=2, metavar=("LAT","LNG"), help="Fetch using by_location endpoint: provide LAT LNG")
    parser.add_argument("--radius-km", type=float, default=10.0, help="Radius in km for by-location (informational)")
    parser.add_argument("--max-results", type=int, default=0, help="Stop after this many fetched results (0=unbounded)")
    args = parser.parse_args()
    main(args)
