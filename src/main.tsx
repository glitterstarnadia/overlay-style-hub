// Add comprehensive error logging for Electron debugging
console.log('main.tsx starting...');
console.log('Window location:', window.location.href);
console.log('Document ready state:', document.readyState);

// Add error boundaries
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('About to create root...');
const rootElement = document.getElementById("root");
console.log('Root element found:', !!rootElement);

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    console.log('Root created, about to render...');
    root.render(<App />);
    console.log('App render called');
  } catch (error) {
    console.error('Error creating/rendering root:', error);
  }
} else {
  console.error('Root element not found!');
}
