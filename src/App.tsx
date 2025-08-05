import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import Login from './pages/Login';
import RollingForecast from './pages/RollingForecast';
import Dashboard from './pages/Dashboard';
import BiDashboard from './pages/BiDashboard';
import SalesBudget from './pages/SalesBudget';
import UserManagement from './pages/UserManagement';
import DataSources from './pages/DataSources';
import InventoryManagement from './pages/InventoryManagement';
import DistributionManagement from './pages/DistributionManagement';
import './index.css';

function App() {
  return (
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rolling-forecast" element={<RollingForecast />} />

          {/* Comprehensive Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bi-dashboard" element={<BiDashboard />} />
          <Route path="/sales-budget" element={<SalesBudget />} />

          {/* Management and Admin Routes */}
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/inventory-management" element={<InventoryManagement />} />
          <Route path="/distribution-management" element={<DistributionManagement />} />

          {/* Default redirect to main role-based dashboard */}
          <Route path="*" element={<RollingForecast />} />
        </Routes>
      </Router>
    </RoleProvider>
  );
}

export default App;
