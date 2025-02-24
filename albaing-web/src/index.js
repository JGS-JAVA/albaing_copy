import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import DemoPage from "./pages/home/Home";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <DemoPage/>
  </React.StrictMode>
);

