import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;