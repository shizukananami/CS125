import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BathroomCard = ({ bathroom, onPress, distance }) => {
  const getAmenityIcon = (amenity) => {
    const icons = {
      wheelchair: 'accessible',
      baby_changing: 'child-care',
      gender_neutral: 'wc',
    };
    return icons[amenity] || 'check';
  };

  const getCrowdColor = (crowd) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336',
    };
    return colors[crowd] || '#757575';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{bathroom.name}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{bathroom.ratings.overall.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Icon name="location-on" size={14} color="#666" />
        <Text style={styles.distance}>{distance || 'Calculating...'}</Text>
        <View style={[styles.crowdBadge, { backgroundColor: getCrowdColor(bathroom.crowd_updates) }]}>
          <Text style={styles.crowdText}>{bathroom.crowd_updates}</Text>
        </View>
      </View>

      <View style={styles.amenitiesRow}>
        {bathroom.amenities.map((amenity, index) => (
          <View key={index} style={styles.amenityBadge}>
            <Icon name={getAmenityIcon(amenity)} size={16} color="#4CAF50" />
            <Text style={styles.amenityText}>{amenity.replace('_', ' ')}</Text>
          </View>
        ))}
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Icon name="cleaning-services" size={14} color="#666" />
          <Text style={styles.detailText}>Cleanliness: {bathroom.ratings.cleanliness}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="security" size={14} color="#666" />
          <Text style={styles.detailText}>Safety: {bathroom.ratings.safety}</Text>
        </View>
      </View>

      <Text style={styles.hours}>Hours: {bathroom.opening_hours}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 12,
  },
  crowdBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  crowdText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  amenityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  hours: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default BathroomCard;