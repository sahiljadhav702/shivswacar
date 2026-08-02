import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [view, setView] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // If already logged in, instantly redirect to admin dashboard
  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {

      // Demo User Bypass
      if (email === 'user@hyundai.com' && password === 'user123') {
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userEmail', email);
        navigate('/', { replace: true });
        return;
      }
      
      if (email === 'admin@hyundai.com' && password === 'admin123') {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('userRole', 'Admin');
        navigate('/admin', { replace: true });
        return;
      }
      
      if (email === 'subadmin@hyundai.com' && password === 'subadmin123') {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('userRole', 'Sub Admin');
        navigate('/admin/customers', { replace: true });
        return;
      }


      // Check if this is a newly registered user from localStorage
      const registeredUserStr = localStorage.getItem('registeredUser');
      if (registeredUserStr) {
        const registeredUser = JSON.parse(registeredUserStr);
        if (registeredUser.email.trim().toLowerCase() === email.trim().toLowerCase() && registeredUser.password.trim() === password.trim()) {
          localStorage.setItem('userAuth', 'true');
          localStorage.setItem('userEmail', email.trim());
          navigate('/', { replace: true });
          return;
        }
      }

      const response = await api.post('/login', { email, password }).catch(e => e.response || e);
      let data = {};
      if (response.data) data = response.data;
      // Mock failure instead of crash if no backend
      if (response.status === 404) data = { success: false, message: 'Invalid email or password' };
      

      if ((response.status === 200 || response.status === 201) && data.success) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('userRole', data.role);
        if (data.role === 'MANAGER' || data.role === 'Manager' || data.role === 'Sub Admin') {
          navigate('/admin/customers', { replace: true });
        } else {
          navigate('/admin', { replace: true });
        }
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    // Store the newly registered user in local storage
    localStorage.setItem('registeredUser', JSON.stringify({ 
      email: email.trim().toLowerCase(), 
      password: password.trim(), 
      name: name.trim() 
    }));
    setSuccessMsg('Account created successfully! Please sign in.');
    setTimeout(() => {
      setView('login');
      setSuccessMsg('');
      setPassword(''); // clear password for login
    }, 2000);
  };

  return (
    <div className="login-page-wrapper">
      {/* Centered Form Card */}
      <motion.div
        className="login-form-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-brand-header">
          <h1 className="login-brand-title">Mai Hyundai</h1>
          <p className="login-brand-subtitle">
            {view === 'login' && 'Enter your credentials to access your account.'}
            {view === 'signup' && 'Create a new account to get started.'}
          </p>
        </div>

        {error && (
          <motion.div
            className="premium-error-alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <ShieldAlert size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            className="premium-error-alert"
            style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', borderColor: 'rgba(34, 197, 94, 0.3)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <span>{successMsg}</span>
          </motion.div>
        )}

        {view === 'login' && (
          <form onSubmit={handleLogin} className="premium-form">
            <div className="premium-input-group">
              <label className="premium-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="premium-input"
                required
              />
            </div>

            <div className="premium-input-group">
              <label className="premium-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="premium-input"
                required
              />
              <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                <Link to="/forgot-password" style={{ color: '#2563eb', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type="submit" className="premium-submit-btn">
              Sign In <ArrowRight size={18} />
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              Don't have an account? <span onClick={() => { setView('signup'); setError(''); setSuccessMsg(''); }} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>Sign Up</span>
            </div>
          </form>
        )}

        {view === 'signup' && (
          <form onSubmit={handleSignup} className="premium-form">
            <div className="premium-input-group">
              <label className="premium-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="premium-input"
                required
              />
            </div>

            <div className="premium-input-group">
              <label className="premium-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="premium-input"
                required
              />
            </div>

            <div className="premium-input-group">
              <label className="premium-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="premium-input"
                required
              />
            </div>

            <button type="submit" className="premium-submit-btn">
              Sign Up <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              Already have an account? <span onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>Sign In</span>
            </div>
          </form>
        )}

        {/* Quick Login Helper Box */}
        {view === 'login' && (
          <div className="demo-credentials-box">
            <div className="demo-title">Demo Credentials</div>
            <div className="demo-row">
              <span className="demo-label">Admin Email:</span>
              <span className="demo-value">admin@hyundai.com</span>
            </div>
            <div className="demo-row">
              <span className="demo-label">Admin Pass:</span>
              <span className="demo-value">admin123</span>
            </div>
            <div className="demo-row" style={{ marginTop: '0.5rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
              <span className="demo-label">Sub Admin Email:</span>
              <span className="demo-value">subadmin@hyundai.com</span>
            </div>
            <div className="demo-row">
              <span className="demo-label">Sub Admin Pass:</span>
              <span className="demo-value">subadmin123</span>
            </div>
            <div className="demo-row" style={{ marginTop: '0.5rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
              <span className="demo-label">User Email:</span>
              <span className="demo-value">user@hyundai.com</span>
            </div>
            <div className="demo-row">
              <span className="demo-label">User Pass:</span>
              <span className="demo-value">user123</span>
            </div>
          </div>
        )}

      </motion.div>

    </div>
  );
};

export default Login;
