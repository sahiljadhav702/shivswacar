import { Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceTabs.css';

const ServiceTabs = ({ onRegNumberChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('service');
  const [regNumber, setRegNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [savedCars, setSavedCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('myGarageCars'));
    if (stored && stored.length > 0) {
      setSavedCars(stored);
    } else {
      setSavedCars([]);
    }
  }, []);

  const tabs = [
    { id: 'service', label: 'Book Service', icon: <Settings size={18} /> },
  ];

  const formatRegNumber = (val) => {
    const clean = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    let formatted = '';
    if (clean.length > 0) formatted += clean.substring(0, 2);
    if (clean.length > 2) formatted += '-' + clean.substring(2, 4);
    if (clean.length > 4) formatted += '-' + clean.substring(4, 6);
    if (clean.length > 6) formatted += '-' + clean.substring(6, 10);
    return formatted;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab !== 'service') {
      setErrorMsg('Coming Soon!');
      return;
    }

    if (!regNumber.trim() || regNumber.length < 10) {
      setErrorMsg('Please enter a valid registration number.');
      return;
    }

    const parts = regNumber.split('-');
    if (parts.length === 4) {
      if (parts[1] === '00' || parts[3] === '0000') {
        setErrorMsg('00 and 0000 are not valid in registration numbers.');
        return;
      }
    }

    if (!mobileNumber.trim()) {
      setErrorMsg('Please enter your mobile number.');
      return;
    }
    if (mobileNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!/^[6789]/.test(mobileNumber)) {
      setErrorMsg('Mobile number must start with 6-9.');
      return;
    }

    setIsLoading(true);

    try {
      const cleanRegNumber = regNumber.replace(/-/g, "");

      const response = await fetch(
        `http://localhost:5000/api/vehicle/${cleanRegNumber}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const vehicle = data.data.rc_details;

      navigate("/car-details", {
        state: {
          regNumber,
          vehicleData: vehicle,
          insurance: data.data.insurance,
          puc: data.data.puc,
          challans: data.data.challans,
          mobileNumber: mobileNumber,
        },
      });

    } catch (err) {
      setErrorMsg("Vehicle not found.");
    } finally {
      setIsLoading(false);
    }
  }; // Close handleAction

  const handleGarageSelect = async (car) => {
    setIsLoading(true);
    try {
      const cleanRegNumber = car.reg.replace(/-/g, "");
      const response = await fetch(`http://localhost:5000/api/vehicle/${cleanRegNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const vehicle = data.data.rc_details;

      navigate("/car-details", {
        state: {
          regNumber: car.reg,
          vehicleData: vehicle,
          insurance: data.data.insurance,
          puc: data.data.puc,
          challans: data.data.challans,
          mobileNumber: mobileNumber || '9999999999', // Pass current mobile number or default
        },
      });
    } catch (err) {
      setErrorMsg("Vehicle not found from API, but continuing with saved details.");
      // Fallback if API fails: still go to car-details but with minimal data
      navigate('/car-details', {
        state: {
          regNumber: car.reg,
          mobileNumber: mobileNumber || '9999999999',
          vehicleData: {
            rc_maker_desc: car.make,
            rc_maker_model: car.model,
            rc_fuel_desc: 'Petrol'
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCar = (e, carId) => {
    e.stopPropagation();
    const updatedCars = savedCars.filter(c => c.id !== carId);
    setSavedCars(updatedCars);
    localStorage.setItem('myGarageCars', JSON.stringify(updatedCars));
  };

  const getButtonText = () => {
    if (isLoading) return 'Fetching details...';
    switch (activeTab) {
      case 'vehicle': return 'Search vehicle';
      case 'service': return 'Book car service';
      case 'car-insurance': return 'Get car quote';
      case 'bike-insurance': return 'Get bike quote';
      default: return 'Submit';
    }
  };

  // Framer Motion variants
  const contentVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  return (
    <div className="service-tabs-wrapper creative-tabs-wrapper">

      {/* Floating Pill Tabs */}
      <div className="creative-tabs-pill-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`creative-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id !== 'service' && tab.id !== 'my-garage') {
                setErrorMsg('Coming Soon!');
              } else {
                setErrorMsg('');
              }
            }}
            type="button"
          >
            {/* The sliding active background */}
            {activeTab === tab.id && (
              <motion.div
                className="creative-tab-active-bg"
                layoutId="activeTabPill"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="creative-tab-content">
              {tab.icon}
              <span className="creative-tab-label">{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Main Detached Content Container */}
      <div className="creative-content-container">
        <AnimatePresence mode="wait">
          {activeTab === 'service' && (
            <motion.form
              key="form"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onSubmit={handleAction}
              className="creative-form-content"
            >
              <div className="creative-inputs-row">

                {/* Registration Input */}
                <div className="creative-input-group">
                  <div className="creative-ind-plate">
                    <svg width="10" height="10" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#FBBF24" strokeWidth="3" />
                      <circle cx="12" cy="12" r="3" fill="#FBBF24" />
                    </svg>
                    <span>IND</span>
                  </div>
                  <div className="creative-input-divider" />
                  <div className="creative-input-block">
                    <label>Registration Number</label>
                    <input
                      type="text"
                      placeholder="MH-12-AB-1234"
                      value={regNumber}
                      onChange={(e) => {
                        const formatted = formatRegNumber(e.target.value);
                        setRegNumber(formatted);
                        if (onRegNumberChange) onRegNumberChange(formatted);
                        if (errorMsg) setErrorMsg('');
                      }}
                      maxLength={13}
                      required
                    />
                  </div>
                </div>

                {/* Mobile Input */}
                {activeTab !== 'vehicle' && (
                  <div className="creative-input-group">
                    <div className="creative-phone-icon">
                      <Phone size={20} />
                    </div>
                    <div className="creative-input-divider" />
                    <div className="creative-input-block">
                      <label>Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="1234567890"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value.replace(/\D/g, ''));
                          if (errorMsg) setErrorMsg('');
                        }}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <motion.button
                  type="submit"
                  className="creative-action-btn"
                  whileHover={{ scale: 1.02, backgroundColor: '#f1f5f9' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                  {getButtonText()}
                </motion.button>
              </div>

              {errorMsg && (
                <motion.div
                  className="creative-error-msg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errorMsg}
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceTabs;
