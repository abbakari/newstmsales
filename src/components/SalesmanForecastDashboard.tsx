import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  TrendingUp,
  Plus,
  Users,
  DollarSign,
  Eye,
  Edit,
  Truck,
  Minus,
  Save,
  X
} from 'lucide-react';
import { useRole } from '../contexts/RoleContext';

interface ForecastItem {
  id: number;
  selected: boolean;
  customer: string;
  item: string;
  category: string;
  brand: string;
  itemCombined: string;
  budget2025: number;
  ytd2025: number;
  forecast2025: number;
  stock: number;
  git: number;
  eta: string;
  monthlyUnits: { [monthIndex: number]: number };
}

const SalesmanForecastDashboard: React.FC = () => {
  const { currentUser, canCreateForecast, submitForApproval } = useRole();
  
  // Sample forecast data
  const initialData: ForecastItem[] = [
    {
      id: 1,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "BF GOODRICH TYRE 235/85R16 120/116S TL AT/TA KO2 LRERWLGO",
      category: "Tyres",
      brand: "BF Goodrich",
      itemCombined: "BF GOODRICH TYRE 235/85R16 (Tyres - BF Goodrich)",
      budget2025: 1381876,
      ytd2025: 0,
      forecast2025: 0,
      stock: 80,
      git: 0,
      eta: "",
      monthlyUnits: {}
    },
    {
      id: 2,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "BF GOODRICH TYRE 265/65R17 120/117S TL AT/TA KO2 LRERWLGO",
      category: "Tyres",
      brand: "BF Goodrich",
      itemCombined: "BF GOODRICH TYRE 265/65R17 (Tyres - BF Goodrich)",
      budget2025: 846313,
      ytd2025: 0,
      forecast2025: 0,
      stock: 7,
      git: 0,
      eta: "",
      monthlyUnits: {}
    }
  ];

  const [tableData, setTableData] = useState<ForecastItem[]>(initialData);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [editingItem, setEditingItem] = useState<ForecastItem | null>(null);
  const [forecastData, setForecastData] = useState<{[monthIndex: number]: number}>({});

  // Generate months for the year
  const getAllYearMonths = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const months = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), i, 1);
      months.push({
        short: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        full: date.toLocaleDateString('en-US', { month: 'long' }),
        index: i,
        isPast: i < currentMonth,
        isCurrent: i === currentMonth,
        isFuture: i > currentMonth
      });
    }
    return months;
  };

  const months = getAllYearMonths();

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectRow = (id: number) => {
    setTableData(prev => prev.map(item => {
      if (item.id === id) {
        const newSelected = !item.selected;
        if (newSelected) {
          showNotification(`Selected: ${item.customer} - ${item.item}`, 'success');
        }
        return { ...item, selected: newSelected };
      }
      return item;
    }));
  };

  const handleSubmitForApproval = (rowId: number) => {
    if (!canCreateForecast()) {
      showNotification('Access denied. Only salesmen can submit forecasts.', 'error');
      return;
    }

    const row = tableData.find(item => item.id === rowId);
    if (row) {
      const submissionData = {
        id: `forecast_${rowId}_${Date.now()}`,
        customerId: rowId.toString(),
        customerName: row.customer,
        item: row.item,
        forecastData: {
          budget2026: { 'DEC': 50, 'JAN': 75, 'FEB': 100 },
          totalUnits: 225,
          totalValue: 112500
        },
        submittedBy: currentUser?.name || 'Unknown'
      };

      submitForApproval(submissionData);
      showNotification(`Forecast submitted for manager approval: ${row.customer}`, 'success');
    }
  };

  if (currentUser?.role !== 'salesman') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Access denied. Salesman role required.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards Row */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Stock Card */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-green-200 p-3 rounded-full">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Stock</p>
              <p className="text-xl font-bold text-green-600">168,777 units</p>
            </div>
          </div>

          {/* GIT Card */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-red-200 p-3 rounded-full">
              <Truck className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">GIT</p>
              <p className="text-xl font-bold text-red-600">12,401 units</p>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex items-center justify-end">
            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Eye className="w-5 h-5" />
              <span>View Rolling Forecast Report</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Rolling Forecast for 2025-2026</h2>
            <div className="flex items-center gap-2">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                Customer - Item
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Addition
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            With 2025 Forecast
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Without 2025 Forecast
          </button>
          <div></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Budget 2025</div>
            <div className="text-2xl font-bold text-blue-600">$1,381,876</div>
            <div className="text-xs text-gray-500">8,821 Units</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Sales 2025</div>
            <div className="text-2xl font-bold text-orange-600">$846,313</div>
            <div className="text-xs text-gray-500">4,016 Units</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Forecast 2025</div>
            <div className="text-2xl font-bold text-blue-600">$0</div>
            <div className="text-xs text-gray-500">0 Units</div>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="border border-gray-300 rounded-lg overflow-auto max-h-96">
          <table className="min-w-[1200px] w-full bg-white border-collapse text-xs">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="w-12 p-3 text-center border-r border-gray-200">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" />
                </th>
                <th className="w-48 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Customer
                </th>
                <th className="w-96 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Item
                </th>
                <th className="w-20 p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  BUD 25
                </th>
                <th className="w-20 p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  YTD 25
                </th>
                <th className="w-24 p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  FORECAST
                </th>
                <th className="w-20 p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  STOCK
                </th>
                <th className="w-16 p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  GIT
                </th>
                <th className="w-20 p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  ETA
                </th>
                <th className="w-20 p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row) => (
                <tr key={row.id} className={`hover:bg-gray-50 ${row.selected ? 'bg-blue-50' : ''}`}>
                  <td className="p-3 border-r border-gray-200 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600 rounded"
                      checked={row.selected}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  <td className="p-3 border-r border-gray-200 text-xs">
                    <div className="text-gray-900 font-medium whitespace-nowrap">{row.customer}</div>
                  </td>
                  <td className="p-3 border-r border-gray-200 text-xs">
                    <div className="text-gray-900 whitespace-nowrap">{row.item}</div>
                  </td>
                  <td className="p-3 text-center border-r border-gray-200 text-xs text-gray-900">
                    {row.budget2025}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200 text-xs text-gray-900">
                    {row.ytd2025}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200 text-xs text-gray-900">
                    {row.forecast2025}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200 text-xs text-gray-900">
                    {row.stock}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200 text-xs text-gray-900">
                    {row.git}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200 text-xs">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setEditingItem(row);
                        setForecastData({});
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                      title="Edit forecast for this customer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecast Editing Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Forecast: {editingItem.customer}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{editingItem.item}</p>
            </div>

            <div className="p-6">
              {/* Monthly Forecast Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase border border-gray-300 min-w-[100px]">
                        MONTH
                      </th>
                      {months.map((month) => (
                        <th key={month.index} className={`p-3 text-center text-xs font-medium text-gray-500 uppercase border border-gray-300 min-w-[80px] ${
                          month.isPast ? 'bg-gray-200' :
                          month.isCurrent ? 'bg-orange-200' :
                          'bg-green-50'
                        }`}>
                          {month.short}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 font-medium text-gray-500 text-xs border border-gray-300">
                        2024
                      </td>
                      {months.map((month) => (
                        <td key={month.index} className="p-3 text-center border border-gray-300 text-xs text-gray-400">
                          0
                        </td>
                      ))}
                    </tr>

                    {/* BUD 2025 Row - Yellow background, read-only */}
                    <tr className="bg-yellow-300 text-black font-medium">
                      <td className="p-3 border border-gray-300 text-xs">
                        BUD 2025
                      </td>
                      {months.map((month) => (
                        <td key={month.index} className="p-3 text-center border border-gray-300 text-xs">
                          {/* Show existing budget values - read only */}
                          {month.index < 6 ? Math.floor(editingItem.budget2025 / 12) : 0}
                        </td>
                      ))}
                    </tr>

                    {/* ACT 2025 Row - Editable for remaining months only */}
                    <tr className="bg-blue-50">
                      <td className="p-3 font-medium text-gray-800 border border-gray-300 text-xs">
                        ACT 2025
                      </td>
                      {months.map((month) => (
                        <td key={month.index} className={`p-1 text-center border border-gray-300 ${
                          month.isPast ? 'bg-gray-100' :
                          month.isCurrent ? 'bg-orange-100' :
                          'bg-white'
                        }`}>
                          {month.isFuture ? (
                            <input
                              type="number"
                              className="w-full text-center bg-white text-gray-900 border-0 rounded p-1 text-xs"
                              placeholder="0"
                              value={forecastData[month.index] || ''}
                              onChange={(e) => setForecastData(prev => ({
                                ...prev,
                                [month.index]: parseInt(e.target.value) || 0
                              }))}
                              min="0"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">
                              {month.isPast ? '0' : '0'}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Help Text */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• <strong>BUD 2025 (Yellow):</strong> Shows existing budget values for comparison - cannot be edited</li>
                  <li>• <strong>ACT 2025 (Blue):</strong> Enter your forecast for remaining months only</li>
                  <li>• <strong>Past months:</strong> Cannot be edited (already completed)</li>
                  <li>• <strong>Future months:</strong> Enter forecast values to help with planning</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                Total Forecast: {Object.values(forecastData).reduce((sum, val) => sum + (val || 0), 0)} units
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save forecast and submit for approval
                    const totalUnits = Object.values(forecastData).reduce((sum, val) => sum + (val || 0), 0);
                    if (totalUnits > 0) {
                      handleSubmitForApproval(editingItem.id);
                      showNotification(`Forecast saved and submitted: ${totalUnits} units forecasted`, 'success');
                      setEditingItem(null);
                      setForecastData({});
                    } else {
                      showNotification('Please enter forecast values for at least one month', 'error');
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save & Submit for Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default SalesmanForecastDashboard;
