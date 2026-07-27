import { User } from 'lucide-react';
import { Search } from 'lucide-react';


const OwnerDetails = () => {
  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '4rem auto' }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '1rem', borderRadius: '12px' }}>
            <User size={32} color="white" />
          </div>
          <div>
            <h2>Vehicle Owner Details</h2>
            <p style={{ marginBottom: 0 }}>Find owner information by number plate</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="e.g. DL 1C AB 1234" 
            style={{ 
              flex: 1, 
              padding: '1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white',
              fontSize: '1rem',
              textTransform: 'uppercase',
              outline: 'none'
            }} 
          />
          <button className="btn btn-primary">
            <Search size={20} />
            Find Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetails;
