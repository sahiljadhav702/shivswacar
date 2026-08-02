const fs = require('fs');

let css = fs.readFileSync('src/components/Navbar.css', 'utf8');
if (!css.includes('.mobile-menu-btn')) {
  css += `

/* Mobile Menu Additions */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #0f172a;
  cursor: pointer;
  padding: 0.5rem;
}

@media (max-width: 900px) {
  .mobile-menu-btn {
    display: block;
    margin-left: 1rem;
  }
  
  .nav-links {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: #ffffff;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    border-top: 1px solid rgba(0,0,0,0.05);
  }
  
  .nav-links.mobile-open {
    display: flex;
  }
  
  .nav-links .nav-link {
    width: 100%;
    padding: 1rem;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  .nav-actions {
    display: none; /* Can optionally show these inside the mobile menu or hide */
  }
  
  .nav-links.mobile-open .nav-actions-mobile {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
  }
}
`;
  fs.writeFileSync('src/components/Navbar.css', css);
}

let jsx = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

if (!jsx.includes('isMobileMenuOpen')) {
  jsx = jsx.replace(/import { Phone } from 'lucide-react';/, "import { Phone, Menu, X } from 'lucide-react';");
  jsx = jsx.replace(/const \[isAuthenticated, setIsAuthenticated\] = useState\(false\);/, "const [isAuthenticated, setIsAuthenticated] = useState(false);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);");
  
  // Add mobile menu toggle right after nav-actions
  jsx = jsx.replace(/<\/div>\s*<\/div>\s*<\/nav>/, 
`          </div>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>`);
      
  // Add .mobile-open class to nav-links
  jsx = jsx.replace(/<div className="nav-links">/, `<div className={\`nav-links \${isMobileMenuOpen ? 'mobile-open' : ''}\`}>`);
  
  // We should also put the contact chip and login button inside nav-links for mobile
  // Since we hid .nav-actions on mobile, we can duplicate them inside nav-links with a special class.
  const mobileActions = `
            <div className="nav-actions-mobile" style={{ display: window.innerWidth <= 900 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <a href="tel:9699938509" className="contact-chip-link" style={{ width: '100%' }}>
                <div className="contact-chip" style={{ justifyContent: 'center' }}>
                  <Phone size={18} />
                  <span>9699938509</span>
                </div>
              </a>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('adminAuth');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userAuth');
                    localStorage.removeItem('userEmail');
                    window.location.href = '/';
                  }}
                  className="login-btn"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%', justifyContent: 'center' }}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="login-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  <User size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>`;
            
  jsx = jsx.replace(/<\/div>\s*<div className="nav-actions">/, mobileActions + `\n          </div>\n\n          <div className="nav-actions">`);

  fs.writeFileSync('src/components/Navbar.jsx', jsx);
}
