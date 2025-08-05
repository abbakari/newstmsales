import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import Login from './pages/Login';
import RollingForecast from './pages/RollingForecast';
import './index.css';

function App() {
  return (
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rolling-forecast" element={<RollingForecast />} />
          {/* Redirect any other routes to rolling forecast */}
          <Route path="*" element={<RollingForecast />} />
        </Routes>
      </Router>
    </RoleProvider>
  );
}

export default App;
