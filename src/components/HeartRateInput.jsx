import React from 'react';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

function HeartRateInput({ heartRate, setHeartRate }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Heart Rate</h2>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="Enter your heart rate (BPM)"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          >
            <Heart className="w-5 h-5 text-pink-400" />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {[60, 80, 100].map((rate) => (
            <motion.button
              key={rate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHeartRate(rate.toString())}
              className={`p-2 rounded-lg text-sm ${
                heartRate === rate.toString()
                  ? 'bg-white/20 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {rate} BPM
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

HeartRateInput.propTypes = {
  heartRate: PropTypes.string.isRequired,
  setHeartRate: PropTypes.func.isRequired,
};

export default HeartRateInput;