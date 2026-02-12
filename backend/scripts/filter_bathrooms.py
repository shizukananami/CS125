import argparse
import json
import os
import shutil
from datetime import datetime


DATA_FILE = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data", "bathrooms.json"))


def in_bbox(lat, lon, bbox):
    if lat is None or lon is None:
        return False
    lat_min, lat_max, lon_min, lon_max = bbox
    return (lat_min <= lat <= lat_max) and (lon_min <= lon <= lon_max)


def load_data(path):
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
    # Default approximate bounding boxes
    # Irvine city approximate bbox
    irvine_bbox = args.irvine_bbox or (33.6400, 33.7450, -117.9200, -117.6900)
    # Orange County approximate bbox
    orange_bbox = args.orange_bbox or (33.4260, 33.9260, -118.0046, -117.4889)
    # Los Angeles County approximate bbox (broad)
    la_bbox = args.la_bbox or (33.7000, 34.9000, -118.9448, -117.6460)

    data = load_data(DATA_FILE)

    irvine = []
    other_la_orange = []
    removed = []

    for entry in data:
        loc = entry.get("location")
        lat = lon = None
        if isinstance(loc, (list, tuple)) and len(loc) >= 2:
            lat, lon = loc[0], loc[1]

        if in_bbox(lat, lon, irvine_bbox):
            irvine.append(entry)
            continue

        # if not in Irvine, check Orange or LA
        if in_bbox(lat, lon, orange_bbox) or in_bbox(lat, lon, la_bbox):
            other_la_orange.append(entry)
        else:
            removed.append(entry)

    # Apply caps
    irvine_cap = args.irvine_cap
    other_cap = args.other_cap
    irvine_keep = irvine[:irvine_cap] if irvine_cap and len(irvine) > irvine_cap else irvine
    other_keep = other_la_orange[:other_cap] if other_cap and len(other_la_orange) > other_cap else other_la_orange

    print(f"Total entries: {len(data)}")
    print(f"Irvine candidates: {len(irvine)}; will keep: {len(irvine_keep)}")
    print(f"LA/Orange candidates (outside Irvine): {len(other_la_orange)}; will keep: {len(other_keep)}")
    print(f"Entries outside LA/Orange (to be removed): {len(removed)}")

    if args.dry_run and not args.apply:
        print("Dry run — no changes written. Use --apply to write filtered file.")
        return

    # Merge kept lists (Irvine first, then others)
    merged = list(irvine_keep) + list(other_keep)
    save_with_backup(DATA_FILE, merged)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Write filtered file (creates backup)")
    parser.add_argument("--dry-run", action="store_true", default=True, help="Show counts only (default)")
    parser.add_argument("--irvine-cap", type=int, default=1000)
    parser.add_argument("--other-cap", type=int, default=1000)
    parser.add_argument("--irvine-bbox", nargs=4, type=float, metavar=("LAT_MIN","LAT_MAX","LON_MIN","LON_MAX"), help="Custom irvine bbox")
    parser.add_argument("--orange-bbox", nargs=4, type=float, metavar=("LAT_MIN","LAT_MAX","LON_MIN","LON_MAX"), help="Custom orange bbox")
    parser.add_argument("--la-bbox", nargs=4, type=float, metavar=("LAT_MIN","LAT_MAX","LON_MIN","LON_MAX"), help="Custom LA bbox")
    args = parser.parse_args()
    # If user passed --apply without --dry-run, respect apply; otherwise dry-run default
    if args.apply:
        args.dry_run = False
    main(args)
