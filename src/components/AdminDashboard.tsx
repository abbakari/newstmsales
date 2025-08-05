import React, { useState } from 'react';
import { Shield, Users, Settings, BarChart3, Package, Truck } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import SalesmanForecastDashboard from './SalesmanForecastDashboard';
import ManagerApprovalDashboard from './ManagerApprovalDashboard';
import SupplyChainDashboard from './SupplyChainDashboard';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useRole();
  const [activeTab, setActiveTab] = useState<'overview' | 'salesman' | 'manager' | 'supply_chain'>('overview');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Access denied. Admin role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-600" />
            Admin Control Panel
          </h2>
          <p className="text-gray-600">Full system access and management</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          <span className="text-sm text-gray-700">{currentUser.name}</span>
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            ADMIN
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 System Overview
            </button>
            <button
              onClick={() => setActiveTab('salesman')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'salesman'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📈 Salesman View
            </button>
            <button
              onClick={() => setActiveTab('manager')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manager'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ✅ Manager View
            </button>
            <button
              onClick={() => setActiveTab('supply_chain')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'supply_chain'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🚚 Supply Chain View
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* System Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Total Forecasts</p>
                      <p className="text-2xl font-semibold text-blue-700">24</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-green-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Active Users</p>
                      <p className="text-2xl font-semibold text-green-700">4</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-orange-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-orange-600">Pending Approvals</p>
                      <p className="text-2xl font-semibold text-orange-700">3</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Truck className="w-8 h-8 text-purple-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">Processing Orders</p>
                      <p className="text-2xl font-semibold text-purple-700">1</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Overview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Workflow Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">📊 Salesmen Active</span>
                        <span className="text-sm font-medium text-blue-600">1 user</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">✅ Managers Active</span>
                        <span className="text-sm font-medium text-green-600">1 user</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">🚚 Supply Chain Active</span>
                        <span className="text-sm font-medium text-purple-600">1 user</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">🛡️ Admin Active</span>
                        <span className="text-sm font-medium text-red-600">1 user (You)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                        View All System Logs
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Manage User Permissions
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                        System Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Export All Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Access Information */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">🛡️ Admin Privileges</h4>
                <p className="text-sm text-yellow-700">
                  You have full access to all system dashboards. Use the tabs above to view each role's interface and monitor all activities.
                  As an admin, you can perform all actions available to salesmen, managers, and supply chain users.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'salesman' && (
            <div>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Viewing Salesman Dashboard:</strong> You can create forecasts, manage customers, and submit for approval.
                </p>
              </div>
              <SalesmanForecastDashboard />
            </div>
          )}

          {activeTab === 'manager' && (
            <div>
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Viewing Manager Dashboard:</strong> You can review, edit, approve, and send forecasts to supply chain.
                </p>
              </div>
              <ManagerApprovalDashboard />
            </div>
          )}

          {activeTab === 'supply_chain' && (
            <div>
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Viewing Supply Chain Dashboard:</strong> You can process approved forecasts and manage inventory operations.
                </p>
              </div>
              <SupplyChainDashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
