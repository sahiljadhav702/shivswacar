import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/reset-password', { token, password }).catch(e => e.response || e);
      let data = {};
      if (response.data) data = response.data;

      if ((response.status === 200 || response.status === 201) && data.success) {
        setSuccessMsg('Password has been successfully reset. Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. The token may be expired.');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <motion.div
        className="login-form-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-brand-header">
          <h1 className="login-brand-title">Create New Password</h1>
          <p className="login-brand-subtitle">
            Please enter your new password below.
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

        <form onSubmit={handleReset} className="premium-form">
          <div className="premium-input-group">
            <label className="premium-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="premium-input"
                required
                disabled={!token || loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="premium-input-group">
            <label className="premium-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="premium-input"
                required
                disabled={!token || loading}
              />
            </div>
          </div>

          <button type="submit" className="premium-submit-btn" disabled={!token || loading}>
            {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={18} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
            <Link to="/login" style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }}>Back to Sign In</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
