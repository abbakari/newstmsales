import React, { useEffect } from 'react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import RoleDashboard from '../components/RoleDashboard';
import { useRole } from '../contexts/RoleContext';
import { BarChart3, PieChart, TrendingUp, Users, Package, Settings, Database, Grid } from 'lucide-react';

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

        {/* Quick Navigation to Other Dashboards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 m-4">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Dashboard & Tools Navigation</h2>
            <p className="text-sm text-gray-600">Access comprehensive dashboards and tools based on your role permissions</p>
          </div>

          <div className="p-4">
            {/* Budget Management Section */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                <PieChart className="w-4 h-4 mr-2" />
                Budget Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => window.location.href = '/sales-budget'}
                  className="p-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-all duration-200 text-left hover:shadow-md transform hover:scale-105"
                >
                  <div className="flex items-start space-x-3">
                    <PieChart className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Sales Budget</h4>
                      <p className="text-sm opacity-80">Comprehensive budget management, forecasting, and planning</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.location.href = '/bi-dashboard'}
                  className="p-4 rounded-lg border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 transition-all duration-200 text-left hover:shadow-md transform hover:scale-105"
                >
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">BI Analytics</h4>
                      <p className="text-sm opacity-80">Advanced business intelligence and analytics dashboard</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Role-Specific Tools */}
            {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  {currentUser?.role === 'admin' ? 'Administration' : 'Management Tools'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentUser?.role === 'admin' && (
                    <>
                      <button
                        onClick={() => window.location.href = '/user-management'}
                        className="p-4 rounded-lg border border-green-200 bg-green-50 text-green-800 hover:bg-green-100 transition-all duration-200 text-left hover:shadow-md transform hover:scale-105"
                      >
                        <div className="flex items-start space-x-3">
                          <Users className="w-6 h-6 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">User Management</h4>
                            <p className="text-sm opacity-80">Manage system users and permissions</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => window.location.href = '/data-sources'}
                        className="p-4 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-all duration-200 text-left hover:shadow-md transform hover:scale-105"
                      >
                        <div className="flex items-start space-x-3">
                          <Database className="w-6 h-6 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">Data Sources</h4>
                            <p className="text-sm opacity-80">Configure system data connections</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100 transition-all duration-200 text-left hover:shadow-md transform hover:scale-105"
                      >
                        <div className="flex items-start space-x-3">
                          <Grid className="w-6 h-6 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">Legacy Dashboard</h4>
                            <p className="text-sm opacity-80">Original comprehensive system dashboard</p>
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Operations Section */}
            {(currentUser?.role === 'supply_chain' || currentUser?.role === 'admin') && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Operations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => window.location.href = '/inventory-management'}
                    className="p-4 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100 transition-all duration-200 text-left hover:shadow-md transform hover:scale-105"
                  >
                    <div className="flex items-start space-x-3">
                      <Package className="w-6 h-6 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Inventory Management</h4>
                        <p className="text-sm opacity-80">Manage stock levels and inventory operations</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => window.location.href = '/distribution-management'}
                    className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 transition-all duration-200 text-left hover:shadow-md transform hover:scale-105"
                  >
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-6 h-6 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Distribution Management</h4>
                        <p className="text-sm opacity-80">Manage distribution and logistics operations</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Role-Based Dashboard Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 m-4">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Role-Specific Dashboard</h2>
            <p className="text-sm text-gray-600">Your primary workspace based on {currentUser?.role.replace('_', ' ')} role</p>
          </div>
          <RoleDashboard />
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default RollingForecast;
