import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'salesman' | 'manager' | 'supply_chain';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  permissions: string[];
}

export interface ForecastApproval {
  id: string;
  forecastId: string;
  customerId: string;
  customerName: string;
  item: string;
  forecastData: any;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent_to_supply_chain';
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}

interface RoleContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
  
  // Approval workflow
  pendingApprovals: ForecastApproval[];
  submitForApproval: (forecastData: any) => void;
  approveForecast: (approvalId: string, comments?: string) => void;
  rejectForecast: (approvalId: string, comments: string) => void;
  sendToSupplyChain: (approvalId: string) => void;
  
  // Permissions
  canCreateForecast: () => boolean;
  canApproveForecast: () => boolean;
  canAccessSupplyChain: () => boolean;
  canEditBudget: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Sample users for different roles
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Salesman',
    email: 'salesman@company.com',
    role: 'salesman',
    department: 'Sales',
    permissions: ['create_forecast', 'edit_budget', 'view_customers', 'manage_customers']
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@company.com',
    role: 'manager',
    department: 'Management',
    permissions: ['approve_forecast', 'view_all_forecasts', 'edit_approved_forecast', 'manage_team']
  },
  {
    id: '3',
    name: 'Mike Supply Chain',
    email: 'supply@company.com',
    role: 'supply_chain',
    department: 'Supply Chain',
    permissions: ['process_approved_forecasts', 'manage_inventory', 'procurement']
  }
];

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<ForecastApproval[]>([]);

  // Initialize with demo user (salesman by default)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      setCurrentUser(sampleUsers[0]); // Default to salesman
    }

    // Load pending approvals
    const savedApprovals = localStorage.getItem('pendingApprovals');
    if (savedApprovals) {
      setPendingApprovals(JSON.parse(savedApprovals));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login - in real app this would call an API
    const user = sampleUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const switchRole = (role: UserRole) => {
    const user = sampleUsers.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  };

  const submitForApproval = (forecastData: any) => {
    const approval: ForecastApproval = {
      id: `approval_${Date.now()}`,
      forecastId: forecastData.id,
      customerId: forecastData.customerId,
      customerName: forecastData.customerName,
      item: forecastData.item,
      forecastData,
      submittedBy: currentUser?.name || 'Unknown',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    const updatedApprovals = [...pendingApprovals, approval];
    setPendingApprovals(updatedApprovals);
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedApprovals));
  };

  const approveForecast = (approvalId: string, comments?: string) => {
    const updatedApprovals = pendingApprovals.map(approval =>
      approval.id === approvalId
        ? {
            ...approval,
            status: 'approved' as const,
            reviewedBy: currentUser?.name,
            reviewedAt: new Date().toISOString(),
            comments
          }
        : approval
    );
    setPendingApprovals(updatedApprovals);
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedApprovals));
  };

  const rejectForecast = (approvalId: string, comments: string) => {
    const updatedApprovals = pendingApprovals.map(approval =>
      approval.id === approvalId
        ? {
            ...approval,
            status: 'rejected' as const,
            reviewedBy: currentUser?.name,
            reviewedAt: new Date().toISOString(),
            comments
          }
        : approval
    );
    setPendingApprovals(updatedApprovals);
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedApprovals));
  };

  const sendToSupplyChain = (approvalId: string) => {
    const updatedApprovals = pendingApprovals.map(approval =>
      approval.id === approvalId
        ? {
            ...approval,
            status: 'sent_to_supply_chain' as const,
            reviewedBy: currentUser?.name,
            reviewedAt: new Date().toISOString()
          }
        : approval
    );
    setPendingApprovals(updatedApprovals);
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedApprovals));
  };

  // Permission checks
  const canCreateForecast = () => currentUser?.permissions.includes('create_forecast') || false;
  const canApproveForecast = () => currentUser?.permissions.includes('approve_forecast') || false;
  const canAccessSupplyChain = () => currentUser?.permissions.includes('process_approved_forecasts') || false;
  const canEditBudget = () => currentUser?.permissions.includes('edit_budget') || false;

  const value: RoleContextType = {
    currentUser,
    login,
    logout,
    switchRole,
    pendingApprovals,
    submitForApproval,
    approveForecast,
    rejectForecast,
    sendToSupplyChain,
    canCreateForecast,
    canApproveForecast,
    canAccessSupplyChain,
    canEditBudget
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
