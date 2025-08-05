import React from 'react';
import { useLocation } from 'react-router-dom';

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="layout-wrapper flex flex-col">
        {location.pathname === '/' || location.pathname === '/login' ? (
          // Login page - no navigation
          <div className="flex-grow">
            {children}
          </div>
        ) : (
          // Dashboard pages - minimal layout
          <div className="flex-grow">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleBasedLayout;
