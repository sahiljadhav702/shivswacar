import { Landmark } from 'lucide-react';
import { ExternalLink } from 'lucide-react';


const Parivahan = () => {
  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '4rem auto' }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '1rem', borderRadius: '12px' }}>
            <Landmark size={32} color="white" />
          </div>
          <div>
            <h2>Parivahan Portal</h2>
            <p style={{ marginBottom: 0 }}>Ministry of Road Transport & Highways</p>
          </div>
        </div>
        
        <p>
          The Parivahan Sewa portal provides online services related to vehicle registration, driving licenses, and more across India. 
          Access the official services securely.
        </p>
        
        <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
          Visit Official Portal <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};

export default Parivahan;
