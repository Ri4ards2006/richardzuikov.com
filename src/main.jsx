import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Hier binden wir dein vorhandenes SCSS global ein!
import '../assets-shared/css/style.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);