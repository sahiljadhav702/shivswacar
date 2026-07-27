import { MapPin } from 'lucide-react';
import { Search } from 'lucide-react';


const RTOInfo = () => {
  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '4rem auto' }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '1rem', borderRadius: '12px' }}>
            <MapPin size={32} color="white" />
          </div>
          <div>
            <h2>RTO Information</h2>
            <p style={{ marginBottom: 0 }}>Find RTO offices, codes & services</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="Search by state or RTO code (e.g. MH-01)" 
            style={{ 
              flex: 1, 
              padding: '1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }} 
          />
          <button className="btn btn-primary">
            <Search size={20} />
            Search
          </button>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <p style={{ textAlign: 'center', margin: 0 }}>Enter a code above to view RTO details.</p>
        </div>
      </div>
    </div>
  );
};

export default RTOInfo;
