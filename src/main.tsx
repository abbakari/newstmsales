import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Debug test
const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log('React root created');

  root.render(
    <StrictMode>
      <div style={{background: 'red', color: 'white', padding: '20px'}}>
        <h1>EMERGENCY DEBUG: React is working!</h1>
        <App />
      </div>
    </StrictMode>
  );
} else {
  console.error('Root element not found!');
}
