import axios from 'axios';
import { BASE_URL } from '../utils/constants';

export const getMemes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/memes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching memes:', error);
    return [];
  }
};

export const generateMemeImage = async (prompt) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/generate-meme-image`, { prompt });
    return response.data;
  } catch (error) {
    console.error('Error generating meme image:', error);
    throw error;
  }
}; 