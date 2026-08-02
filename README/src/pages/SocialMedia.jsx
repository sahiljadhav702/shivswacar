import { motion, AnimatePresence } from 'framer-motion';

import { useEffect } from 'react';
import './SocialMedia.css';

const SocialMedia = () => {
  useEffect(() => {
    // Check if the script is already loaded to avoid duplicates
    const scriptId = 'elfsight-platform-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="social-media-container">
      <motion.div 
        className="social-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Our Live Instagram</h1>
        <p>Real-time updates directly from our official Instagram account</p>
      </motion.div>
      
      <div className="social-content">
        <div className="real-instagram-grid">
          {/* Elfsight Widget Container */}
          <div className="elfsight-app-f76bf134-6f21-46f2-b5b4-f89dc4935afe" data-elfsight-app-lazy="true"></div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
