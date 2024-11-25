import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { motion } from 'framer-motion';
import { Camera, CameraOff } from 'lucide-react';

function MoodDetector({ onMoodDetected }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Failed to load face detection models. Please try again later.');
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    let interval;
    if (isEnabled && !loading && !error) {
      interval = setInterval(async () => {
        if (webcamRef.current) {
          const video = webcamRef.current.video;
          if (video) {
            try {
              const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

              if (detection) {
                const mood = Object.entries(detection.expressions).reduce((a, b) => 
                  a[1] > b[1] ? a : b
                )[0];
                onMoodDetected(mood);
              }
            } catch (err) {
              console.error('Error detecting mood:', err);
              setError('Failed to detect mood. Please check your camera and try again.');
              setIsEnabled(false);
            }
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEnabled, loading, error, onMoodDetected]);

  const handleToggleCamera = () => {
    if (error) {
      setLoading(true);
      setError(null);
      const loadModels = async () => {
        try {
          const MODEL_URL = '/models';
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
          ]);
          setLoading(false);
          setIsEnabled(true);
        } catch (err) {
          setError('Failed to load face detection models. Please try again later.');
          setLoading(false);
        }
      };
      loadModels();
    } else {
      setIsEnabled(!isEnabled);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Mood Detection</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleCamera}
          className={`p-2 rounded-full ${
            isEnabled ? 'bg-purple-500' : 'bg-gray-500'
          }`}
          disabled={loading}
        >
          {isEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {isEnabled && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Webcam
            ref={webcamRef}
            audio={false}
            className="w-full h-full object-cover"
            onUserMediaError={() => {
              setError('Failed to access camera. Please check your permissions.');
              setIsEnabled(false);
            }}
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
}

MoodDetector.propTypes = {
  onMoodDetected: PropTypes.func.isRequired,
};

export default MoodDetector;