import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Stage from './pages/Stage';
import Quick from './pages/Quick';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import About from './pages/About';
import Career from './pages/Career';
import Stack from './pages/Stack';
import Work from './pages/Work';
import { useWipeLocation } from './hooks/use-wipe-location';
import FogGate from './components/atlus/FogGate';

const Lab = lazy(() => import('./pages/Lab'));
const Impressum = lazy(() => import('./pages/Impressum'));

function AppRoutes() {
  const { displayed, transition, clearTransition } = useWipeLocation();

  return (
    <>
      {transition?.type === 'wipe' && <div key={transition.key} aria-hidden="true" className="wipe-panel" onAnimationEnd={clearTransition} />}
      {transition?.type === 'fog' && <FogGate key={transition.key} onDone={clearTransition} />}
      <Suspense fallback={null}>
        <Routes location={displayed}>
          <Route path="/" element={<Stage />} />
          <Route path="/quick" element={<Quick />} />
          <Route path="/about" element={<About />} />
          <Route path="/career" element={<Career />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/works" element={<Navigate to="/lab" replace />} />
          <Route path="/portfolio" element={<Navigate to="/lab" replace />} />
          <Route path="/dev" element={<Navigate to="/lab" replace />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Impressum />} />
          <Route path="/legal" element={<Impressum />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App;
