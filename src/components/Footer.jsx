import React from 'react';

function Footer() {
  return (
    <footer className="main-footer">
      <span>&copy; {new Date().getFullYear()} Richard Zuikov · Prepared to debug</span>
    </footer>
  );
}

export default Footer;