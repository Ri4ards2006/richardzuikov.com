import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MenuPlaceholder from './pages/MenuPlaceholder';
import Quick from './pages/Quick';

const Lab = lazy(() => import('./pages/Lab'));
const Impressum = lazy(() => import('./pages/Impressum'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<MenuPlaceholder />} />
            <Route path="/quick" element={<Quick />} />
            <Route path="/about" element={<Navigate to="/quick#about" replace />} />
            <Route path="/career" element={<Navigate to="/quick#career" replace />} />
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
      </Layout>
    </Router>
  );
}

export default App;
