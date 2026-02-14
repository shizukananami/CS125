from datetime import datetime
AMENITIES_SCORE = 3
CLEANLINESS_SCORE = 2
DISTANCE_SCORE_FACTOR = 100
MAX_DISTANCE_SCORE = 10
SAFETY_SCORE = 2
CROWD_SCORE = {
    'low': 3,
    'medium': 1,
    'high': 0
}

def simple_distance(lat1, lon1, lat2, lon2):
    # euclidean distance for simplicity
    return ((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) ** 0.5

def is_open(bathroom, current_time):
    oh = bathroom.get('opening_hours') or '00:00-23:59'
    try:
        start, end = str(oh).split('-')
    except Exception:
        # if opening hours aren't parsable, assume open
        return True
    return start <= current_time <= end

def rank_bathrooms(bathrooms, user_context, top_k=10):
    ranked = []
    user_lat, user_lng = user_context['location']
    current_time = datetime.now().strftime("%H:%M")
    for bathroom in bathrooms:
        score = 0

        if is_open(bathroom, current_time):
            score += 5

        # intersect amenities with user preferences
        score += len(set(bathroom.get('amenities', [])) & set(user_context.get('preferences', []))) * AMENITIES_SCORE

        ratings = bathroom.get('ratings') or {}
        score += ratings.get('cleanliness', 0.0) * CLEANLINESS_SCORE
        score += ratings.get('safety', 0.0) * SAFETY_SCORE
        crowd = bathroom.get('crowd_updates', 'medium').lower()
        score += CROWD_SCORE.get(crowd, 1)

        dist = simple_distance(
            user_lat, user_lng,
            bathroom['location'][0], bathroom['location'][1]
        )
        # reward closer bathrooms
        score += max(0, MAX_DISTANCE_SCORE - dist * DISTANCE_SCORE_FACTOR)

        ranked.append((bathroom, score))

    ranked.sort(key=lambda x: x[1], reverse=True)
    return [bathroom for bathroom, score in ranked[:top_k]]
