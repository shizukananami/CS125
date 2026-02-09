import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FilterModal = ({ visible, onClose, onApply, currentPreferences }) => {
  const [preferences, setPreferences] = useState(currentPreferences || []);
  const [urgency, setUrgency] = useState('normal');

  const amenities = [
    { id: 'wheelchair', label: 'Wheelchair Accessible', icon: 'accessible' },
    { id: 'baby_changing', label: 'Baby Changing', icon: 'child-care' },
    { id: 'gender_neutral', label: 'Gender Neutral', icon: 'wc' },
  ];

  const togglePreference = (amenity) => {
    if (preferences.includes(amenity)) {
      setPreferences(preferences.filter((p) => p !== amenity));
    } else {
      setPreferences([...preferences, amenity]);
    }
  };

  const handleApply = () => {
    onApply({ preferences, urgency });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Preferences</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.sectionTitle}>Amenities</Text>
            {amenities.map((amenity) => (
              <TouchableOpacity
                key={amenity.id}
                style={styles.amenityOption}
                onPress={() => togglePreference(amenity.id)}
              >
                <View style={styles.amenityLeft}>
                  <Icon name={amenity.icon} size={24} color="#666" />
                  <Text style={styles.amenityLabel}>{amenity.label}</Text>
                </View>
                <Switch
                  value={preferences.includes(amenity.id)}
                  onValueChange={() => togglePreference(amenity.id)}
                />
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Urgency Level</Text>
            {['low', 'normal', 'high'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.urgencyOption,
                  urgency === level && styles.urgencyOptionSelected,
                ]}
                onPress={() => setUrgency(level)}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === level && styles.urgencyTextSelected,
                  ]}
                >
                  {level.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  amenityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  amenityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  urgencyOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    alignItems: 'center',
  },
  urgencyOptionSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  urgencyTextSelected: {
    color: 'white',
  },
  applyButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilterModal;