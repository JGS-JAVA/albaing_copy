import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import PathRoute from "./routes/PathRoute";
import {AuthProvider} from "./contexts/AuthContext";
import {ModalProvider} from "./contexts/ModalContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <AuthProvider>
          <ModalProvider>
              <PathRoute />
          </ModalProvider>
      </AuthProvider>
  </React.StrictMode>
);

