import { Plus } from 'lucide-react';
import { CarFront } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../components/ServiceTabs.css';

const MyGarage = () => {
  const navigate = useNavigate();
  const [savedCars, setSavedCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('myGarageCars'));
    if (stored && stored.length > 0) {
      setSavedCars(stored);
    } else {
      // Keep empty if no cars
      setSavedCars([]);
    }
  }, []);

  const handleGarageSelect = async (car) => {
    setIsLoading(true);
    try {
      const cleanRegNumber = car.reg.replace(/-/g, "");
      const response = await api.get(`/vehicle/${cleanRegNumber}`);
      const data = response.data;

      // Axios throws on !ok, handled in catch

      const vehicle = data.data.rc_details;

      navigate("/car-details", {
        state: {
          regNumber: car.reg,
          vehicleData: vehicle,
          insurance: data.data.insurance,
          puc: data.data.puc,
          challans: data.data.challans,
          mobileNumber: '9999999999',
        },
      });
    } catch (err) {
      setErrorMsg("Vehicle not found from API, but continuing with saved details.");
      navigate('/car-details', {
        state: {
          regNumber: car.reg,
          mobileNumber: '9999999999',
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

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="creative-garage-content" style={{ maxWidth: '1000px', minHeight: '60vh', margin: '2rem auto', padding: '2rem', background: '#ffffff', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div className="creative-garage-header" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>My Garage</h2>
          <button
            className="creative-add-car-btn"
            onClick={() => navigate('/')}
            type="button"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '50px' }}
          >
            <Plus size={18} /> Add New Vehicle
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '12px', marginBottom: '2rem' }}>
            {errorMsg}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading vehicle details...</p>
          </div>
        ) : savedCars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f1f5f9', borderRadius: '24px', border: '2px dashed #cbd5e1' }}>
            <CarFront size={64} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
            <h4 style={{ fontSize: '1.5rem', color: '#334155', marginBottom: '0.5rem' }}>Your garage is empty</h4>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add your vehicles to easily book services and check history.</p>
            <button
              className="creative-action-btn"
              onClick={() => navigate('/')}
              style={{ height: 'auto', padding: '1rem 2.5rem' }}
            >
              Add a Car Now
            </button>
          </div>
        ) : (
          <div className="premium-garage-grid" style={{ gap: '2rem' }}>
            {savedCars.map(car => (
              <motion.div
                key={car.id}
                className="premium-garage-card"
                onClick={() => handleGarageSelect(car)}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ width: '100%', maxWidth: '350px' }}
              >
                <button
                  className="premium-garage-remove-btn"
                  onClick={(e) => handleRemoveCar(e, car.id)}
                  title="Remove vehicle"
                  type="button"
                >
                  <Trash2 size={18} />
                </button>

                <div className="premium-garage-icon-wrapper" style={{ padding: '1.5rem' }}>
                  <CarFront size={48} className="premium-garage-icon" />
                </div>

                <div className="premium-garage-details" style={{ padding: '1.5rem' }}>
                  <div className="premium-garage-title-text" style={{ fontSize: '1.25rem' }}>
                    {car.make} <span className="font-light">{car.model}</span>
                  </div>

                  <div className="premium-digital-plate">
                    <div className="premium-ind-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="#FBBF24" strokeWidth="3" />
                        <circle cx="12" cy="12" r="3" fill="#FBBF24" />
                      </svg>
                      <span>IND</span>
                    </div>
                    <div className="premium-plate-number">{car.reg}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGarage;
