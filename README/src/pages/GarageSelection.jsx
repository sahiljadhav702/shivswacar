import { Battery } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Search } from 'lucide-react';
import { Phone } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { Car } from 'lucide-react';
import { Edit } from 'lucide-react';

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './GarageSelection.css';
import hyundaiLogo from '../assets/hyundai-logo.png';

const garages = [
  { id: 'g1', city: 'KOLHAPUR', name: 'Mai Hyundai Kolhapur', address: 'OLD PUNE-BANGLORE HIGHWAY, OPP. HOTEL OPEL, KOLHAPUR', phone: '9921301600 / 8888007766' },
  { id: 'g2', city: 'SANGLI', name: 'Mai Hyundai Sangli', address: 'R. S. No. 292, Opposite Vasant Mangal karyalay Sangli-Kolhapur Road, Ankli, Sangli.', phone: '9168110505' },
  { id: 'g3', city: 'TASGAON', name: 'Mai Hyundai Tasgaon', address: 'Tasgaon-Sangli Road, Opposite Ajantha Petrol Pump, Wasumbe', phone: '77200 18301' },
  { id: 'g4', city: 'KAVTHEMAHANKAL', name: 'Mai Hyundai Kavthemahankal', address: 'Nagpur-Ratnagiri Highway, Borgaon', phone: '8010905157' },
  { id: 'g5', city: 'ISLAMPUR', name: 'Mai Hyundai Islampur', address: 'Peth-Islampur Road, Near Laxmi Narayan Hospital', phone: '9168112626' },
  { id: 'g6', city: 'JAYSINGPUR', name: 'Mai Hyundai Jaysingpur', address: '149/2/2 Mahavir Auto Compound, Kolhapur - Sangli Hwy, Sambhajipur', phone: '7798886024' },
  { id: 'g7', city: 'ICHALKARNJI', name: 'Mai Hyundai Ichalkarnji', address: 'Gate No. 854, Ichalkaranji Road, Kabanur.', phone: '8805848585' },
  { id: 'g8', city: 'RATNAGIRI', name: 'Mai Hyundai Ratnagiri', address: 'Mirjole M. I. D. C., Ratnagiri.', phone: '99229 49540' },
  { id: 'g9', city: 'CHIPLUN', name: 'Mai Hyundai Chiplun', address: 'A-41 MIDC Kherdi Karad Chiplun Highway Opp SBI bank Kherdi', phone: '' },
  { id: 'g10', city: 'KUDAL', name: 'Mai Hyundai Kudal', address: 'Kudal Udyamnagar, Mumbai-Goa Highway', phone: '' },
  { id: 'g11', city: 'KANKAVALI', name: 'Mai Hyundai Kankavali', address: 'Vikahavalli Nursery Compound, Vagde', phone: '' }
];


const features = [
  { icon: <Battery />, text: 'Genuine Hyundai Parts' },
  { icon: <Wrench />, text: 'Certified Battery Experts' },
  { icon: <MapPin />, text: 'Doorstep Installation' },
  { icon: <ShieldCheck />, text: 'Official Warranty' }
];

const trustPoints = [
  'Genuine Products', 'Official Warranty', 'Certified Technicians',
  'Fast Installation', 'Doorstep Support', 'Transparent Pricing',
  'Secure Booking', 'Trusted by Thousands'
];

const GarageSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      date: new Date(),
      timeSlot: '',
      garageId: ''
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve state from previous pages
  const vehicleState = location.state?.vehicle || {
    regNumber: 'MH-12-AB-1234',
    brand: 'HONDA',
    model: 'CITY',
    fuel: 'Petrol',
    batteryType: '12V 45Ah'
  };

  const pkgState = location.state?.package || {
    name: 'Standard Battery Service',
    price: 999
  };

  const selectedDate = watch('date');
  const selectedTime = watch('timeSlot');
  const selectedGarageId = watch('garageId');
  const selectedGarage = garages.find(g => g.id === selectedGarageId);

  const filteredGarages = garages.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data) => {
    navigate('/date-time-selection', {
      state: {
        vehicle: vehicleState,
        package: pkgState,
        garage: selectedGarage
      }
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="gs-container">

      <div className="gs-main">
        {/* Left Section (Hero) */}
        <div className="gs-left">
          <motion.div
            className="gs-logo-container"
            initial="hidden" animate="visible" variants={fadeInUp}
          >
            <img src={hyundaiLogo} alt="Hyundai Logo" className="gs-logo-icon" style={{ width: '120px', objectFit: 'contain' }} />
          </motion.div>

          <motion.h1
            className="gs-hero-title"
            initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.1 }}
          >
            Power Your Vehicle with Professional Battery Services
          </motion.h1>

          <motion.p
            className="gs-hero-subtitle"
            initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }}
          >
            Book genuine Hyundai parts replacement, battery health check, jump-start assistance, and doorstep installation by certified technicians. Fast, reliable, and hassle-free service at your preferred location.
          </motion.p>

          <motion.div
            className="gs-features-grid"
            initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.3 }}
          >
            {features.map((f, i) => (
              <div key={i} className="gs-feature-item">
                <div className="gs-feature-icon">{f.icon}</div>
                <div className="gs-feature-text">{f.text}</div>
              </div>
            ))}
          </motion.div>


        </div>

        {/* Right Section (Booking Form) */}
        <div className="gs-right">
          <div className="gs-booking-card">
            <div className="gs-header">
              <button className="gs-back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="gs-title">Find a Service Center Near You</h2>
              <p className="gs-subtitle">Choose your preferred garage and service date.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Garage Selection Section */}
              <div className="gs-garage-section">
                <h3 className="gs-section-heading">Select a Nearby Service Center</h3>

                <div className="gs-search-wrapper">
                  <Search className="gs-search-icon" size={20} />
                  <input
                    type="text"
                    className="gs-search-input"
                    placeholder="Search by City or Garage Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="gs-garages-list">
                  {filteredGarages.map(garage => (
                    <motion.div
                      key={garage.id}
                      className={`gs-garage-item ${selectedGarageId === garage.id ? 'selected' : ''}`}
                      onClick={() => setValue('garageId', garage.id, { shouldValidate: true })}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="premium-garage-header" style={{ backgroundImage: garage.image ? `url(${garage.image})` : undefined }}>
                        <div className="premium-city-badge">{garage.city}</div>
                        <div className="premium-garage-logo-area">
                          <img src={hyundaiLogo} alt="Hyundai" />
                        </div>
                      </div>
                      <div className="premium-garage-body">
                        <div className="premium-garage-title">{garage.name}</div>
                        <div className="premium-garage-subtitle">Authorized Service Center</div>
                        
                        <div className="premium-garage-detail">
                          <MapPin size={16} className="premium-garage-detail-icon" />
                          <div className="premium-garage-detail-text">{garage.address}</div>
                        </div>

                        {garage.phone && (
                          <div className="premium-garage-detail" style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                            <Phone size={16} className="premium-garage-detail-icon" />
                            <div className="premium-garage-detail-text" style={{ fontWeight: 700, color: '#0f172a' }}>{garage.phone}</div>
                          </div>
                        )}

                        <div className="premium-garage-footer">
                          <button type="button" className="premium-select-btn" onClick={(e) => { e.stopPropagation(); setValue('garageId', garage.id, { shouldValidate: true }); }}>
                            {selectedGarageId === garage.id ? (
                              <><CheckCircle2 size={18} /> Selected</>
                            ) : (
                              'Select Branch'
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {errors.garageId && <p className="gs-error-msg" style={{ textAlign: 'left', marginTop: '1rem' }}>Please select a branch from the list</p>}
              </div>


              {/* Vehicle Details Card */}
              <div className="gs-card">
                <div className="gs-vehicle-header">
                  <div className="gs-vehicle-info">
                    <div className="gs-vehicle-img">
                      <Car size={32} />
                    </div>
                    <div className="gs-vehicle-text">
                      <h3>{vehicleState.brand} {vehicleState.model}</h3>
                      <p>{vehicleState.regNumber}</p>
                    </div>
                  </div>
                  <button type="button" className="gs-edit-btn" onClick={() => navigate('/car-details')}>
                    <Edit size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Edit
                  </button>
                </div>

                <div className="gs-vehicle-grid">
                  <div className="gs-vehicle-detail-item">
                    <span>Fuel Type</span>
                    <strong>{vehicleState.fuel}</strong>
                  </div>
                  <div className="gs-vehicle-detail-item">
                    <span>Battery Type</span>
                    <strong>{vehicleState.batteryType}</strong>
                  </div>
                </div>
              </div>


              {/* Booking Summary */}
              {selectedGarageId && (
                <motion.div
                  className="gs-summary-card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <h3 className="gs-section-heading" style={{ marginBottom: '1.5rem' }}>Booking Summary</h3>

                  <div className="gs-summary-row">
                    <span className="gs-summary-label">Vehicle</span>
                    <span className="gs-summary-value">{vehicleState.brand} {vehicleState.model}</span>
                  </div>

                  <div className="gs-summary-row">
                    <span className="gs-summary-label">Service Type</span>
                    <span className="gs-summary-value">{pkgState.name}</span>
                  </div>

                  <div className="gs-summary-row">
                    <span className="gs-summary-label">Garage</span>
                    <span className="gs-summary-value">{selectedGarage.name}</span>
                  </div>


                  <div className="gs-summary-row">
                    <span className="gs-summary-label">Duration</span>
                    <span className="gs-summary-value">~45 Mins</span>
                  </div>

                  <div className="gs-summary-divider"></div>

                  <div className="gs-total-row">
                    <span>Estimated Cost</span>
                    <span>₹{pkgState.price}</span>
                  </div>
                </motion.div>
              )}

              {/* CTAs */}
              <button
                type="submit"
                className="gs-primary-btn"
              >
                Next
              </button>

              <a href="tel:9699938509" className="gs-secondary-btn gs-call-support-mobile" style={{ textDecoration: 'none' }}>
                <Phone size={18} /> Call Support
              </a>
            </form>

            {/* Mobile Trust Section */}
            <div className="gs-trust-section lg:hidden">
              <h3 className="gs-trust-title">Why Choose Hyundai?</h3>
              <div className="gs-trust-grid">
                {trustPoints.map((point, i) => (
                  <div key={i} className="gs-trust-item">
                    <CheckCircle2 size={16} /> {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageSelection;


