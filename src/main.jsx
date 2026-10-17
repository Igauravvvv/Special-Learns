import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';

import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
// Motion + reference-inspired treatments, loaded last so they can refine the above.
import './styles/motion.css';
import './styles/reference.css';
import './styles/library.css';
import './styles/scenes.css';
import './styles/hero.css';
import './styles/home.css';
import './styles/specially-reviews.css';
import './styles/admin.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 24px', maxWidth: '640px', margin: '40px auto', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '16px', color: '#9f1239' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>Failed to render application</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #fda4af', fontSize: '0.85rem' }}>
            {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
          </pre>
          <button style={{ marginTop: '16px', padding: '10px 20px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

// Mark document as JS-ready now that bundle is successfully running
document.documentElement.classList.add('js');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
