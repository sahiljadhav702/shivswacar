import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'forgot'
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

      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
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

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'user@hyundai.com') {
      setSuccessMsg('Demo user password cannot be reset. Use user123');
      setTimeout(() => { setView('login'); setSuccessMsg(''); setPassword(''); }, 3000);
      return;
    }

    try {
      // 1. Try real backend API first
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(`Reset link sent! (Demo: ${data.previewUrl})`);
        setTimeout(() => {
          setView('login');
          setSuccessMsg('');
          setPassword('');
        }, 8000);
        return;
      }

      // 2. Fallback to local storage for mock signup users if API returns 404
      if (response.status === 404) {
        const registeredUserStr = localStorage.getItem('registeredUser');
        if (registeredUserStr) {
          const registeredUser = JSON.parse(registeredUserStr);
          if (registeredUser.email === cleanEmail) {
            const tempPassword = Math.random().toString(36).slice(-6);
            registeredUser.password = tempPassword;
            localStorage.setItem('registeredUser', JSON.stringify(registeredUser));
            
            setSuccessMsg(`Local mock user reset! Temp password: ${tempPassword}`);
            setTimeout(() => {
              setView('login');
              setSuccessMsg('');
              setPassword('');
            }, 5000);
            return;
          }
        }
      }
      
      setError(data.message || 'Account with this email was not found.');
      
    } catch (err) {
      setError('Failed to connect to the server');
    }
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
            {view === 'forgot' && 'Reset your password.'}
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
                <span 
                  onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }} 
                  style={{ color: '#2563eb', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' }}
                >
                  Forgot Password?
                </span>
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

        {view === 'forgot' && (
          <form onSubmit={handleForgot} className="premium-form">
            <div className="premium-input-group">
              <label className="premium-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to reset password"
                className="premium-input"
                required
              />
            </div>

            <button type="submit" className="premium-submit-btn">
              Send Reset Link <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              Remembered your password? <span onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>Sign In</span>
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
