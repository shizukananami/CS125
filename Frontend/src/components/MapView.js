import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BathroomMapView = ({ bathrooms, userLocation, onMarkerPress }) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: userLocation?.latitude || 33.6846,
        longitude: userLocation?.longitude || -117.8265,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {bathrooms.map((bathroom, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: bathroom.location[0],
            longitude: bathroom.location[1],
          }}
          onPress={() => onMarkerPress(bathroom)}
        >
          <View style={styles.markerContainer}>
            <Icon name="wc" size={24} color="#2196F3" />
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
});

export default BathroomMapView;