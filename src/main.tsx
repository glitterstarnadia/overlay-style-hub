// Add comprehensive error logging for Electron debugging
console.log('=== MAIN.TSX STARTING ===');
console.log('main.tsx starting...');
console.log('Window location:', window.location.href);
console.log('Document ready state:', document.readyState);
console.log('User agent:', navigator.userAgent);
console.log('Is Electron:', !!window.electronAPI);

// Add error boundaries
window.addEventListener('error', (e) => {
  console.error('=== GLOBAL ERROR ===');
  console.error('Global error:', e.error, e.filename, e.lineno);
  console.error('Error stack:', e.error?.stack);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('=== UNHANDLED PROMISE REJECTION ===');
  console.error('Unhandled promise rejection:', e.reason);
});

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('=== IMPORTS SUCCESSFUL ===');
console.log('About to create root...');
const rootElement = document.getElementById("root");
console.log('Root element found:', !!rootElement);
console.log('Root element content:', rootElement?.innerHTML);

if (rootElement) {
  try {
    console.log('Creating React root...');
    const root = createRoot(rootElement);
    console.log('Root created successfully');
    console.log('About to render App...');
    root.render(<App />);
    console.log('App render called successfully');
  } catch (error) {
    console.error('=== ERROR CREATING/RENDERING ROOT ===');
    console.error('Error creating/rendering root:', error);
    console.error('Error stack:', (error as Error)?.stack);
  }
} else {
  console.error('=== ROOT ELEMENT NOT FOUND ===');
  console.error('Root element not found!');
  console.error('Document body content:', document.body?.innerHTML);
}
