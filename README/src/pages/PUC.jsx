import { Wind } from 'lucide-react';
import { FileText } from 'lucide-react';


const PUC = () => {
  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '4rem auto' }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '1rem', borderRadius: '12px' }}>
            <Wind size={32} color="white" />
          </div>
          <div>
            <h2>PUC Certificate</h2>
            <p style={{ marginBottom: 0 }}>Check pollution under control status</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Registration Number</label>
            <input 
              type="text" 
              placeholder="e.g. MH 12 AB 1234" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 42, 0.5)',
                color: 'white',
                outline: 'none',
                textTransform: 'uppercase'
              }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Chassis Number (Last 5 characters)</label>
            <input 
              type="text" 
              placeholder="e.g. 98765" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 42, 0.5)',
                color: 'white',
                outline: 'none'
              }} 
            />
          </div>
          <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <FileText size={18} />
            Check PUC Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default PUC;
