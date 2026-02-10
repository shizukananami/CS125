import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BathroomDetailScreen = ({ route, navigation }) => {
  const { bathroom, userLocation } = route.params;
  const [rating, setRating] = useState(0);

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${bathroom.location[0]},${bathroom.location[1]}`;
    Linking.openURL(url);
  };

  const submitRating = () => {
    if (rating === 0) {
      Alert.alert('Please select a rating first');
      return;
    }

    // TODO: Someone implement the rating submission to backend
    Alert.alert('Rating Submitted', 'Thank you for your feedback!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{bathroom.name}</Text>
      </View>

      <View style={styles.ratingSection}>
        <View style={styles.overallRating}>
          <Icon name="star" size={48} color="#FFD700" />
          <Text style={styles.overallRatingText}>
            {bathroom.ratings.overall.toFixed(1)}
          </Text>
        </View>
        <Text style={styles.ratingLabel}>Overall Rating</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Icon name="cleaning-services" size={20} color="#666" />
          <Text style={styles.detailText}>
            Cleanliness: {bathroom.ratings.cleanliness}/5
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="security" size={20} color="#666" />
          <Text style={styles.detailText}>
            Safety: {bathroom.ratings.safety}/5
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="schedule" size={20} color="#666" />
          <Text style={styles.detailText}>Hours: {bathroom.opening_hours}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="people" size={20} color="#666" />
          <Text style={styles.detailText}>
            Crowd Level: {bathroom.crowd_updates}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesGrid}>
          {bathroom.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityCard}>
              <Icon
                name={
                  amenity === 'wheelchair'
                    ? 'accessible'
                    : amenity === 'baby_changing'
                    ? 'child-care'
                    : 'wc'
                }
                size={32}
                color="#4CAF50"
              />
              <Text style={styles.amenityCardText}>
                {amenity.replace('_', ' ')}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rate This Restroom</Text>
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Icon
                name={star <= rating ? 'star' : 'star-border'}
                size={40}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
          <Text style={styles.submitButtonText}>Submit Rating</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.directionsButton} onPress={openDirections}>
        <Icon name="directions" size={24} color="white" />
        <Text style={styles.directionsButtonText}>Get Directions</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingSection: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overallRatingText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amenityCard: {
    width: '48%',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityCardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionsButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionsButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default BathroomDetailScreen;