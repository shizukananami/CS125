import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import BathroomCard from '../components/BathroomCard';
import BathroomMapView from '../components/MapView';
import FilterModal from '../components/FilterModal';
import { getTopBathrooms } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [bathrooms, setBathrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [filterVisible, setFilterVisible] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [urgency, setUrgency] = useState('normal');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchBathrooms();
    }
  }, [userLocation, preferences, urgency]);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need location access to find nearby restrooms.');
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while getting your location.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBathrooms = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const currentTime = new Date().toTimeString().slice(0, 5); // HH:MM format
      const userContext = {
        preferences: preferences,
        time: currentTime,
        location: [userLocation.latitude, userLocation.longitude],
        urgency: urgency,
      };

      const data = await getTopBathrooms(userContext);
      setBathrooms(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bathrooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const handleApplyFilters = (filters) => {
    setPreferences(filters.preferences);
    setUrgency(filters.urgency);
  };

  const handleBathroomPress = (bathroom) => {
    navigation.navigate('BathroomDetail', { bathroom, userLocation });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Restroom Finder</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setFilterVisible(true)}
          >
            <Icon name="tune" size={24} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          >
            <Icon
              name={viewMode === 'list' ? 'map' : 'list'}
              size={24}
              color="#2196F3"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={fetchBathrooms}>
            <Icon name="refresh" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>

      {preferences.length > 0 && (
        <View style={styles.activeFilters}>
          <Text style={styles.filterText}>
            Active filters: {preferences.join(', ')}
          </Text>
          {urgency !== 'normal' && (
            <Text style={styles.urgencyText}>Urgency: {urgency}</Text>
          )}
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Finding best restrooms...</Text>
        </View>
      ) : viewMode === 'list' ? (
        <FlatList
          data={bathrooms}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <BathroomCard
              bathroom={item}
              distance={
                userLocation
                  ? calculateDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      item.location[0],
                      item.location[1]
                    )
                  : null
              }
              onPress={() => handleBathroomPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="search-off" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No restrooms found nearby</Text>
            </View>
          }
        />
      ) : (
        <BathroomMapView
          bathrooms={bathrooms}
          userLocation={userLocation}
          onMarkerPress={handleBathroomPress}
        />
      )}

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilters}
        currentPreferences={preferences}
      />
    </View>
  );
  //   return (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <Text>testing12345</Text>
  //   </View>
  // );
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
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  activeFilters: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  filterText: {
    fontSize: 14,
    color: '#1976D2',
    textTransform: 'capitalize',
  },
  urgencyText: {
    fontSize: 12,
    color: '#1976D2',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
});

export default HomeScreen;