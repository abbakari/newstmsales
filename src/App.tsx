import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import Login from './pages/Login';
import RollingForecast from './pages/RollingForecast';
import DashboardRoleWrapper from './pages/DashboardRoleWrapper';
import SalesBudget from './pages/SalesBudget';
import {
  BiDashboardWrapper,
  UserManagementWrapper,
  DataSourcesWrapper,
  InventoryManagementWrapper,
  DistributionManagementWrapper
} from './pages/RoleBasedPageWrapper';
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
          <Route path="/dashboard" element={<DashboardRoleWrapper />} />
          <Route path="/bi-dashboard" element={<BiDashboardWrapper />} />
          <Route path="/sales-budget" element={<SalesBudget />} />

          {/* Management and Admin Routes */}
          <Route path="/user-management" element={<UserManagementWrapper />} />
          <Route path="/data-sources" element={<DataSourcesWrapper />} />
          <Route path="/inventory-management" element={<InventoryManagementWrapper />} />
          <Route path="/distribution-management" element={<DistributionManagementWrapper />} />

          {/* Default redirect to main role-based dashboard */}
          <Route path="*" element={<RollingForecast />} />
        </Routes>
      </Router>
    </RoleProvider>
  );
}

export default App;
