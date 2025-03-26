
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n'; // Import i18n configuration

// Create the React root first
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Then render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
