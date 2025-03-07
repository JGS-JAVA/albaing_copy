import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import PathRoute from "./pages/routes/PathRoute";
import {AuthProvider} from "./contexts/AuthContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <AuthProvider>
      <PathRoute/>
      </AuthProvider>
  </React.StrictMode>
);

