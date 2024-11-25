import express from 'express';
import cors from 'cors';
import { spotifyService } from './services/spotifyService.js';
import { appleMusicService } from './services/appleMusicService.js';
import { config } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Auth routes
app.get('/api/spotify/auth', (req, res) => {
  const scopes = ['user-read-private', 'playlist-modify-public'];
  res.json({
    url: spotifyApi.createAuthorizeURL(scopes)
  });
});

app.post('/api/spotify/callback', async (req, res) => {
  try {
    const { code } = req.body;
    const auth = await spotifyService.authorize(code);
    res.json(auth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Playlist generation routes
app.post('/api/generate-playlist', async (req, res) => {
  try {
    const { mood, heartRate, service = 'spotify' } = req.body;
    const hr = parseInt(heartRate);

    let recommendations;
    if (service === 'spotify') {
      recommendations = await spotifyService.getRecommendations(mood, hr);
    } else {
      recommendations = await appleMusicService.getRecommendations(mood, hr);
    }

    const songs = recommendations.tracks || recommendations.data;
    const totalDuration = songs.reduce((acc, song) => acc + song.duration_ms, 0);
    const minutes = Math.floor(totalDuration / 60000);
    const seconds = Math.floor((totalDuration % 60000) / 1000);

    res.json({
      songs: songs.map(song => ({
        id: song.id,
        title: song.name,
        artist: song.artists?.[0]?.name || song.artistName,
        duration: `${Math.floor(song.duration_ms / 60000)}:${String(Math.floor((song.duration_ms % 60000) / 1000)).padStart(2, '0')}`,
        genre: song.genres?.[0] || 'Pop',
        mood: mood,
        bpm: hr,
        imageUrl: song.album?.images[0]?.url || song.artworkUrl
      })),
      totalDuration: `${minutes}:${String(seconds).padStart(2, '0')}`,
      averageBpm: hr
    });
  } catch (error) {
    console.error('Error generating playlist:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});