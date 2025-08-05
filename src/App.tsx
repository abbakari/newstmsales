import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import Login from './pages/Login';
import LoginStandalone from './pages/LoginStandalone';
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
    <Router>
      <Routes>
        <Route path="/" element={<LoginStandalone />} />
        <Route path="/login" element={<LoginStandalone />} />

        <Route path="/test-with-context" element={
          <RoleProvider>
            <Login />
          </RoleProvider>
        } />

        <Route path="/rolling-forecast" element={
          <RoleProvider>
            <RollingForecast />
          </RoleProvider>
        } />

        {/* Comprehensive Dashboard Routes */}
        <Route path="/dashboard" element={
          <RoleProvider>
            <DashboardRoleWrapper />
          </RoleProvider>
        } />
        <Route path="/bi-dashboard" element={
          <RoleProvider>
            <BiDashboardWrapper />
          </RoleProvider>
        } />
        <Route path="/sales-budget" element={
          <RoleProvider>
            <SalesBudget />
          </RoleProvider>
        } />

        {/* Management and Admin Routes */}
        <Route path="/user-management" element={
          <RoleProvider>
            <UserManagementWrapper />
          </RoleProvider>
        } />
        <Route path="/data-sources" element={
          <RoleProvider>
            <DataSourcesWrapper />
          </RoleProvider>
        } />
        <Route path="/inventory-management" element={
          <RoleProvider>
            <InventoryManagementWrapper />
          </RoleProvider>
        } />
        <Route path="/distribution-management" element={
          <RoleProvider>
            <DistributionManagementWrapper />
          </RoleProvider>
        } />

        {/* Default redirect to login */}
        <Route path="*" element={<LoginStandalone />} />
      </Routes>
    </Router>
  );
}

export default App;
