import React from 'react';
import { useRole } from '../contexts/RoleContext';
import AdminDashboard from './AdminDashboard';
import ManagerApprovalDashboard from './ManagerApprovalDashboard';
import SupplyChainDashboard from './SupplyChainDashboard';
import SalesmanForecastDashboard from './SalesmanForecastDashboard';

const RoleDashboard: React.FC = () => {
  const { currentUser } = useRole();

  // Redirect to login if no user
  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  // Render appropriate dashboard based on user role
  switch (currentUser.role) {
    case 'manager':
      return <ManagerApprovalDashboard />;
    case 'supply_chain':
      return <SupplyChainDashboard />;
    case 'salesman':
    default:
      return <SalesmanForecastDashboard />;
  }
};

export default RoleDashboard;
