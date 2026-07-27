const fs = require('fs');

let css = fs.readFileSync('src/components/Navbar.css', 'utf8');

// We will replace the entire @media (max-width: 900px) block that was added previously
const newMobileCss = `
@media (max-width: 900px) {
  .mobile-menu-btn {
    display: block;
    margin-left: auto;
  }
  
  .nav-links {
    display: none !important;
  }

  .nav-links.mobile-open {
    display: flex !important;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100vw;
    background: #ffffff !important;
    flex-direction: column;
    padding: 1rem 1.5rem;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    border-top: 1px solid rgba(0,0,0,0.05);
    z-index: 9999;
  }
  
  .nav-links .nav-link {
    width: 100%;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    height: auto;
    font-size: 1.1rem;
    color: #0f172a;
  }
  
  /* Remove the ::after underline on mobile to fix the strikethrough bug */
  .nav-links .nav-link::after {
    display: none !important;
  }
  
  .nav-links .nav-link.active {
    color: #00AAD2;
    background: none;
  }
  
  .nav-actions {
    display: none;
  }
  
  .nav-links.mobile-open .nav-actions-mobile {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
`;

// Remove the old @media (max-width: 900px) block from the bottom
css = css.replace(/@media \(max-width: 900px\) {[\s\S]*?}\n}/, newMobileCss);

fs.writeFileSync('src/components/Navbar.css', css);
