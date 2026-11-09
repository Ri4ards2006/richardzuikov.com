import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MenuPlaceholder from './pages/MenuPlaceholder';
import Quick from './pages/Quick';
import Career from './pages/Career';
import Stack from './pages/Stack';
import Work from './pages/Work';
import { useWipeLocation } from './hooks/use-wipe-location';

const Lab = lazy(() => import('./pages/Lab'));
const Impressum = lazy(() => import('./pages/Impressum'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppRoutes() {
  const { displayed, wipeKey, clearWipe } = useWipeLocation();

  return (
    <>
      {wipeKey > 0 && <div key={wipeKey} aria-hidden="true" className="wipe-panel" onAnimationEnd={clearWipe} />}
      <Suspense fallback={null}>
        <Routes location={displayed}>
          <Route path="/" element={<MenuPlaceholder />} />
          <Route path="/quick" element={<Quick />} />
          <Route path="/career" element={<Career />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<Navigate to="/quick#about" replace />} />
          <Route path="/contact" element={<Navigate to="/quick#contact" replace />} />
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
