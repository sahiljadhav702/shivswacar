import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import hyundaiLogo from '../assets/hyundai-logo.png';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // Speed of progress bar
      });
    }, 30);

    // After total time (approx 2.2s), trigger completion
    const timeout = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="splash-screen-container"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1, 
        filter: 'blur(10px)',
        transition: { duration: 0.6, ease: 'easeInOut' } 
      }}
    >
      {/* Background ambient glow */}
      <div className="splash-ambient-glow"></div>

      <div className="splash-content">
        <motion.div
          className="splash-logo-wrapper"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1], // Custom spring-like curve
            delay: 0.2 
          }}
        >
          <div className="splash-icon-box" style={{ background: 'transparent', boxShadow: 'none' }}>
            <img src={hyundaiLogo} alt="Hyundai Logo" style={{ height: '140px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </motion.div>

        <motion.div 
          className="splash-loading-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="splash-loader-wrapper">
            <div className="splash-loading-text">
              Initializing Engine... {progress}%
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
