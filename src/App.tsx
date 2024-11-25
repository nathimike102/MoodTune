import React, { useState, useEffect } from 'react';
import { Heart, Music4, Brain, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import MoodSelector from './components/MoodSelector';
import HeartRateInput from './components/HeartRateInput';
import PlaylistDisplay from './components/PlaylistDisplay';
import MoodDetector from './components/MoodDetector';
import InsightsPanel from './components/InsightsPanel';
import type { MoodData, Playlist } from './types';

function App() {
  const [mood, setMood] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  const handleMoodDetected = (detectedMood: string) => {
    setMood(detectedMood);
    const newMoodData: MoodData = {
      timestamp: new Date(),
      mood: detectedMood,
      heartRate: parseInt(heartRate) || 75,
      energy: Math.random() * 100
    };
    setMoodHistory(prev => [...prev, newMoodData]);
  };

  const generatePlaylist = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, heartRate }),
      });
      const data = await response.json();
      setPlaylist(data);
    } catch (error) {
      console.error('Error generating playlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music4 className="w-12 h-12 text-pink-400" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              MoodTune
            </h1>
          </div>
          <p className="text-xl text-gray-300">Personalized music for mental wellness</p>
        </header>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">How are you feeling?</h2>
            </div>
            <MoodSelector mood={mood} setMood={setMood} />
            <div className="mt-4">
              <MoodDetector onMoodDetected={handleMoodDetected} />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-semibold">Your Heart Rate</h2>
            </div>
            <HeartRateInput heartRate={heartRate} setHeartRate={setHeartRate} />
          </motion.div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePlaylist}
            className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5" />
              Generate Your Playlist
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInsights(!showInsights)}
            className="bg-white/10 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              {showInsights ? 'Hide Insights' : 'Show Insights'}
            </div>
          </motion.button>
        </div>

        {showInsights && <InsightsPanel moodHistory={moodHistory} />}
        {playlist && <PlaylistDisplay playlist={playlist} />}
      </motion.div>
    </div>
  );
}

export default App;
