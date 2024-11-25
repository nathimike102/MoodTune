import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Music, Radio } from 'lucide-react';

function MusicServiceSelector({ service, setService }) {
  const services = [
    { id: 'spotify', name: 'Spotify', icon: Music },
    { id: 'apple', name: 'Apple Music', icon: Radio }
  ];

  return (
    <div className="flex gap-4 justify-center mb-8">
      {services.map(({ id, name, icon: Icon }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setService(id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
            service === id
              ? 'bg-white/20 shadow-lg'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span>{name}</span>
        </motion.button>
      ))}
    </div>
  );
}

MusicServiceSelector.propTypes = {
  service: PropTypes.string.isRequired,
  setService: PropTypes.func.isRequired
};

export default MusicServiceSelector;