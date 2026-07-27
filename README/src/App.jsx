import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import { Routes, Route, Link, Outlet, BrowserRouter } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Customers from './pages/admin/Customers';
import Bookings from './pages/admin/Bookings';
import Services from './pages/admin/Services';
import Invoices from './pages/admin/Invoices';
import InvoicePrint from './pages/admin/InvoicePrint';
import Reports from './pages/admin/Reports';
import Staff from './pages/admin/Staff';
import Settings from './pages/admin/Settings';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyGarage from './pages/MyGarage';
import CarServices from './pages/CarServices';
import PUC from './pages/PUC';
import CarDetails from './pages/CarDetails';
import BatteryServiceSelection from './pages/BatteryServiceSelection';
import GarageSelection from './pages/GarageSelection';
import DateTimeSelection from './pages/DateTimeSelection';
import SocialMedia from './pages/SocialMedia';
import Login from './pages/Login';
import Footer from './components/Footer';

import { useState } from 'react';


function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            {/* Standalone Admin Routes */}
            <Route path="/admin/invoices/:id/print" element={<InvoicePrint />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="services" element={<Services />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="reports" element={<Reports />} />
              <Route path="staff" element={<Staff />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Public Routes with Navbar and Footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <div className="page-container flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/my-garage" element={<MyGarage />} />
                    <Route path="/car-services" element={<CarServices />} />
                    <Route path="/puc" element={<PUC />} />
                    <Route path="/car-details" element={<CarDetails />} />
                    <Route path="/battery-service-selection" element={<BatteryServiceSelection />} />
                    <Route path="/garage-selection" element={<GarageSelection />} />
                    <Route path="/date-time-selection" element={<DateTimeSelection />} />
                    <Route path="/social-media" element={<SocialMedia />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
