import React from 'react';
import { useRole } from '../contexts/RoleContext';
import RoleBasedLayout from '../components/RoleBasedLayout';
import StatsCard from '../components/StatsCard';
import { PieChartIcon, TrendingUp, Clock, Download, RefreshCw, BarChart3, Target, AlertTriangle, Users, Package, MapPin, Building } from 'lucide-react';

const DashboardRoleWrapper: React.FC = () => {
  const { currentUser } = useRole();

  // Redirect to login if no user
  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  // Role-specific stats data
  const getStatsData = () => {
    if (currentUser.role === 'admin') {
      return [
        {
          title: 'Total System Users',
          value: '24',
          subtitle: 'Active users',
          icon: Users,
          color: 'primary' as const,
          trend: { value: '+3 new', isPositive: true }
        },
        {
          title: 'Total Sales',
          value: '$2.4M',
          subtitle: 'All regions',
          icon: TrendingUp,
          color: 'success' as const,
          trend: { value: '+18.2%', isPositive: true }
        },
        {
          title: 'System Performance',
          value: '99.2%',
          subtitle: 'Uptime',
          icon: Target,
          color: 'info' as const,
          trend: { value: '+0.1%', isPositive: true }
        },
        {
          title: 'Budget Utilization',
          value: '87%',
          subtitle: 'Organization wide',
          icon: BarChart3,
          color: 'warning' as const,
          trend: { value: '+5%', isPositive: true }
        }
      ];
    } else if (currentUser.role === 'salesman') {
      return [
        {
          title: 'My Sales',
          value: '$156K',
          subtitle: 'This month',
          icon: TrendingUp,
          color: 'primary' as const,
          trend: { value: '+12.5%', isPositive: true }
        },
        {
          title: 'My Target',
          value: '87%',
          subtitle: 'Achievement',
          icon: Target,
          color: 'success' as const,
          trend: { value: '+5%', isPositive: true }
        },
        {
          title: 'My Budget',
          value: '$45K',
          subtitle: 'Remaining',
          icon: PieChartIcon,
          color: 'info' as const,
          trend: { value: '-$12K', isPositive: false }
        },
        {
          title: 'Forecast Accuracy',
          value: '94%',
          subtitle: 'Last quarter',
          icon: BarChart3,
          color: 'warning' as const,
          trend: { value: '+2%', isPositive: true }
        }
      ];
    } else if (currentUser.role === 'manager') {
      return [
        {
          title: 'Department Sales',
          value: '$850K',
          subtitle: currentUser.department || 'Department',
          icon: Building,
          color: 'primary' as const,
          trend: { value: '+15%', isPositive: true }
        },
        {
          title: 'Team Performance',
          value: '91%',
          subtitle: 'Average achievement',
          icon: Users,
          color: 'success' as const,
          trend: { value: '+8%', isPositive: true }
        },
        {
          title: 'Department Budget',
          value: '$245K',
          subtitle: 'Utilized',
          icon: PieChartIcon,
          color: 'info' as const,
          trend: { value: '73%', isPositive: true }
        },
        {
          title: 'Active Forecasts',
          value: '18',
          subtitle: 'This quarter',
          icon: BarChart3,
          color: 'warning' as const,
          trend: { value: '+3', isPositive: true }
        }
      ];
    } else if (currentUser.role === 'supply_chain') {
      return [
        {
          title: 'Inventory Value',
          value: '$1.2M',
          subtitle: 'Current stock',
          icon: Package,
          color: 'primary' as const,
          trend: { value: '+5%', isPositive: true }
        },
        {
          title: 'Stock Accuracy',
          value: '98.5%',
          subtitle: 'System vs actual',
          icon: Target,
          color: 'success' as const,
          trend: { value: '+1.2%', isPositive: true }
        },
        {
          title: 'Orders Processed',
          value: '1,247',
          subtitle: 'This month',
          icon: TrendingUp,
          color: 'info' as const,
          trend: { value: '+156', isPositive: true }
        },
        {
          title: 'Low Stock Items',
          value: '23',
          subtitle: 'Need attention',
          icon: AlertTriangle,
          color: 'warning' as const,
          trend: { value: '-5', isPositive: true }
        }
      ];
    }
    
    // Default stats
    return [
      {
        title: 'Total Budget Units',
        value: '5,042',
        subtitle: 'As of current year',
        icon: PieChartIcon,
        color: 'primary' as const,
        trend: { value: '+12.5%', isPositive: true }
      },
      {
        title: 'Total Sales',
        value: '$2.4M',
        subtitle: 'Current performance',
        icon: TrendingUp,
        color: 'success' as const,
        trend: { value: '+18.2%', isPositive: true }
      },
      {
        title: 'Target Achievement',
        value: '87%',
        subtitle: 'Monthly progress',
        icon: Target,
        color: 'warning' as const,
        trend: { value: '+5.3%', isPositive: true }
      },
      {
        title: 'Active Users',
        value: '45',
        subtitle: 'System users',
        icon: Clock,
        color: 'info' as const,
        trend: { value: '+2', isPositive: true }
      }
    ];
  };

  const statsData = getStatsData();

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-gray-500 font-light">Legacy Dashboard /</span> {currentUser.role.replace('_', ' ').toUpperCase()}
            </h4>
            <p className="text-sm text-gray-600">
              Welcome back, {currentUser.name}! This is the legacy dashboard system.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.href = '/rolling-forecast'}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <span>Return to Main Dashboard</span>
            </button>
          </div>
        </div>

        {/* User Role Badge */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                currentUser.role === 'admin' ? 'bg-red-100' :
                currentUser.role === 'salesman' ? 'bg-green-100' :
                currentUser.role === 'manager' ? 'bg-blue-100' :
                'bg-purple-100'
              }`}>
                <Users className={`w-5 h-5 ${
                  currentUser.role === 'admin' ? 'text-red-600' :
                  currentUser.role === 'salesman' ? 'text-green-600' :
                  currentUser.role === 'manager' ? 'text-blue-600' :
                  'text-purple-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentUser.role.replace('_', ' ').toUpperCase()} Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Department: {currentUser.department}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Access Level</p>
              <p className="font-semibold text-gray-900">Role-Based</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsData.map((stat, index) => (
            <div key={index} className="col-span-1">
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Info Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Legacy Dashboard</h3>
              <p className="text-sm text-yellow-700 mt-1">
                This is the legacy dashboard system adapted for role-based access. 
                For the full experience, please use the main dashboard navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default DashboardRoleWrapper;
