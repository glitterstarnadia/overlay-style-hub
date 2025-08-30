import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Service workers don't work in Electron, so disable them
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registered: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);
