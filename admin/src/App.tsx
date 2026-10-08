import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext.js';
import { AdminRoutes } from './routes/AdminRoutes.js';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminRoutes />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
