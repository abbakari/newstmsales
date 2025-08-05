import React, { useEffect } from 'react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import RoleDashboard from '../components/RoleDashboard';
import { useRole } from '../contexts/RoleContext';

const RollingForecast: React.FC = () => {
  const { currentUser, logout } = useRole();

  // Redirect to login if no user
  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/login';
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <RoleBasedLayout>
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* User Dashboard Header */}
        <div className="bg-white border-b border-gray-200 m-4 mb-0 rounded-t-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentUser?.role === 'salesman' ? 'bg-blue-600' :
                  currentUser?.role === 'manager' ? 'bg-green-600' :
                  currentUser?.role === 'supply_chain' ? 'bg-purple-600' :
                  'bg-red-600'
                }`}></div>
                <span className="text-lg font-semibold text-gray-900">
                  {currentUser?.role === 'salesman' && '📊 Sales Forecast Dashboard'}
                  {currentUser?.role === 'manager' && '✅ Manager Approval Dashboard'}
                  {currentUser?.role === 'supply_chain' && '🚚 Supply Chain Management Dashboard'}
                  {currentUser?.role === 'admin' && '🛡️ Admin Control Panel'}
                </span>
              </div>
            </div>
            
            {/* User Information and Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                  <div className="text-xs text-gray-500">{currentUser?.department}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentUser?.role === 'salesman' ? 'bg-blue-100 text-blue-800' :
                  currentUser?.role === 'manager' ? 'bg-green-100 text-green-800' :
                  currentUser?.role === 'supply_chain' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentUser?.role.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    logout();
                    window.location.href = '/login';
                  }
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Role-Based Dashboard Content */}
        <div className="bg-white rounded-b-lg shadow-sm border-t-0 border border-gray-200 m-4 mt-0">
          <RoleDashboard />
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default RollingForecast;
