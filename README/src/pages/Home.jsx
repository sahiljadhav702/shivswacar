import { Activity } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { Landmark } from 'lucide-react';
import { Wind } from 'lucide-react';
import { CarFront } from 'lucide-react';
import { Star } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceTabs from '../components/ServiceTabs';
import { ArrowRight, MapPin, Phone, Trophy, Map, Users } from 'lucide-react';

import { useState } from 'react';
import './Home.css';
import homeVideo from '../assets/home video.mp4';

const Home = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [showServiceTabs, setShowServiceTabs] = useState(false);

  const hyundaiStats = [
    { value: '26+', label: 'Years of Trust', icon: <Trophy size={32} /> },
    { value: '11+', label: 'Showrooms', icon: <Map size={32} /> },
    { value: '50k+', label: 'Happy Customers', icon: <Users size={32} /> },
    { value: '100%', label: 'Genuine Parts', icon: <ShieldCheck size={32} /> }
  ];

  const showroomLocations = [
    { city: 'KOLHAPUR', address: 'OLD PUNE-BANGLORE HIGHWAY, OPP. HOTEL OPEL KOLHAPUR', phone: '9921301600 / 8888007766' },
    { city: 'SANGLI', address: 'R. S. No. 292, Opposite Vasant Mangal karyalay Sangli-Kolhapur Road, Ankli, Sangli.', phone: '9168110505' },
    { city: 'TASGAON', address: 'Tasgaon-Sangli Road, Opposite Ajantha Petrol Pump, Wasumbe', phone: '77200 18301' },
    { city: 'KAVTHEMAHANKAL', address: 'Nagpur-Ratnagiri Highway, Borgaon', phone: '8010905157' },
    { city: 'ISLAMPUR', address: 'Peth-Islampur Road, Near Laxmi Narayan Hospital', phone: '9168112626' },
    { city: 'JAYSINGPUR', address: '149/2/2 Mahavir Auto Compound,Kolhapur - Sangli Hwy, Sambhajipur', phone: '7798886024' },
    { city: 'ICHALKARNJI', address: 'Gate No. 854, Ichalkaranji Road, Kabanur.', phone: '8805848585' },
    { city: 'RATNAGIRI', address: 'Mirjole M. I. D. C., Ratnagiri.', phone: '99229 49540' },
    { city: 'CHIPLUN', address: 'A-41 MIDC Kherdi Karad Chiplun Highway Opp SBI bank Kherdi', phone: '88888 12502' },
    { city: 'KUDAL', address: 'Kudal Udyamnagar, Mumbai-Goa Highway', phone: '8888812516' },
    { city: 'KANKAVALI', address: 'Vrikshavalli Nursery Compound, Vagde', phone: '7410006037' }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 20 }
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <video autoPlay loop muted playsInline className="hero-bg-video">
          <source src={homeVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <motion.div
            className="hero-text-block"
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
          </motion.div>

          <AnimatePresence mode="wait">
            {!showServiceTabs ? (
              <motion.button
                key="book-btn"
                className="book-service-btn"
                onClick={() => setShowServiceTabs(true)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Book My Service
              </motion.button>
            ) : (
              <motion.div
                key="service-tabs"
                className="hero-search-wrapper"
                initial={{ opacity: 0, y: 40, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, y: 0, height: 'auto', overflow: 'visible' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <ServiceTabs onRegNumberChange={setPlateNumber} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Showrooms Section */}
      <div className="showrooms-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title text-glow">Mai Hyundai All Showroom</h2>
          <p className="section-subtitle">Find your nearest Mai Hyundai authorized showroom and service center across Maharashtra.</p>
        </motion.div>

        <motion.div
          className="showrooms-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {showroomLocations.map((location, i) => (
            <motion.div key={i} variants={itemVariants} className="modern-showroom-card">
              <div className="modern-card-inner">
                <div className="modern-icon-box">
                  <MapPin size={22} className="modern-pin" />
                </div>
                <div className="modern-card-details">
                  <h3 className="modern-city">{location.city}</h3>
                  <p className="modern-address">{location.address}</p>
                  <div className="modern-contact">
                    <Phone size={14} className="modern-phone-icon" />
                    <span>{location.phone}</span>
                  </div>
                </div>
              </div>
              <div className="modern-card-glow"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="section-divider"></div>


      {/* Mai Hyundai Legacy Section */}
      <div className="legacy-section-wrapper">
        <div className="trust-stats-section dark-mode-stats">
          <motion.div
            className="section-header dark-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-glow-dark">The Mai Hyundai Legacy</h2>
            <p className="section-subtitle dark-subtitle">26 years of excellence, trust, and unmatched service across Maharashtra.</p>
          </motion.div>

          <motion.div
            className="stats-bento-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {hyundaiStats.map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants} className="bento-stat-card">
                <div className="bento-glow-bg"></div>
                <div className="bento-content">
                  <div className="bento-icon-wrapper">
                    {stat.icon}
                  </div>
                  <div className="bento-text-wrapper">
                    <div className="bento-value">{stat.value}</div>
                    <div className="bento-label">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Home;
