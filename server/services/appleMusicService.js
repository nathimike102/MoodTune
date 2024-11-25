import axios from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const generateToken = () => {
  return jwt.sign({}, config.appleMusic.privateKey, {
    algorithm: 'ES256',
    expiresIn: '1h',
    issuer: config.appleMusic.teamId,
    header: {
      alg: 'ES256',
      kid: config.appleMusic.keyId
    }
  });
};

const api = axios.create({
  baseURL: 'https://api.music.apple.com/v1',
  headers: {
    'Authorization': `Bearer ${generateToken()}`
  }
});

export const appleMusicService = {
  async search(query) {
    const response = await api.get('/catalog/us/search', {
      params: {
        term: query,
        types: 'songs',
        limit: 10
      }
    });
    return response.data;
  },

  async getRecommendations(mood, tempo) {
    // Map moods to Apple Music genres and activity playlists
    const moodMappings = {
      Happy: 'pop',
      Sad: 'alternative',
      Energetic: 'workout',
      Relaxed: 'ambient',
      Romantic: 'r-b-soul',
      Peaceful: 'classical'
    };

    const genre = moodMappings[mood] || 'pop';
    
    const response = await api.get(`/catalog/us/playlists`, {
      params: {
        filter: { genre: genre },
        limit: 10
      }
    });
    return response.data;
  }
};