import React from 'react';
import PropTypes from 'prop-types';
import { Music, Play } from 'lucide-react';
import { motion } from 'framer-motion';

function PlaylistDisplay({ playlist }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Music className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-semibold">Your Personalized Playlist</h2>
        </div>
        <span className="text-sm text-gray-300">
          Total Duration: {playlist.totalDuration}
        </span>
      </div>

      <div className="space-y-4">
        {playlist.songs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10"
          >
            <div className="flex items-center gap-4">
              <img
                src={song.imageUrl}
                alt={song.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{song.title}</h3>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm px-3 py-1 rounded-full bg-white/5">
                {song.genre}
              </span>
              <span className="text-sm text-gray-400">{song.duration}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30"
              >
                <Play className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

PlaylistDisplay.propTypes = {
  playlist: PropTypes.shape({
    songs: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      genre: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
    })).isRequired,
    totalDuration: PropTypes.string.isRequired,
    averageBpm: PropTypes.number.isRequired,
  }).isRequired,
};

export default PlaylistDisplay;