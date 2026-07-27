const fs = require('fs');

// 1. Update JSX
let jsx = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

if (!jsx.includes('mobile-brand-text')) {
  jsx = jsx.replace(
    /<div className="nav-content">/,
    `<div className="nav-content">
          <span className="mobile-brand-text">HYUNDAI</span>`
  );
  fs.writeFileSync('src/components/Navbar.jsx', jsx);
}

// 2. Update CSS
let css = fs.readFileSync('src/components/Navbar.css', 'utf8');

if (!css.includes('.mobile-brand-text')) {
  const newCss = `
.mobile-brand-text {
  display: none;
  font-weight: 900;
  font-size: 1.4rem;
  color: #0f172a;
  letter-spacing: 2px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
@media (max-width: 900px) {
  .mobile-brand-text {
    display: block;
  }
}
`;
  css += newCss;
  fs.writeFileSync('src/components/Navbar.css', css);
}

console.log('Added HYUNDAI text for mobile view');
