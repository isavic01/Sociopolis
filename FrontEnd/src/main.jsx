import { StrictMode } from 'react'

import './index.css'
import App from './App.jsx'
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);