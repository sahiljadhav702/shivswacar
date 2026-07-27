import { Landmark } from 'lucide-react';
import { Building2 } from 'lucide-react';
import { Building } from 'lucide-react';
import { Castle } from 'lucide-react';
import { Tent } from 'lucide-react';
import { Hotel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

import './CityCoverageSection.css';
import indiaMap from '../assets/india_map.svg';

const CityCoverageSection = () => {
  const cities = [
    { name: 'Delhi NCR', icon: <Landmark size={32} /> },
    { name: 'Bangalore', icon: <Building2 size={32} /> },
    { name: 'Pune', icon: <Building size={32} /> },
    { name: 'Hyderabad', icon: <Castle size={32} /> },
    { name: 'Lucknow', icon: <Tent size={32} /> }, // Tent looks a bit like architectural dome
    { name: 'Chennai', icon: <Hotel size={32} /> }
  ];

  // Coordinates for placing map pins (percentages relative to the map container)
  const mapPins = [
    { id: 'delhi', top: '25%', left: '33%', name: 'Delhi' },
    { id: 'lucknow', top: '35%', left: '42%', name: 'Lucknow' },
    { id: 'pune', top: '55%', left: '26%', name: 'Pune' },
    { id: 'hyderabad', top: '58%', left: '36%', name: 'Hyderabad' },
    { id: 'bangalore', top: '70%', left: '33%', name: 'Bangalore' },
    { id: 'chennai', top: '68%', left: '42%', name: 'Chennai' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="coverage-section">
      <div className="coverage-container">
        
        {/* Left Content - Typography & City Grid */}
        <div className="coverage-left">
          <motion.div 
            className="coverage-text-block"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="coverage-title">
              Now serving 185+ cities<br />across India
            </h2>
            <p className="coverage-subtitle">
              Wherever you are, reliable car service is always within reach with Hyundai.
            </p>
          </motion.div>

          <motion.div 
            className="city-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {cities.map((city, idx) => (
              <motion.div key={idx} variants={itemVariants} className="city-card">
                <div className="city-icon-wrapper">
                  {city.icon}
                </div>
                <span className="city-name">{city.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Content - Holographic Map */}
        <div className="coverage-right">
          <motion.div 
            className="map-container"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* The SVG Map Layer */}
            <div className="india-map-wrapper">
              <img 
                src={indiaMap} 
                alt="India Map" 
                className="india-map-image" 
              />
              
              {/* Map Pins */}
              {mapPins.map((pin) => (
                <div 
                  key={pin.id} 
                  className="map-pin" 
                  style={{ top: pin.top, left: pin.left }}
                  title={pin.name}
                >
                  <div className="pin-pulse"></div>
                  <MapPin size={16} className="pin-icon" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default CityCoverageSection;
