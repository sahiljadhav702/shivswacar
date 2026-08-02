import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Edit2 } from 'lucide-react';
import { Star } from 'lucide-react';

import { useState, useRef, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import './DateTimeSelection.css';
import garagePlaceholder from '../assets/car_background.png';

const timeSlots = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM'
];

const generateDates = (numDays) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < numDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const DateTimeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const datesList = generateDates(14); // Next 14 days
  
  const [selectedDate, setSelectedDate] = useState(datesList[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [pickupDrop, setPickupDrop] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    api.get('/bookings/slots')
      .then(res => res)
      .then(res => { const data = res.data;
        if(data.success) setBookedSlots(data.data);
      })
      .catch(console.error);
  }, []);

  // Retrieve state from previous pages
  const vehicleState = location.state?.vehicle || location.state?.vehicleData || {
    brand: 'HYUNDAI',
    model: 'CRETA',
    ownerName: 'Guest User',
    mobileNumber: '9999999999',
    regNumber: 'MH-10-DY-0049'
  };
  
  // Try to use brand/model from location.state direct if vehicle object is not present
  if (!location.state?.vehicle && location.state?.brand) {
     vehicleState.brand = location.state.brand;
     vehicleState.model = location.state.model;
     vehicleState.ownerName = location.state.ownerName;
     vehicleState.mobileNumber = location.state.mobileNumber;
     vehicleState.regNumber = location.state.regNumber;
  }

  const pkgState = location.state?.package || {
    name: 'Basic',
    price: 5311
  };

  const garageState = location.state?.garage || {
    name: 'PB Wheels - Kitara Garages',
    address: 'Gurgaon',
    rating: '4',
    ratingText: 'Very Good'
  };

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short' });
  };

  const getFullDateString = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getDayTotalSlots = (dateObj) => {
    if (!dateObj) return 0;
    const dateStr = dateObj.toISOString().split('T')[0];
    let totalBooked = 0;
    bookedSlots.forEach(s => {
      if(s.bookingDate === dateStr) totalBooked += s.count;
    });
    return Math.max(0, 24 - totalBooked);
  };

  const getBookedCount = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 0;
    const record = bookedSlots.find(s => {
      return s.bookingDate === dateStr && s.bookingTime === timeStr;
    });
    return record ? record.count : 0;
  };

  const onSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setSubmitError('Please select both a date and a time slot.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const dateFormatted = selectedDate.toLocaleDateString('en-GB');
    const dateYMD = selectedDate.toISOString().split('T')[0];
    
    // Convert time "10:00 AM - 11:00 AM" to "10:00:00"
    const startTimeStr = selectedTime.split(' - ')[0]; 
    const timeMapping = {
      '09:00 AM': '09:00:00', '10:00 AM': '10:00:00', '11:00 AM': '11:00:00', '12:00 PM': '12:00:00',
      '01:00 PM': '13:00:00', '02:00 PM': '14:00:00', '03:00 PM': '15:00:00', '04:00 PM': '16:00:00',
      '05:00 PM': '17:00:00'
    };
    const timeVal = timeMapping[startTimeStr] || '10:00:00';

    const regNo = vehicleState.regNumber || 'N/A';
    const ownerName = vehicleState.ownerName || 'Guest User';
    const mobileNumber = vehicleState.mobileNumber || '9999999999';
    const brand = vehicleState.brand || 'Hyundai';
    const model = vehicleState.model || '';

    try {
      // 1. Create or Get Customer (This also creates the vehicle in the current Railway backend)
      const customerRes = await api.post('/customers', {
        name: ownerName,
        email: '',
        phone: mobileNumber,
        car_number: regNo,
        car_brand: brand,
        car_model: model
      });
      const customerId = customerRes.data.id;

      let vehicleId = null;
      try {
        // 2. Try to Create or Get Vehicle directly
        const vehicleRes = await api.post('/vehicles', {
          customerId,
          vehicleNumber: regNo,
          brand,
          model,
          year: 2022,
          fuelType: vehicleState.fuel || 'Petrol'
        });
        vehicleId = vehicleRes.data.id;
      } catch (vehicleErr) {
        // Fallback: If /vehicles fails due to backend fuelType bug, fetch the vehicle that was just created by /customers
        const allVehiclesRes = await api.get('/vehicles');
        const foundVehicle = allVehiclesRes.data.find(v => v.number === regNo);
        if (foundVehicle) {
          vehicleId = foundVehicle.id;
        }
      }

      // 3. Create Booking
      await api.post('/bookings', {
        customerId,
        vehicleId,
        booking_date: dateYMD,
        booking_time: timeVal,
        complaints: pkgState.name,
        totalAmount: pkgState.price
      });

      const rawMessage = `Hello PB Wheels!\n\nI would like to confirm my booking:\n🚗 *Vehicle*: ${brand} ${model} (${regNo})\n👤 *Name*: ${ownerName}\n📞 *Phone*: ${mobileNumber}\n🛠️ *Service*: ${pkgState.name}\n🏢 *Garage*: ${garageState.name}\n📅 *Date & Time*: ${dateFormatted} at ${selectedTime}\n🚕 *Pickup/Drop*: ${pickupDrop ? 'Yes' : 'No'}\n💰 *Estimated Price*: ₹${pkgState.price.toLocaleString()}\n\nPlease confirm my appointment!`;
      
      window.open(`https://wa.me/919699938509?text=${encodeURIComponent(rawMessage)}`, '_blank');
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dt-container-dark">
      <AnimatePresence>
        {isSuccess && (
          <motion.div className="dt-success-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="dt-success-card-dark" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="dt-success-icon"><CheckCircle2 size={40} /></div>
              <h2>Booking Confirmed!</h2>
              <p>Your appointment at {garageState.name} is confirmed for {selectedDate?.toLocaleDateString('en-GB')} at {selectedTime}.</p>
              <button className="dt-btn-schedule" onClick={() => navigate('/')}>Back to Home</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dt-grid-layout">
        {/* Left Side */}
        <div className="dt-left-pane">
          {/* Header */}
          <div className="dt-header-dark">
            <button className="dt-back-btn-dark" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div className="dt-header-text">
              <h2 className="dt-title-dark">Book service slot</h2>
              <p className="dt-subtitle-dark">Choose preferred date & time</p>
            </div>
          </div>

          <div className="dt-carousel-wrapper">
            <button className="dt-carousel-nav left" onClick={() => handleScroll('left')}>
              <ChevronLeft size={16} />
            </button>
            <div className="dt-date-carousel" ref={carouselRef}>
              {datesList.map((d, index) => {
                const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                const isSunday = d.getDay() === 0;
                const slotsLeft = isSunday ? 'Closed' : `${getDayTotalSlots(d)} Slots`;
                
                return (
                  <div 
                    key={index} 
                    className={`dt-date-card ${isSelected ? 'active' : ''} ${isSunday ? 'closed' : ''}`}
                    onClick={() => !isSunday && setSelectedDate(d)}
                  >
                    <span className="day">{getDayName(d)}</span>
                    <span className="date">{d.getDate()}</span>
                    <span className="slots">{slotsLeft}</span>
                  </div>
                );
              })}
            </div>
            <button className="dt-carousel-nav right" onClick={() => handleScroll('right')}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="dt-selected-date-header">
            <h3>{selectedDate ? getFullDateString(selectedDate) : 'Select a Date'}</h3>
            <p>Available Slots</p>
          </div>

          <div className="dt-time-grid">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
              const startTimeStr = time.split(' - ')[0]; 
              const timeMapping = {
                '09:00 AM': '09:00:00', '10:00 AM': '10:00:00', '11:00 AM': '11:00:00', '12:00 PM': '12:00:00',
                '01:00 PM': '13:00:00', '02:00 PM': '14:00:00', '03:00 PM': '15:00:00', '04:00 PM': '16:00:00',
                '05:00 PM': '17:00:00'
              };
              const timeVal = timeMapping[startTimeStr] || '10:00:00';
              const booked = getBookedCount(dateStr, timeVal);
              const slots = Math.max(0, 3 - booked);
              const isSoldOut = slots === 0;

              return (
                <div 
                  key={time} 
                  className={`dt-time-card ${isSelected ? 'active' : ''} ${isSoldOut ? 'sold-out' : ''}`}
                  onClick={() => !isSoldOut && setSelectedTime(time)}
                  style={{ opacity: isSoldOut ? 0.5 : 1, cursor: isSoldOut ? 'not-allowed' : 'pointer' }}
                >
                  <span className="time">{time}</span>
                  <span className="slots-left" style={{ color: isSoldOut ? 'red' : 'inherit' }}>
                    {isSoldOut ? 'Sold Out' : <><span className="dot"></span> {slots} Slots Left</>}
                  </span>
                </div>
              );
            })}
          </div>
          {submitError && <div className="dt-error-text">{submitError}</div>}
        </div>

        {/* Right Side */}
        <div className="dt-right-pane">
          {/* Car Details */}
          <div className="dt-sidebar-card">
            <div className="dt-sidebar-header">
              <h3>Car Details</h3>
              <Edit2 size={16} className="edit-icon" onClick={() => navigate('/car-details', { state: location.state })} />
            </div>
            <div className="dt-car-info">
              <div className="text-info">
                <h4><span className="brand-dot"></span> {vehicleState.model}</h4>
                <p>2022 &bull; {vehicleState.fuel || 'PETROL'}</p>
                <div className="license-plate">
                  <span className="ind">IND</span> {vehicleState.regNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="dt-sidebar-card">
            <div className="dt-sidebar-header">
              <h3>Service Details</h3>
              <Edit2 size={16} className="edit-icon" onClick={() => navigate('/battery-service-selection', { state: location.state })} />
            </div>
            <div className="dt-service-info">
              <div className="row">
                <span className="service-desc-text">Service Interval: 1 Year / 10000 Km ({pkgState.name})</span>
              </div>
              <div className="row total">
                <div>
                  <span className="total-label">Total</span>
                  <span className="tax-label">Incl. taxes & fees</span>
                </div>
                <span className="total-price">₹ {pkgState.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Garage Details */}
          <div className="dt-sidebar-card">
            <div className="dt-sidebar-header">
              <h3>Garage Details</h3>
              <Edit2 size={16} className="edit-icon" onClick={() => navigate('/garage-selection', { state: location.state })} />
            </div>
            <div className="dt-garage-info">
              <img src={garagePlaceholder} alt="Garage" className="garage-img" />
              <div className="garage-text">
                <h4>{garageState.name}</h4>
                <p><span className="pin"></span> {garageState.address}</p>
                <div className="rating">
                  <Star size={12} fill="#fbbf24" stroke="none" />
                  <Star size={12} fill="#fbbf24" stroke="none" />
                  <Star size={12} fill="#fbbf24" stroke="none" />
                  <Star size={12} fill="#fbbf24" stroke="none" />
                  <span className="rating-badge">{garageState.rating}</span>
                  <span className="rating-text">{garageState.ratingText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup & Drop Toggle */}
          <div className="dt-pickup-card">
            <div className="dt-pickup-content">
              <div className="dt-pickup-text">
                <h4>Need pickup & drop?</h4>
                <p>Complimentary with your booking</p>
              </div>
              <label className="dt-toggle-switch">
                <input type="checkbox" checked={pickupDrop} onChange={() => setPickupDrop(!pickupDrop)} />
                <span className="slider"></span>
              </label>
            </div>
            <button 
              className="dt-btn-schedule" 
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Schedule Service'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
