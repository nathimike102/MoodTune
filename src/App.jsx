import React, { useState } from 'react';
import { Music4 } from 'lucide-react';
import { motion } from 'framer-motion';
import MoodSelector from './components/MoodSelector';
import HeartRateInput from './components/HeartRateInput';
import PlaylistDisplay from './components/PlaylistDisplay';
import MoodDetector from './components/MoodDetector';
import MusicServiceSelector from './components/MusicServiceSelector';

function App() {
  const [mood, setMood] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [service, setService] = useState('spotify');

  const generatePlaylist = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/generate-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, heartRate, service }),
      });
      const data = await response.json();
      setPlaylist(data);
    } catch (error) {
      console.error('Error generating playlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music4 className="w-12 h-12 text-pink-400" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              MoodTune
            </h1>
          </div>
          <p className="text-xl text-gray-300">Personalized music for mental wellness</p>
        </header>

        <MusicServiceSelector service={service} setService={setService} />

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
          >
            <MoodSelector mood={mood} setMood={setMood} />
            <div className="mt-4">
              <MoodDetector onMoodDetected={setMood} />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
          >
            <HeartRateInput heartRate={heartRate} setHeartRate={setHeartRate} />
          </motion.div>
        </div>

        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePlaylist}
            className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 rounded-full font-semibold text-lg shadow-lg"
          >
            Generate Your Playlist
          </motion.button>
        </div>

        {playlist && <PlaylistDisplay playlist={playlist} />}
      </div>
    </div>
  );
}

export default App;