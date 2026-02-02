# Bathroom Recommendation App

A mobile app that recommends bathrooms based on user preferences and context (location, time, crowd, amenities)

## Features
- Personalized ranking based on:
  - User preferences (amenities, accessibility)
  - Context signals (current location, time of day, crowd level)
  - Ratings (cleanliness, safety)

## Data Sources
- Crowd-sourced restroom ratings and reviews
- Cleanliness, safety, and amenity scores
- User-submitted photos
- GPS location and time-of-day data
- Restroom metadata (accessibility, baby-changing stations, gender-neutral options, operating hours)
- User interaction history and saved preferences
- Public map and facility datasets

## Matching & Ranking
- Restrooms rank higher if they:
  - Match user constraints and preferences
  - Are nearby (especially in urgent cases)
  - Have strong, recent crowd-sourced ratings
  - Reflect current availability and conditions
- Outdated or poorly rated facilities are deprioritized to maintain reliability.
