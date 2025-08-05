import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Send, MessageSquare, User, Calendar, Package, Edit } from 'lucide-react';
import { useRole, ForecastApproval } from '../contexts/RoleContext';

const ManagerApprovalDashboard: React.FC = () => {
  const { currentUser, pendingApprovals, approveForecast, rejectForecast, sendToSupplyChain } = useRole();
  const [selectedApproval, setSelectedApproval] = useState<ForecastApproval | null>(null);
  const [comments, setComments] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [isEditing, setIsEditing] = useState(false);
  const [editedForecastData, setEditedForecastData] = useState<any>(null);

  const filteredApprovals = pendingApprovals.filter(approval => {
    if (filter === 'all') return true;
    return approval.status === filter;
  });

  const handleApprove = (approvalId: string) => {
    // If edited, update the forecast data before approving
    if (isEditing && editedForecastData) {
      // Update the approval with edited data
      const updatedApproval = {
        ...selectedApproval!,
        forecastData: editedForecastData,
        comments: comments + ' (Updated by manager)'
      };
      approveForecast(approvalId, comments + ' (Forecast updated and approved)');
    } else {
      approveForecast(approvalId, comments);
    }
    setComments('');
    setSelectedApproval(null);
    setIsEditing(false);
    setEditedForecastData(null);
  };

  const handleReject = (approvalId: string) => {
    if (!comments.trim()) {
      alert('Please provide comments for rejection');
      return;
    }
    rejectForecast(approvalId, comments);
    setComments('');
    setSelectedApproval(null);
    setIsEditing(false);
    setEditedForecastData(null);
  };

  const handleSendToSupplyChain = (approvalId: string) => {
    sendToSupplyChain(approvalId);
    setSelectedApproval(null);
  };

  const handleEditForecast = (approval: ForecastApproval) => {
    setSelectedApproval(approval);
    setIsEditing(true);
    setEditedForecastData({ ...approval.forecastData });
  };

  const updateForecastValue = (month: string, value: number) => {
    if (editedForecastData) {
      setEditedForecastData({
        ...editedForecastData,
        budget2026: {
          ...editedForecastData.budget2026,
          [month]: value
        },
        totalUnits: Object.values({ ...editedForecastData.budget2026, [month]: value }).reduce((sum: number, val: any) => sum + (val || 0), 0),
        totalValue: Object.values({ ...editedForecastData.budget2026, [month]: value }).reduce((sum: number, val: any) => sum + (val || 0), 0) * 500 // Assuming avg price
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      sent_to_supply_chain: { color: 'bg-blue-100 text-blue-800', icon: Send }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (currentUser?.role !== 'manager') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Access denied. Manager role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manager Approval Dashboard</h2>
          <p className="text-gray-600">Review and approve forecast submissions from sales team</p>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">{currentUser.name}</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {currentUser.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {pendingApprovals.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-green-600">
                {pendingApprovals.filter(a => a.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-red-600">
                {pendingApprovals.filter(a => a.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Send className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Sent to Supply Chain</p>
              <p className="text-2xl font-semibold text-blue-600">
                {pendingApprovals.filter(a => a.status === 'sent_to_supply_chain').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'pending', label: 'Pending Review', count: pendingApprovals.filter(a => a.status === 'pending').length },
              { key: 'approved', label: 'Approved', count: pendingApprovals.filter(a => a.status === 'approved').length },
              { key: 'rejected', label: 'Rejected', count: pendingApprovals.filter(a => a.status === 'rejected').length },
              { key: 'all', label: 'All', count: pendingApprovals.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Approvals List */}
        <div className="divide-y divide-gray-200">
          {filteredApprovals.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p>No {filter === 'all' ? '' : filter} forecasts found</p>
            </div>
          ) : (
            filteredApprovals.map((approval) => (
              <div key={approval.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{approval.customerName}</h3>
                      {getStatusBadge(approval.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>{approval.item}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Submitted by: {approval.submittedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(approval.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {approval.comments && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        {approval.comments}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {approval.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setSelectedApproval(approval)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleEditForecast(approval)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit & Approve
                        </button>
                      </>
                    )}
                    
                    {approval.status === 'approved' && (
                      <button
                        onClick={() => handleSendToSupplyChain(approval.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Send className="w-4 h-4" />
                        Send to Supply Chain
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Review Forecast Submission</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-gray-900">{selectedApproval.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item</label>
                  <p className="text-gray-900">{selectedApproval.item}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                  <p className="text-gray-900">{selectedApproval.submittedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                  <p className="text-gray-900">{new Date(selectedApproval.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forecast Data {isEditing && <span className="text-orange-600">(Editing Mode)</span>}
                </label>
                {isEditing ? (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Monthly Forecast (Units)</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(editedForecastData?.budget2026 || {}).map(([month, value]: [string, any]) => (
                        <div key={month}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">{month}</label>
                          <input
                            type="number"
                            value={value || ''}
                            onChange={(e) => updateForecastValue(month, parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            min="0"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total Units:</span> {editedForecastData?.totalUnits || 0}
                        </div>
                        <div>
                          <span className="font-medium">Total Value:</span> ${(editedForecastData?.totalValue || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Units:</span> {selectedApproval.forecastData?.totalUnits || 0}
                      </div>
                      <div>
                        <span className="font-medium">Total Value:</span> ${(selectedApproval.forecastData?.totalValue || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Monthly Breakdown:</span>
                      <div className="mt-1 text-xs text-gray-600">
                        {Object.entries(selectedApproval.forecastData?.budget2026 || {}).map(([month, value]: [string, any]) =>
                          `${month}: ${value} units`
                        ).join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add your comments..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setSelectedApproval(null);
                  setIsEditing(false);
                  setEditedForecastData(null);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedForecastData(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel Edit
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApproval.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Update & Approve
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedForecastData({ ...selectedApproval.forecastData });
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Forecast
                  </button>
                  <button
                    onClick={() => handleReject(selectedApproval.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApproval.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerApprovalDashboard;
