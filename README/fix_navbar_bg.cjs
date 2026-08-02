const fs = require('fs');
let css = fs.readFileSync('src/components/Navbar.css', 'utf8');

const additionalCss = `
  .floating-navbar {
    background: #ffffff !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
`;

css = css.replace(/@media \(max-width: 900px\) {/, '@media (max-width: 900px) {' + additionalCss);

fs.writeFileSync('src/components/Navbar.css', css);
