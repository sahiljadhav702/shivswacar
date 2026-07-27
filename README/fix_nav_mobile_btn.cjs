const fs = require('fs');
let css = fs.readFileSync('src/components/Navbar.css', 'utf8');

const fixRule = `
@media (max-width: 900px) {
  .mobile-menu-btn {
    display: block !important;
  }
}
`;

css += fixRule;
fs.writeFileSync('src/components/Navbar.css', css);
console.log('Mobile menu button restored on mobile view.');
