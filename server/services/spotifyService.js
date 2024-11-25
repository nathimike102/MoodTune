import SpotifyWebApi from 'spotify-web-api-node';
import { config } from '../config.js';

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri
});

export const spotifyService = {
  async authorize(code) {
    const data = await spotifyApi.authorizationCodeGrant(code);
    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    };
  },

  async getRecommendations(mood, tempo) {
    const moodFeatures = {
      Happy: { minValence: 0.7, targetEnergy: 0.8 },
      Sad: { maxValence: 0.3, targetEnergy: 0.3 },
      Energetic: { minEnergy: 0.8, targetTempo: tempo },
      Relaxed: { maxEnergy: 0.4, targetTempo: tempo },
      Romantic: { targetValence: 0.6, targetEnergy: 0.5 },
      Peaceful: { maxEnergy: 0.3, targetValence: 0.5 }
    };

    const features = moodFeatures[mood] || {};
    
    return spotifyApi.getRecommendations({
      limit: 10,
      seed_genres: ['pop', 'rock', 'indie', 'electronic'],
      target_tempo: tempo,
      ...features
    });
  },

  setAccessToken(token) {
    spotifyApi.setAccessToken(token);
  }
};