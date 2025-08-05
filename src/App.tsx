import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import Login from './pages/Login';
import RollingForecast from './pages/RollingForecast';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/sales-budget"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]}>
                <SalesBudget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rolling-forecast"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]}>
                <RollingForecast />
              </ProtectedRoute>
            }
          />
          <Route
            path="/distribution-management"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SUPPLY_CHAIN]}>
                <DistributionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory-management"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SUPPLY_CHAIN, UserType.MANAGER]}>
                <InventoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-sources"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.MANAGER]}>
                <DataSources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bi-dashboard"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.MANAGER, UserType.SALESMAN]}>
                <BiDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
