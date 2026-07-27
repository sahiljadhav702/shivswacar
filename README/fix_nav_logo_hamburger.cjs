const fs = require('fs');
let jsx = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

// Replace the <Link to="/" className="brand">
jsx = jsx.replace(
  /<Link to="\/" className="brand">[\s\S]*?<\/Link>/,
  `<Link 
            to="/" 
            className="brand"
            onClick={(e) => {
              if (window.innerWidth <= 900) {
                e.preventDefault();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }
            }}
          >
            <img src={hyundaiLogo} alt="Hyundai Logo" className="brand-icon" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          </Link>`
);

// Remove the mobile menu button (the 3 lines icon) completely
jsx = jsx.replace(
  /<button\s+className="mobile-menu-btn"[\s\S]*?<\/button>/,
  ''
);

fs.writeFileSync('src/components/Navbar.jsx', jsx);
console.log('Made logo act as hamburger menu');
