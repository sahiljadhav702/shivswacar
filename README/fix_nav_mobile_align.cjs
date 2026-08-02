const fs = require('fs');
let css = fs.readFileSync('src/components/Navbar.css', 'utf8');

// I will just append the overriding CSS for mobile at the very bottom of the file
// to ensure it wins the cascade and fixes the issues.

const fixes = `
@media (max-width: 900px) {
  .top-utility-bar {
    display: none !important;
  }
  
  .floating-navbar {
    top: 0 !important;
    background: #ffffff !important;
  }
  
  .nav-links.mobile-open {
    height: auto !important; /* Override height: 100% so background covers all items */
    min-height: max-content;
    gap: 0 !important; /* Remove the huge desktop gap */
  }
  
  .nav-links .nav-link {
    margin: 0 !important;
    padding: 1rem 1.5rem !important;
  }
  
  /* Fix the empty dropdown container taking up space */
  .nav-links .dropdown-container:empty {
    display: none !important;
  }
}
`;

css += fixes;
fs.writeFileSync('src/components/Navbar.css', css);
console.log('Mobile nav alignment CSS added.');
