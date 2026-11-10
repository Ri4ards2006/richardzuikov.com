import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Quick from './pages/Quick';
import Stage from './pages/Stage';
import NotFound from './pages/NotFound';
import { useWipeLocation } from './hooks/use-wipe-location';

const About = lazy(() => import('./pages/About'));
const Work = lazy(() => import('./pages/Work'));
const Stack = lazy(() => import('./pages/Stack'));
const Career = lazy(() => import('./pages/Career'));
const Impressum = lazy(() => import('./pages/Impressum'));
// Dev-only poster lab (v7 task 6); the DEV guard drops it from the production bundle.
const PortraitLab = import.meta.env.DEV ? lazy(() => import('./pages/PortraitLab')) : null;

function AppRoutes() {
  const { displayed, transition, clearTransition } = useWipeLocation();
  if (PortraitLab && new URLSearchParams(displayed.search).has('portrait-lab')) {
    return <Suspense fallback={null}><PortraitLab /></Suspense>;
  }

  return (
    <>
      {transition?.type === 'wipe' && <div key={transition.key} aria-hidden="true" className="wipe-panel" onAnimationEnd={clearTransition}><span /><span /><span /></div>}
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes location={displayed}>
          <Route path="/" element={<Stage />} />
          <Route path="/quick" element={<Quick />} />
          <Route path="/about" element={<About />} />
          <Route path="/career" element={<Career />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Navigate to="/#bonfire" replace />} />
          <Route path="/lab" element={<Navigate to="/#arcana" replace />} />
          <Route path="/works" element={<Navigate to="/#arcana" replace />} />
          <Route path="/portfolio" element={<Navigate to="/#arcana" replace />} />
          <Route path="/dev" element={<Navigate to="/#arcana" replace />} />
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
