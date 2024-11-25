import React from 'react';
import { Line } from 'react-chartjs-2';
import { Activity, Brain, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MoodData } from '../types';

interface InsightsPanelProps {
  moodHistory: MoodData[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ moodHistory }) => {
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
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
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
          <p className="text-2xl font-bold">
            {Math.round(
              moodHistory.reduce((acc, curr) => acc + curr.heartRate, 0) / 
              moodHistory.length
            )} BPM
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">Dominant Mood</h3>
          </div>
          <p className="text-2xl font-bold capitalize">
            {moodHistory.length > 0 ? 
              moodHistory[moodHistory.length - 1].mood : 'N/A'}
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Energy Level</h3>
          </div>
          <p className="text-2xl font-bold">
            {moodHistory.length > 0 ? 
              `${Math.round(moodHistory[moodHistory.length - 1].energy)}%` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};

export default InsightsPanel;