import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/style.scss'; // Überprüf mal, ob der Pfad zu deiner style.scss exakt so stimmt!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);