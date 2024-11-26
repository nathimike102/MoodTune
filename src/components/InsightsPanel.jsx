import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Activity, Brain, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function InsightsPanel({ moodHistory }) {
  const chartData = {
    labels: moodHistory.map(data => 
      new Date(data.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: 'Heart Rate',
        data: moodHistory.map(data => data.heartRate),
        borderColor: 'rgb(249, 168, 212)',
        tension: 0.4
      },
      {
        label: 'Energy Level',
        data: moodHistory.map(data => data.energy),
        borderColor: 'rgb(167, 139, 250)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    }
  };

  const calculateAverageHeartRate = () => {
    if (moodHistory.length === 0) return 'N/A';
    const average = Math.round(
      moodHistory.reduce((acc, curr) => acc + curr.heartRate, 0) / 
      moodHistory.length
    );
    return `${average} BPM`;
  };

  const getLatestMood = () => {
    if (moodHistory.length === 0) return 'N/A';
    return moodHistory[moodHistory.length - 1].mood;
  };

  const getLatestEnergy = () => {
    if (moodHistory.length === 0) return 'N/A';
    return `${Math.round(moodHistory[moodHistory.length - 1].energy)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-semibold">Your Wellness Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold">Average Heart Rate</h3>
          </div>
          <p className="text-2xl font-bold">{calculateAverageHeartRate()}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">Dominant Mood</h3>
          </div>
          <p className="text-2xl font-bold capitalize">{getLatestMood()}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Energy Level</h3>
          </div>
          <p className="text-2xl font-bold">{getLatestEnergy()}</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
}

InsightsPanel.propTypes = {
  moodHistory: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
      mood: PropTypes.string.isRequired,
      heartRate: PropTypes.number.isRequired,
      energy: PropTypes.number.isRequired
    })
  ).isRequired
};

export default InsightsPanel;