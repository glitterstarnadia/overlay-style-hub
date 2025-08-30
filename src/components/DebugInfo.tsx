import React from 'react';

const DebugInfo: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'white',
      border: '2px solid red',
      padding: '20px',
      zIndex: 9999,
      fontSize: '14px',
      fontFamily: 'monospace',
      color: 'black',
      maxWidth: '400px'
    }}>
      <h3>Debug Info</h3>
      <p>React is working!</p>
      <p>Location: {window.location.href}</p>
      <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
      <p>Is Electron: {window.electronAPI ? 'Yes' : 'No'}</p>
      <p>Document Ready: {document.readyState}</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

export default DebugInfo;