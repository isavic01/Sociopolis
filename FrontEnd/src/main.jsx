import { StrictMode } from 'react'

import './index.css'
import App from './App.jsx'
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router";
import { AuthProvider } from "./apps/auth/components/AuthProvider"

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </React.StrictMode>
  );
}
