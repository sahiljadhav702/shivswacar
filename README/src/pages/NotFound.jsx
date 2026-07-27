import { AlertTriangle } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { Home } from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        padding: '1.5rem',
        borderRadius: '50%',
        marginBottom: '1.5rem',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <AlertTriangle size={64} color="#ef4444" />
      </div>
      
      <h1 style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--text-color)', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>
        Oops! Page not found.
      </h2>
      
      <p style={{ color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate(-1)}
          className="btn"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'var(--bg-card)',
            color: 'var(--text-color)',
            border: '1px solid var(--glass-border)'
          }}
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
        <Link 
          to="/" 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
