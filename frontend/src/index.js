import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  
import './index.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
