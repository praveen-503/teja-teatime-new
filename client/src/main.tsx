import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '12px',
          padding: '12px 16px',
          maxWidth: '380px',
        },
        success: {
          style: {
            background: '#F0FDF4',
            color: '#16a34a',
            border: '1px solid #bbf7d0',
          },
          iconTheme: {
            primary: '#16a34a',
            secondary: '#F0FDF4',
          },
        },
        error: {
          style: {
            background: '#FEF2F2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
        },
      }}
    />
  </React.StrictMode>
);
