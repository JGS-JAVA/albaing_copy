import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import DemoPage from "./pages/DemoPage";

import {BrowserRouter, Route, Routes} from "react-router-dom";
import JobPostManage from "./pages/jobpost/JobPostManage";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <DemoPage/>
  </React.StrictMode>
);

