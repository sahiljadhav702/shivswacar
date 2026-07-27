import { Search } from 'lucide-react';
import { Activity } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { Landmark } from 'lucide-react';
import { Wind } from 'lucide-react';
import { CarFront } from 'lucide-react';
import { Star } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceTabs from '../components/ServiceTabs';
import { ArrowRight } from 'lucide-react';

import { useState } from 'react';
import './Home.css';
import homeVideo from '../assets/home video.mp4';

const Home = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [showServiceTabs, setShowServiceTabs] = useState(false);

  const processSteps = [
    { step: '01', title: 'Enter Vehicle Details', desc: 'Simply enter your car registration number to get started.', icon: <Search size={28} /> },
    { step: '02', title: 'Unlock Digital Garage', desc: 'Instantly access RTO details, Challans, and PUC status.', icon: <Activity size={28} /> },
    { step: '03', title: 'Book Premium Service', desc: 'Choose a service package and let our experts handle the rest.', icon: <CheckCircle2 size={28} /> }
  ];

  const premiumServices = [
    { name: 'Periodic Maintenance', desc: 'Comprehensive servicing to keep your engine purring perfectly.', icon: <Wrench size={32} /> },
    { name: 'RTO & Legal', desc: 'Clear pending challans and check registration details easily.', icon: <Landmark size={32} /> },
    { name: 'Detailing & Spa', desc: 'Premium ceramic coating and deep interior cleaning.', icon: <Wind size={32} /> },
    { name: 'Diagnostics', desc: 'Advanced OBD2 scanning and complete health reports.', icon: <Activity size={32} /> }
  ];

  const stats = [
    { value: '1M+', label: 'Vehicles Scanned', icon: <CarFront size={24} /> },
    { value: '50k+', label: 'Happy Customers', icon: <Star size={24} /> },
    { value: '100%', label: 'Genuine Spares', icon: <ShieldCheck size={24} /> }
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

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title text-glow">How It Works</h2>
          <p className="section-subtitle">Experience the future of car maintenance in three simple steps.</p>
        </motion.div>

        <motion.div
          className="steps-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {processSteps.map((item, idx) => (
            <motion.div key={idx} variants={itemVariants} className="step-card">
              <div className="step-number">{item.step}</div>
              <div className="step-icon-wrapper">
                {item.icon}
              </div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-desc">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="section-divider"></div>

      {/* Premium Services Grid */}
      <div className="services-overview-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title text-glow">Premium Services</h2>
          <p className="section-subtitle">From routine maintenance to advanced diagnostics, we've got you covered.</p>
        </motion.div>

        <motion.div
          className="premium-services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {premiumServices.map((service, i) => (
            <motion.div key={i} variants={itemVariants} className="service-highlight-card">
              <div className="service-card-glow"></div>
              <div className="service-icon-container">
                {service.icon}
              </div>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-detail">{service.desc}</p>
              <div className="service-explore">
                <span>Explore</span>
                <ArrowRight size={18} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="section-divider"></div>

      {/* Trust & Stats Section */}
      <div className="trust-stats-section">
        <motion.div
          className="stats-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="stat-box">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
};

export default Home;
