import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { motion } from 'framer-motion';
import { Camera, CameraOff } from 'lucide-react';

interface MoodDetectorProps {
  onMoodDetected: (mood: string) => void;
}

const MoodDetector: React.FC<MoodDetectorProps> = ({ onMoodDetected }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading face detection models:', error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    let interval: number;
    if (isEnabled && !loading) {
      interval = setInterval(async () => {
        if (webcamRef.current) {
          const video = webcamRef.current.video;
          if (video) {
            const detection = await faceapi
              .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceExpressions();

            if (detection) {
              const mood = Object.entries(detection.expressions).reduce((a, b) => 
                a[1] > b[1] ? a : b
              )[0];
              onMoodDetected(mood);
            }
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEnabled, loading, onMoodDetected]);

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Mood Detection</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEnabled(!isEnabled)}
          className={`p-2 rounded-full ${
            isEnabled ? 'bg-purple-500' : 'bg-gray-500'
          }`}
        >
          {isEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
        </motion.button>
      </div>

      {isEnabled && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Webcam
            ref={webcamRef}
            audio={false}
            className="w-full h-full object-cover"
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodDetector;