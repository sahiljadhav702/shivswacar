import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Camera } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';

import hyundaiLogo from '../assets/hyundai-logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="footer-premium-container">
        
        {/* Top Section with Newsletter or CTA */}
        <div className="footer-cta">
          <div className="cta-content">
            <h3>Get Exclusive Offers & Updates</h3>
            <p>Subscribe to our newsletter for the latest automotive tips and service discounts.</p>
          </div>
          <div className="cta-input-group">
            <input type="email" placeholder="Enter your email address" className="cta-input" />
            <button className="cta-btn">Subscribe <ArrowRight size={18} /></button>
          </div>
        </div>

        <div className="footer-premium-grid">
          {/* Brand Column */}
          <div className="footer-premium-col brand-col">
            <Link to="/" className="footer-brand">
              <img src={hyundaiLogo} alt="Hyundai Logo" className="brand-logo" />
            </Link>
            <p className="brand-desc">
              Experience the pinnacle of automotive care. We deliver premium maintenance, certified parts, and exceptional service to keep your vehicle performing flawlessly.
            </p>
            <div className="social-links-premium">
              <a href="#" className="social-icon-btn"><Globe size={18} /></a>
              <a href="#" className="social-icon-btn"><MessageCircle size={18} /></a>
              <a href="#" className="social-icon-btn"><Camera size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-premium-col">
            <h4 className="col-title" style={{ textAlign: 'center' }}>Our Services</h4>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              <ul className="footer-links-list">
                <li><Link to="/services/car-services"><ChevronRight size={14} className="link-arrow"/> Car Services</Link></li>
                <li><Link to="/services/ac-repair"><ChevronRight size={14} className="link-arrow"/> AC Service & Repair</Link></li>
                <li><Link to="/services/batteries"><ChevronRight size={14} className="link-arrow"/> Batteries</Link></li>
                <li><Link to="/services/tyres-wheel-care"><ChevronRight size={14} className="link-arrow"/> Tyres & Wheel Care</Link></li>
                <li><Link to="/services/denting-painting"><ChevronRight size={14} className="link-arrow"/> Denting & Painting</Link></li>
              </ul>
              <ul className="footer-links-list">
                <li><Link to="/services/detailing"><ChevronRight size={14} className="link-arrow"/> Detailing Services</Link></li>
                <li><Link to="/services/car-spa"><ChevronRight size={14} className="link-arrow"/> Car Spa & Cleaning</Link></li>
                <li><Link to="/services/inspections"><ChevronRight size={14} className="link-arrow"/> Car Inspections</Link></li>
                <li><Link to="/services/windshields-lights"><ChevronRight size={14} className="link-arrow"/> Windshields & Lights</Link></li>
                <li><Link to="/services/suspension-fitments"><ChevronRight size={14} className="link-arrow"/> Suspension & Fitments</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="footer-premium-col">
            <h4 className="col-title">Get in Touch</h4>
            <ul className="contact-info-list">
              <li>
                <div className="contact-icon-wrap"><MapPin size={16} /></div>
                <div className="contact-text">
                  <span>Service Center</span>
                  <p>123 Auto Avenue, Motor City, IN 12345</p>
                </div>
              </li>
              <li>
                <div className="contact-icon-wrap"><Phone size={16} /></div>
                <div className="contact-text">
                  <span>Call Us (24/7)</span>
                  <p>0124 - 6538000</p>
                </div>
              </li>
              <li>
                <div className="contact-icon-wrap"><Mail size={16} /></div>
                <div className="contact-text">
                  <span>Email Support</span>
                  <p>support@royalmotors.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-premium-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} Royal Motors. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="dot">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
