import { ArrowLeft } from 'lucide-react';
import { Car } from 'lucide-react';
import { Fuel } from 'lucide-react';

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import car images from assets
import blueHyundai from '../assets/blue_hyundai.png';
import redHyundai from '../assets/red_hyundai.png';
import greenHyundai from '../assets/green_hyundai.png';
import tucson from '../assets/hyundai_tucson_new.png';
import cretaImg from '../assets/hyundai_creta.png';
import grandI10Img from '../assets/hyundai_grand_i10.png';
import defaultCar from '../assets/car_front_view.png';
import './CarDetails.css';

const CarDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const vehicleData = location.state?.vehicleData || {};

  // Extract brand, model, fuel from vehicleData if present
  const apiBrand = vehicleData.rc_maker_desc ? vehicleData.rc_maker_desc.split(' ')[0] : 'HYUNDAI';
  const apiModel = vehicleData.rc_maker_model || 'Grand i10 Nios';
  const apiFuel = vehicleData.rc_fuel_desc || 'Petrol';
  const apiOwner = vehicleData.rc_owner_name || '';

  // Brand, Model, Fuel States
  const [selectedBrand, setSelectedBrand] = useState(apiBrand.toUpperCase());
  const [selectedModel, setSelectedModel] = useState(apiModel);
  const [selectedFuel, setSelectedFuel] = useState(apiFuel);
  const [ownerName, setOwnerName] = useState(apiOwner);
  const [mobileNumber, setMobileNumber] = useState(location.state?.mobileNumber || '');

  // Dropdown open states
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [fuelDropdownOpen, setFuelDropdownOpen] = useState(false);

  const carData = {
    HYUNDAI: [
      'CRETA', 'I20', 'VERNA', 'VENUE', 'ALCAZAR', 'TUCSON', 'AURA', 'EXTER',
      'Grand i10 Nios', 'IONIQ 5', 'KONA ELECTRIC', 'I20 N LINE', 'VENUE N LINE',
      'SANTRO', 'EON', 'XCENT', 'ELANTRA', 'ACCENT', 'GETZ', 'SONATA', 'SANTA FE'
    ].sort(),
  };

  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    if (carData[brand] && carData[brand].length > 0) {
      setSelectedModel(carData[brand][0]);
    }
    setBrandDropdownOpen(false);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setModelDropdownOpen(false);
  };

  const handleFuelSelect = (fuel) => {
    setSelectedFuel(fuel);
    setFuelDropdownOpen(false);
  };

  const handleNext = (e) => {
    e.preventDefault();
    navigate('/battery-service-selection', {
      state: {
        vehicleData: vehicleData,
        regNumber: location.state?.regNumber || vehicleData.rc_regn_no || '',
        brand: selectedBrand,
        model: selectedModel,
        fuel: selectedFuel,
        ownerName,
        mobileNumber
      }
    });
  };

  // Helper to dynamically select 2D image based on car model
  const getCarImage = (model) => {
    const modelName = model?.toLowerCase() || '';
    if (modelName.includes('creta')) return cretaImg;
    if (modelName.includes('grand i10')) return grandI10Img;
    if (modelName.includes('tucson')) return tucson;
    if (modelName.includes('venue')) return redHyundai;
    if (modelName.includes('i20')) return greenHyundai;

    // Default fallback image (generic Hyundai instead of Tesla)
    return blueHyundai;
  };

  return (
    <div className="car-details-page-wrapper">
      <div className="split-layout-container">
        <button
          type="button"
          className="back-nav-arrow-btn"
          onClick={() => navigate(-1)}
          title="Go Back"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Left Side: Inputs & Details selection form */}
        <div className="right-selection-pane">

          <div className="selection-card-container">


            <form onSubmit={handleNext} className="car-selection-form">
              {/* Brand Field (Fixed) */}
              <div className="dropdown-field-wrapper">
                <div className="selector-field-btn" style={{ cursor: 'default', opacity: 0.9 }}>
                  <Car size={18} className="field-left-icon" />
                  <span className="field-value-text">{selectedBrand}</span>
                </div>
              </div>

              {/* Model Field (Fixed) */}
              <div className="dropdown-field-wrapper">
                <div className="selector-field-btn" style={{ cursor: 'default', opacity: 0.9 }}>
                  <Car size={18} className="field-left-icon" />
                  <span className="field-value-text" style={{ textTransform: 'none' }}>{selectedModel}</span>
                </div>
              </div>

              {/* Fuel Field (Fixed) */}
              <div className="dropdown-field-wrapper">
                <div className="selector-field-btn" style={{ cursor: 'default', opacity: 0.9 }}>
                  <Fuel size={18} className="field-left-icon" />
                  <span className="field-value-text" style={{ textTransform: 'none' }}>{selectedFuel}</span>
                </div>
              </div>

              {/* Owner Name Input (Editable) */}
              <div className="dropdown-field-wrapper" style={{ marginBottom: '1.5rem' }}>
                <div className="selector-field-btn" style={{ opacity: 0.9 }}>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Owner Name"
                    style={{ width: '100%', paddingLeft: '1rem', textTransform: 'none', background: 'transparent', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Next Action Button */}
              <button type="submit" className="booking-next-btn">
                Next
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: 3D Model Marketing Pane */}
        <div className="left-marketing-pane">
          {/* Subtle gradient overlay to match aesthetic */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 30%, rgba(248,250,252,0.6) 100%)', pointerEvents: 'none', zIndex: 10 }}></div>

          <img
            src={getCarImage(selectedModel)}
            alt={`Car Model of ${selectedModel}`}
            style={{ width: '90%', height: 'auto', objectFit: 'contain', zIndex: 20, position: 'relative' }}
          />


        </div>

      </div>
    </div>
  );
};

export default CarDetails;
