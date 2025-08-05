import React, { useState } from 'react';
import { Package, CheckCircle, Clock, Truck, AlertTriangle, Calendar, User, FileText } from 'lucide-react';
import { useRole, ForecastApproval } from '../contexts/RoleContext';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  completedAt?: string;
}

interface SupplyChainTask {
  id: string;
  approval: ForecastApproval;
  processingSteps: ProcessingStep[];
  priority: 'low' | 'medium' | 'high';
  estimatedDelivery?: string;
  notes: string;
}

const SupplyChainDashboard: React.FC = () => {
  const { currentUser, pendingApprovals } = useRole();
  const [tasks, setTasks] = useState<SupplyChainTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<SupplyChainTask | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('pending');

  // Get approved forecasts that have been sent to supply chain
  const supplyChainApprovals = pendingApprovals.filter(approval => 
    approval.status === 'sent_to_supply_chain'
  );

  // Initialize tasks from supply chain approvals
  React.useEffect(() => {
    const initialTasks: SupplyChainTask[] = supplyChainApprovals.map(approval => ({
      id: `task_${approval.id}`,
      approval,
      priority: 'medium',
      notes: '',
      processingSteps: [
        { id: '1', name: 'Inventory Assessment', status: 'pending' },
        { id: '2', name: 'Supplier Coordination', status: 'pending' },
        { id: '3', name: 'Procurement Planning', status: 'pending' },
        { id: '4', name: 'Delivery Scheduling', status: 'pending' },
        { id: '5', name: 'Quality Control', status: 'pending' }
      ]
    }));
    setTasks(prev => {
      // Only add new tasks, don't replace existing ones
      const existingIds = prev.map(t => t.approval.id);
      const newTasks = initialTasks.filter(t => !existingIds.includes(t.approval.id));
      return [...prev, ...newTasks];
    });
  }, [supplyChainApprovals]);

  const updateProcessingStep = (taskId: string, stepId: string, status: ProcessingStep['status']) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          processingSteps: task.processingSteps.map(step => 
            step.id === stepId 
              ? { 
                  ...step, 
                  status, 
                  completedAt: status === 'completed' ? new Date().toISOString() : undefined,
                  assignedTo: status === 'in_progress' ? currentUser?.name : step.assignedTo
                }
              : step
          )
        };
      }
      return task;
    }));
  };

  const updateTaskPriority = (taskId: string, priority: SupplyChainTask['priority']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, priority } : task
    ));
  };

  const addTaskNotes = (taskId: string, notes: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, notes } : task
    ));
  };

  const getTaskStatus = (task: SupplyChainTask) => {
    const completedSteps = task.processingSteps.filter(step => step.status === 'completed').length;
    const inProgressSteps = task.processingSteps.filter(step => step.status === 'in_progress').length;
    
    if (completedSteps === task.processingSteps.length) return 'completed';
    if (inProgressSteps > 0 || completedSteps > 0) return 'in_progress';
    return 'pending';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return getTaskStatus(task) === filter;
  });

  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <div className="w-4 h-4 border border-gray-300 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: SupplyChainTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  if (currentUser?.role !== 'supply_chain') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Access denied. Supply Chain role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supply Chain Processing Dashboard</h2>
          <p className="text-gray-600">Process approved forecasts and manage inventory operations</p>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">{currentUser.name}</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            {currentUser.role.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {tasks.filter(task => getTaskStatus(task) === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-blue-600">
                {tasks.filter(task => getTaskStatus(task) === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-green-600">
                {tasks.filter(task => getTaskStatus(task) === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-purple-600">{tasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'pending', label: 'Pending', count: tasks.filter(task => getTaskStatus(task) === 'pending').length },
              { key: 'in_progress', label: 'In Progress', count: tasks.filter(task => getTaskStatus(task) === 'in_progress').length },
              { key: 'completed', label: 'Completed', count: tasks.filter(task => getTaskStatus(task) === 'completed').length },
              { key: 'all', label: 'All Tasks', count: tasks.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Tasks List */}
        <div className="divide-y divide-gray-200">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p>No {filter === 'all' ? '' : filter} tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-900">{task.approval.customerName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={task.priority}
                      onChange={(e) => updateTaskPriority(task.id, e.target.value as SupplyChainTask['priority'])}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Process
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4" />
                      <span>{task.approval.item}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Received: {new Date(task.approval.reviewedAt || task.approval.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Processing Progress:</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {task.processingSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          {getStepIcon(step.status)}
                          {index < task.processingSteps.length - 1 && (
                            <div className="w-4 h-0.5 bg-gray-200 mx-1" />
                          )}
                        </div>
                      ))}
                      <span className="ml-2 text-xs text-gray-500">
                        {task.processingSteps.filter(s => s.status === 'completed').length}/{task.processingSteps.length}
                      </span>
                    </div>
                  </div>
                </div>

                {task.notes && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {task.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Processing Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Process Task: {selectedTask.approval.customerName}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Task Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-gray-900">{selectedTask.approval.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item</label>
                  <p className="text-gray-900">{selectedTask.approval.item}</p>
                </div>
              </div>

              {/* Processing Steps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Processing Steps</label>
                <div className="space-y-3">
                  {selectedTask.processingSteps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStepIcon(step.status)}
                        <span className="font-medium">{step.name}</span>
                        {step.assignedTo && (
                          <span className="text-xs text-gray-500">({step.assignedTo})</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {step.status !== 'completed' && (
                          <>
                            <button
                              onClick={() => updateProcessingStep(selectedTask.id, step.id, 'in_progress')}
                              disabled={step.status === 'in_progress'}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 disabled:opacity-50"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => updateProcessingStep(selectedTask.id, step.id, 'completed')}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                            >
                              Complete
                            </button>
                          </>
                        )}
                        {step.completedAt && (
                          <span className="text-xs text-gray-500">
                            Completed: {new Date(step.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Processing Notes</label>
                <textarea
                  value={selectedTask.notes}
                  onChange={(e) => addTaskNotes(selectedTask.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Add processing notes, delivery updates, etc..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChainDashboard;
