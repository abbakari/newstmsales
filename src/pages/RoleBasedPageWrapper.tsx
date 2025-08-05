import React from 'react';
import { useRole } from '../contexts/RoleContext';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { AlertTriangle, ArrowLeft, Settings, BarChart3, Users, Database, Package, TrendingUp } from 'lucide-react';

interface RoleBasedPageWrapperProps {
  pageName: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: ('admin' | 'manager' | 'supply_chain' | 'salesman')[];
}

const RoleBasedPageWrapper: React.FC<RoleBasedPageWrapperProps> = ({ 
  pageName, 
  description, 
  icon: IconComponent,
  requiredRoles = ['admin', 'manager', 'supply_chain', 'salesman']
}) => {
  const { currentUser } = useRole();

  // Redirect to login if no user
  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  const hasAccess = requiredRoles.includes(currentUser.role);

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconComponent className="w-8 h-8 text-gray-600" />
            <div>
              <h4 className="text-2xl font-bold text-gray-900">{pageName}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.href = '/rolling-forecast'}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Access Control */}
        {!hasAccess ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Access Denied</h3>
                <p className="text-red-700 mt-1">
                  Your role ({currentUser.role.replace('_', ' ').toUpperCase()}) does not have permission to access {pageName}.
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Required roles: {requiredRoles.map(role => role.replace('_', ' ').toUpperCase()).join(', ')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Page Under Development</h3>
                <p className="text-yellow-700 mt-1">
                  The {pageName} page is being updated to work with the new role-based authentication system.
                </p>
                <div className="mt-4">
                  <p className="text-sm text-yellow-700 mb-2">In the meantime, you can:</p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    <li>Use the Sales Budget page for comprehensive budget management</li>
                    <li>Access BI Analytics for advanced reporting and insights</li>
                    <li>Return to your role-specific dashboard for main functionality</li>
                  </ul>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => window.location.href = '/sales-budget'}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Go to Sales Budget
                  </button>
                  <button
                    onClick={() => window.location.href = '/bi-dashboard'}
                    className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    Go to BI Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current User Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-md font-semibold text-gray-900 mb-2">Current Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">User:</span>
              <span className="ml-2 font-medium text-gray-900">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Role:</span>
              <span className="ml-2 font-medium text-gray-900">{currentUser.role.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div>
              <span className="text-gray-600">Department:</span>
              <span className="ml-2 font-medium text-gray-900">{currentUser.department}</span>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

// Specific page components
export const BiDashboardWrapper: React.FC = () => (
  <RoleBasedPageWrapper
    pageName="BI Analytics Dashboard"
    description="Advanced business intelligence and analytics"
    icon={BarChart3}
    requiredRoles={['admin', 'manager', 'supply_chain', 'salesman']}
  />
);

export const UserManagementWrapper: React.FC = () => (
  <RoleBasedPageWrapper
    pageName="User Management"
    description="Manage system users and permissions"
    icon={Users}
    requiredRoles={['admin']}
  />
);

export const DataSourcesWrapper: React.FC = () => (
  <RoleBasedPageWrapper
    pageName="Data Sources"
    description="Configure system data connections"
    icon={Database}
    requiredRoles={['admin']}
  />
);

export const InventoryManagementWrapper: React.FC = () => (
  <RoleBasedPageWrapper
    pageName="Inventory Management"
    description="Manage stock levels and inventory operations"
    icon={Package}
    requiredRoles={['admin', 'supply_chain']}
  />
);

export const DistributionManagementWrapper: React.FC = () => (
  <RoleBasedPageWrapper
    pageName="Distribution Management"
    description="Manage distribution and logistics operations"
    icon={TrendingUp}
    requiredRoles={['admin', 'supply_chain']}
  />
);

export default RoleBasedPageWrapper;
