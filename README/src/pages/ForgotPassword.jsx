import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'user@hyundai.com') {
      setSuccessMsg('Demo user password cannot be reset.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/forgot-password', { email: cleanEmail }).catch(e => e.response || e);
      let data = {};
      if (response.data) data = response.data;
      if (response.status === 404) data = { success: true, message: 'If the email is registered, a password reset link has been sent.' }; // Override 404 for security

      if ((response.status === 200 || response.status === 201) && data.success) {
        setSuccessMsg(data.message || 'If the email is registered, a password reset link has been sent.');
        if (data.previewUrl) {
            console.log('Demo Mode - Reset Link:', data.previewUrl);
        }
      } else {
        setError(data.message || 'An error occurred.');
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
          <h1 className="login-brand-title">Reset Password</h1>
          <p className="login-brand-subtitle">
            Enter your email to receive a password reset link.
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

        <form onSubmit={handleForgot} className="premium-form">
          <div className="premium-input-group">
            <label className="premium-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="premium-input"
              required
            />
          </div>

          <button type="submit" className="premium-submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={18} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
            Remembered your password? <Link to="/login" style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
