const fs = require('fs');
let css = fs.readFileSync('src/components/Navbar.css', 'utf8');

const baseRules = `
/* Base Mobile Menu Button Rule (Hidden on Desktop) */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #0f172a;
  cursor: pointer;
  padding: 0.5rem;
}
`;

css += baseRules;
fs.writeFileSync('src/components/Navbar.css', css);
console.log('Fixed mobile menu btn visibility on desktop');
