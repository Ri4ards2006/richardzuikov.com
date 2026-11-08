import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Career from './pages/Career';
import Lab from './pages/Lab';
import Contact from './pages/Contact';
import Impressum from './pages/Impressum';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/career" element={<Career />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/works" element={<Navigate to="/lab" replace />} />
            <Route path="/portfolio" element={<Navigate to="/lab" replace />} />
            <Route path="/dev" element={<Navigate to="/lab" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Impressum />} />
            <Route path="/legal" element={<Impressum />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}


export default App;