import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {BrowserRouter, Route, Routes} from "react-router-dom";
import JobPostManage from "./pages/jobpost/JobPostManage";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/jobposts/:id" element={<JobPostManage />} />
              {/* 다른 라우트들... */}
          </Routes>
      </BrowserRouter>

  </React.StrictMode>
);

