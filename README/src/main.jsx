import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Link, Outlet, BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'react-hot-toast';

import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
