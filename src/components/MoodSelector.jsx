import React from 'react';
import PropTypes from 'prop-types';
import { Smile, Frown, Meh, Heart, Star, Cloud, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const moods = [
  { icon: Smile, label: 'Happy', color: 'text-yellow-400' },
  { icon: Heart, label: 'Romantic', color: 'text-pink-400' },
  { icon: Star, label: 'Energetic', color: 'text-purple-400' },
  { icon: Cloud, label: 'Relaxed', color: 'text-blue-400' },
  { icon: Meh, label: 'Neutral', color: 'text-gray-400' },
  { icon: Frown, label: 'Sad', color: 'text-indigo-400' },
  { icon: Sun, label: 'Peaceful', color: 'text-orange-400' },
];

function MoodSelector({ mood, setMood }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">How are you feeling?</h2>
      <div className="grid grid-cols-2 gap-4">
        {moods.map(({ icon: Icon, label, color }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMood(label)}
            className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
              mood === label
                ? 'bg-white/20 shadow-lg'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <Icon className={`w-6 h-6 ${color}`} />
            <span>{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

MoodSelector.propTypes = {
  mood: PropTypes.string.isRequired,
  setMood: PropTypes.func.isRequired,
};

export default MoodSelector;