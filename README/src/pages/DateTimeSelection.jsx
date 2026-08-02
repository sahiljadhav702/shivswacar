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
  const bottomRef = useRef(null);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (window.innerWidth <= 600 && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  };

  useEffect(() => {
    api.get('/bookings/slots')
      .then(res => res)
      .then(res => {
        const data = res.data;
        if (data.success) setBookedSlots(data.data);
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
      if (s.bookingDate === dateStr) totalBooked += s.count;
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
    const regNo = vehicleState.regNumber || 'N/A';
    const ownerName = vehicleState.ownerName || 'Guest User';
    const mobileNumber = vehicleState.mobileNumber || '9999999999';

    try {
      // 1. Create or Update Customer (and Vehicle)
      const customerRes = await api.post('/customers', {
        name: ownerName,
        phone: mobileNumber,
        car_brand: vehicleState.brand || 'Hyundai',
        car_model: vehicleState.model || '',
        car_number: regNo !== 'N/A' ? regNo : ''
      });
      
      const customerId = customerRes.data.id;

      if (customerId) {
        // 2. Create Booking
        const dateStr = selectedDate.toISOString().split('T')[0];
        const startTimeStr = selectedTime.split(' - ')[0]; 
        const timeMapping = {
          '09:00 AM': '09:00:00', '10:00 AM': '10:00:00', '11:00 AM': '11:00:00', '12:00 PM': '12:00:00',
          '01:00 PM': '13:00:00', '02:00 PM': '14:00:00', '03:00 PM': '15:00:00', '04:00 PM': '16:00:00',
          '05:00 PM': '17:00:00'
        };
        const timeVal = timeMapping[startTimeStr] || '10:00:00';

        await api.post('/bookings', {
          customerId: customerId,
          complaints: pkgState.name,
          totalAmount: pkgState.price,
          booking_date: dateStr,
          booking_time: timeVal
        });
      }

      // 3. Open WhatsApp
      const rawMessage = `Hello PB Wheels!\n\nI would like to confirm my booking:\n🚗 *Vehicle*: ${vehicleState.brand} ${vehicleState.model} (${regNo})\n👤 *Name*: ${ownerName}\n📞 *Phone*: ${mobileNumber}\n🛠️ *Service*: ${pkgState.name}\n🏢 *Garage*: ${garageState.name}\n📅 *Date & Time*: ${dateFormatted} at ${selectedTime}\n🚕 *Pickup/Drop*: ${pickupDrop ? 'Yes' : 'No'}\n💰 *Estimated Price*: ₹${pkgState.price.toLocaleString()}\n\nPlease confirm my appointment!`;

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
          <motion.div 
            className="dt-header-dark"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button 
              className="dt-back-btn-dark" 
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, x: -3, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div className="dt-header-text">
              <motion.h2 
                className="dt-title-dark"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Book service slot
              </motion.h2>
              <motion.p 
                className="dt-subtitle-dark"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Choose preferred date & time
              </motion.p>
            </div>
          </motion.div>

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

          <motion.div 
            className="dt-time-grid"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.04 } },
              hidden: {}
            }}
          >
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
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } }
                  }}
                  whileHover={{ scale: isSoldOut ? 1 : 1.03, y: isSoldOut ? 0 : -3 }}
                  whileTap={{ scale: isSoldOut ? 1 : 0.98 }}
                  key={time}
                  className={`dt-time-card ${isSelected ? 'active' : ''} ${isSoldOut ? 'sold-out' : ''}`}
                  onClick={() => !isSoldOut && handleTimeSelect(time)}
                  style={{ cursor: isSoldOut ? 'not-allowed' : 'pointer' }}
                >
                  <span className="time">{time}</span>
                  <span className="slots-left" style={{ color: isSoldOut ? 'red' : 'inherit' }}>
                    {isSoldOut ? 'Sold Out' : <><span className="dot"></span> {slots} Slots Left</>}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
          {submitError && <div className="dt-error-text">{submitError}</div>}

          {/* Pickup & Drop Toggle */}
          <div className="dt-pickup-card" style={{ marginTop: '2rem' }} ref={bottomRef}>
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
