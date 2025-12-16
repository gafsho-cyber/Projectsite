import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

fetch('mqtt://localhost:1883/api/data')
.then(response => response.json)
.then(data => console.log(data))
.catch(error => console.error('Error fetching data:', error));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
