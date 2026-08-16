
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Landing V2 ships prerendered HTML for crawlers and no-JS visitors. Its
// animation state is intentionally client-only, so replace the static snapshot
// before mounting instead of hydrating non-deterministic motion styles.
if (rootElement.hasChildNodes()) rootElement.replaceChildren();
ReactDOM.createRoot(rootElement).render(app);
