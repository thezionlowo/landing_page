import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/home.css';
import './styles/site.css';
import './styles/landing.css';
import './styles/content.css';
import './styles/account.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  // Checkout/account URLs use the homepage HTML as their SPA shell. Hydrate only
  // when the HTML was rendered for this route; otherwise mount the requested page.
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  if (rootElement.hasChildNodes() && rootElement.dataset.prerenderPath === currentPath) {
    ReactDOM.hydrateRoot(
      rootElement,
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}
