import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api'; //Backend URL^^ add later... somebody
const API_BASE_URL = 'http://192.168.1.87:5000/api'; 
export const getTopBathrooms = async (userContext) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/top-bathrooms`, userContext);
    return response.data;
  } catch (error) {
    console.error('Error fetching bathrooms:', error);
    throw error;
  }
};

export const submitRating = async (bathroomId, rating) => {
  // Placeholder for future implementation
  try {
    const response = await axios.post(`${API_BASE_URL}/rate-bathroom`, {
      bathroomId,
      rating
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};