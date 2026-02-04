AMENITIES_SCORE = 3
CLEANLINESS_SCORE = 2
DISTANCE_SCORE_FACTOR = 100
MAX_DISTANCE_SCORE = 10

def simple_distance(lat1, lon1, lat2, lon2):
    # euclidean distance for simplicity
    return ((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) ** 0.5

def is_open(bathroom, current_time):
    start, end = bathroom['opening_hours'].split('-')
    return start <= current_time <= end

def rank_bathrooms(bathrooms, user_context, top_k=10):
    ranked = []
    user_lat, user_lng = user_context['location']

    for bathroom in bathrooms:
        score = 0

        if is_open(bathroom, user_context['time']):
            score += 5

        # intersect amenities with user preferences
        score += len(set(bathroom['amenities']) & set(user_context['preferences'])) * AMENITIES_SCORE
        score += bathroom['ratings']['cleanliness'] * CLEANLINESS_SCORE

        dist = simple_distance(
            user_lat, user_lng,
            bathroom['location'][0], bathroom['location'][1]
        )
        # reward closer bathrooms
        score += max(0, MAX_DISTANCE_SCORE - dist * DISTANCE_SCORE_FACTOR)

        ranked.append((bathroom, score))

    ranked.sort(key=lambda x: x[1], reverse=True)
    return [bathroom for bathroom, score in ranked[:top_k]]
