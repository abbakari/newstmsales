import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Target, 
  AlertCircle, 
  Plus, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Upload,
  Bell,
  ChevronDown,
  RotateCcw,
  Info as InfoIcon,
  Download as DownloadIcon,
  PieChart,
  MoreVertical,
  Check,
  ChevronUp,
  Truck,
  Home,
  Grid,
  Minus,
  Save
} from 'lucide-react';
import CustomerForecastModal from '../components/CustomerForecastModal';
import { Customer, Item, CustomerItemForecast, ForecastFormData, MonthlyForecast } from '../types/forecast';
import { formatCurrency, formatPercentage } from '../utils/budgetCalculations';

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

const RollingForecast: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedYear2025, setSelectedYear2025] = useState('2025');
  const [selectedYear2026, setSelectedYear2026] = useState('2026');
  const [activeView, setActiveView] = useState('forecast-planning');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // Modal states
  const [isForecastModalOpen, setIsForecastModalOpen] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // GIT explanation state
  const [showGitExplanation, setShowGitExplanation] = useState(false);

  // Monthly editing state
  const [editingMonthlyData, setEditingMonthlyData] = useState<{[key: number]: MonthlyForecast[]}>({});

  // Generate all months for the year with current month tracking
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
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  // Sample forecast data matching the uploaded images
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
      ytd2025: 8821,
      forecast2025: 0,
      stock: 0,
      git: 80,
      eta: "2024-12-15",
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
      ytd2025: 4016,
      forecast2025: 0,
      stock: 0,
      git: 7,
      eta: "2024-12-20",
      monthlyUnits: {}
    },
    {
      id: 3,
      selected: false,
      customer: "Zoya Enterprises",
      item: "BF GOODRICH TYRE LT235/75R15 104/105S TL ALL-TERRAIN T/A KO2 LRC",
      category: "Tyres",
      brand: "BF Goodrich",
      itemCombined: "BF GOODRICH TYRE LT235/75R15 (Tyres - BF Goodrich)",
      budget2025: 245000,
      ytd2025: 1250,
      forecast2025: 0,
      stock: 0,
      git: 9,
      eta: "2024-12-18",
      monthlyUnits: {}
    },
    {
      id: 4,
      selected: false,
      customer: "Zoya Enterprises",
      item: "BF GOODRICH TYRE 235/85R16 120/116S TL AT/TA KO2 LRERWLGO",
      category: "Tyres",
      brand: "BF Goodrich",
      itemCombined: "BF GOODRICH TYRE 235/85R16 (Tyres - BF Goodrich)",
      budget2025: 186000,
      ytd2025: 980,
      forecast2025: 0,
      stock: 0,
      git: 10,
      eta: "2024-12-22",
      monthlyUnits: {}
    },
    {
      id: 5,
      selected: false,
      customer: "Zoya Enterprises",
      item: "BF GOODRICH TYRE 265/65R18 119/116S TL AT/TA KO2 LRERWLGO",
      category: "Tyres",
      brand: "BF Goodrich",
      itemCombined: "BF GOODRICH TYRE 265/65R18 (Tyres - BF Goodrich)",
      budget2025: 156000,
      ytd2025: 870,
      forecast2025: 0,
      stock: 0,
      git: 44,
      eta: "2024-12-25",
      monthlyUnits: {}
    },
    {
      id: 6,
      selected: false,
      customer: "Zoya Enterprises",
      item: "MICHELIN TYRE 265/65R17 112T TL LTX TRAIL",
      category: "Tyres",
      brand: "Michelin",
      itemCombined: "MICHELIN TYRE 265/65R17 (Tyres - Michelin)",
      budget2025: 125000,
      ytd2025: 650,
      forecast2025: 0,
      stock: 0,
      git: 103,
      eta: "2025-01-05",
      monthlyUnits: {}
    }
  ];

  const [originalTableData, setOriginalTableData] = useState<ForecastItem[]>(initialData);
  const [tableData, setTableData] = useState<ForecastItem[]>(initialData);

  // Save forecast data to localStorage
  useEffect(() => {
    localStorage.setItem('rollingForecastData', JSON.stringify(tableData));
  }, [tableData]);

  // Apply filters
  useEffect(() => {
    const filteredData = originalTableData.filter(item => {
      const matchesCustomer = !selectedCustomer || item.customer.toLowerCase().includes(selectedCustomer.toLowerCase());
      const matchesCategory = !selectedCategory || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesBrand = !selectedBrand || item.brand.toLowerCase().includes(selectedBrand.toLowerCase());
      const matchesItem = !selectedItem || item.item.toLowerCase().includes(selectedItem.toLowerCase());
      return matchesCustomer && matchesCategory && matchesBrand && matchesItem;
    });
    setTableData(filteredData);
  }, [selectedCustomer, selectedCategory, selectedBrand, selectedItem, originalTableData]);

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

  const handleSelectAll = () => {
    const allSelected = tableData.every(item => item.selected);
    const newState = !allSelected;
    setTableData(prev => prev.map(item => ({ ...item, selected: newState })));
    showNotification(newState ? `Selected all ${tableData.length} items` : 'Deselected all items', 'success');
  };

  const handleUpdateMonthlyUnits = (rowId: number, monthIndex: number, value: number) => {
    setTableData(prev => prev.map(item =>
      item.id === rowId ? {
        ...item,
        monthlyUnits: { ...item.monthlyUnits, [monthIndex]: value },
        forecast2025: Object.values({ ...item.monthlyUnits, [monthIndex]: value }).reduce((sum, units) => sum + (units || 0), 0)
      } : item
    ));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadForecast = () => {
    const fileName = `rolling_forecast_${selectedYear2026}.csv`;
    showNotification(`Preparing download for ${selectedYear2026}...`, 'success');

    // Prepare export data
    const exportData = tableData.map(item => ({
      customer: item.customer,
      item: item.item,
      category: item.category,
      brand: item.brand,
      [`forecast_${selectedYear2025}`]: item.forecast2025,
      [`actual_${selectedYear2025}`]: item.actual2025,
      [`forecast_${selectedYear2026}`]: item.forecast2026,
      rate: item.rate,
      stock: item.stock,
      git: item.git,
      forecastValue2026: item.forecastValue2026,
      discount: item.discount
    }));

    // Convert to CSV
    const csvHeaders = Object.keys(exportData[0] || {}).join(',');
    const csvRows = exportData.map(row =>
      Object.values(row).map(value =>
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    const downloadContent = [csvHeaders, ...csvRows].join('\n');

    // Create and trigger download
    const blob = new Blob([downloadContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`Download completed: ${fileName}`, 'success');
  };

  // Calculate totals
  const totalBudget2025 = tableData.reduce((sum, item) => sum + item.budget2025, 0);
  const totalYTD2025 = tableData.reduce((sum, item) => sum + item.ytd2025, 0);
  const totalForecast2025 = tableData.reduce((sum, item) => sum + item.forecast2025, 0);
  const totalStock = tableData.reduce((sum, item) => sum + item.stock, 0);
  const totalGIT = tableData.reduce((sum, item) => sum + item.git, 0);
  const totalMonthlyForecast = tableData.reduce((sum, item) =>
    sum + Object.values(item.monthlyUnits).reduce((monthSum, units) => monthSum + (units || 0), 0), 0
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Header Section */}
        <div className="bg-gray-900 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 px-3 py-1 rounded font-bold text-sm">SUPERDOLL</div>
              <h1 className="text-lg font-semibold">Sales Budgeting & Rolling Forecast</h1>
            </div>
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5" />
              <Bell className="w-5 h-5" />
              <div className="bg-gray-700 px-3 py-1 rounded text-sm">MARIAM SHAYO</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home className="w-4 h-4" />
              <span>Dashboards</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Rolling Forecast
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 m-4 overflow-hidden">
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
                  <p className="text-xl font-bold text-green-600">
                    {totalStock.toLocaleString()} units
                  </p>
                </div>
              </div>

              {/* Total Sales Card */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 relative">
                <div className="bg-red-200 p-3 rounded-full">
                  <Target className="w-7 h-7 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Total Sales</p>
                  </div>
                  <p className="text-xl font-bold text-red-600">
                    {totalGIT.toLocaleString()} units
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex items-center justify-end">
                <button
                  onClick={handleDownloadForecast}
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95"
                  title="View Rolling Forecast Report"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Rolling Forecast Report</span>
                </button>
              </div>
            </div>

            {/* Rolling Forecast Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Rolling Forecast for 2025-2026</h2>
              <div className="bg-blue-50 border-l-4 border-blue-600 text-blue-800 p-4 rounded-r-lg flex items-center gap-2">
                <InfoIcon className="w-5 h-5" />
                <div>
                  <p className="font-bold">Instructions: Select a row to open monthly forecast forms</p>
                  <p className="text-xs text-blue-700 mt-1">💡 Simplified layout shows months and forecast values for easy entry and forecast planning</p>
                </div>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              {/* Customer Filter */}
              <div className={`bg-white p-3 rounded-lg shadow-sm border-2 transition-all duration-200 ${
                selectedCustomer ? 'border-blue-400 bg-blue-50' : 'border-yellow-400'
              }`}>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  👤 CUSTOMER:
                  {selectedCustomer && <span className="text-blue-600">✓</span>}
                </label>
                <select
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  value={selectedCustomer}
                  onChange={(e) => {
                    setSelectedCustomer(e.target.value);
                    if (e.target.value) showNotification(`Filtered by customer: ${e.target.value}`, 'success');
                  }}
                >
                  <option value="">Select customer</option>
                  <option value="Action Aid International (Tz)">Action Aid International (Tz)</option>
                  <option value="European Systems Ltd">European Systems Ltd</option>
                  <option value="Asia Pacific Trading">Asia Pacific Trading</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className={`bg-white p-3 rounded-lg shadow-sm border-2 transition-all duration-200 ${
                selectedCategory ? 'border-green-400 bg-green-50' : 'border-yellow-400'
              }`}>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  📦 CATEGORY:
                  {selectedCategory && <span className="text-green-600">✓</span>}
                </label>
                <select
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (e.target.value) showNotification(`Filtered by category: ${e.target.value}`, 'success');
                  }}
                >
                  <option value="">Select category</option>
                  <option value="Tyres">Tyres</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Brand Filter */}
              <div className={`bg-white p-3 rounded-lg shadow-sm border-2 transition-all duration-200 ${
                selectedBrand ? 'border-purple-400 bg-purple-50' : 'border-yellow-400'
              }`}>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  🏷️ BRAND:
                  {selectedBrand && <span className="text-purple-600">✓</span>}
                </label>
                <select
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    if (e.target.value) showNotification(`Filtered by brand: ${e.target.value}`, 'success');
                  }}
                >
                  <option value="">Select brand</option>
                  <option value="BF Goodrich">BF Goodrich</option>
                  <option value="Michelin">Michelin</option>
                  <option value="Generic">Generic</option>
                </select>
              </div>

              {/* Item Filter */}
              <div className={`bg-white p-3 rounded-lg shadow-sm border-2 transition-all duration-200 ${
                selectedItem ? 'border-orange-400 bg-orange-50' : 'border-yellow-400'
              }`}>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  �� ITEM:
                  {selectedItem && <span className="text-orange-600">✓</span>}
                </label>
                <select
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  value={selectedItem}
                  onChange={(e) => {
                    setSelectedItem(e.target.value);
                    if (e.target.value) showNotification(`Filtered by item: ${e.target.value}`, 'success');
                  }}
                >
                  <option value="">Select item</option>
                  <option value="BF GOODRICH TYRE 235/85R16">BF GOODRICH TYRE 235/85R16</option>
                  <option value="BF GOODRICH TYRE 265/65R17">BF GOODRICH TYRE 265/65R17</option>
                  <option value="VALVE 0214 TR 414J">VALVE 0214 TR 414J</option>
                  <option value="MICHELIN TYRE 265/65R17">MICHELIN TYRE 265/65R17</option>
                </select>
              </div>

              {/* Year Selectors */}
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-indigo-400">
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  📅 YEARS:
                </label>
                <div className="flex gap-1">
                  <select
                    className="w-full text-xs p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    value={selectedYear2025}
                    onChange={(e) => {
                      setSelectedYear2025(e.target.value);
                      showNotification(`Changed base year to ${e.target.value}`, 'success');
                    }}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                  <select
                    className="w-full text-xs p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    value={selectedYear2026}
                    onChange={(e) => {
                      setSelectedYear2026(e.target.value);
                      showNotification(`Changed target year to ${e.target.value}`, 'success');
                    }}
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setIsForecastModalOpen(true)}
                    className="bg-green-600 text-white font-semibold px-2 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-green-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="Create new rolling forecast"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Forecast</span>
                  </button>
                  <button
                    onClick={() => showNotification('Analytics feature coming soon', 'success')}
                    className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-blue-200 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="View forecast analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Budget 2025 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Budget 2025</div>
                <div className="text-2xl font-bold text-blue-600">${(totalBudget2025/1000000).toFixed(2)}M</div>
                <div className="text-xs text-gray-500">{(totalBudget2025/1000).toLocaleString()} Units</div>
              </div>

              {/* Sales 2025 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Sales 2025</div>
                <div className="text-2xl font-bold text-green-600">${(totalYTD2025/1000).toFixed(0)}K</div>
                <div className="text-xs text-gray-500">{totalYTD2025.toLocaleString()} Units</div>
              </div>

              {/* Forecast 2025 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Forecast 2025</div>
                <div className="text-2xl font-bold text-purple-600">${totalMonthlyForecast.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{totalMonthlyForecast} Units</div>
              </div>
            </div>

            {/* Data Table with Monthly Columns */}
            <div className="relative">
              {tableData.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border border-gray-300 rounded-lg bg-white">
                  <p className="text-lg">No data available with current filters</p>
                  <p className="text-sm">Try adjusting your filter criteria or clear the filters</p>
                  <button
                    onClick={() => {
                      setSelectedCustomer('');
                      setSelectedCategory('');
                      setSelectedBrand('');
                      setSelectedItem('');
                      showNotification('All filters cleared', 'success');
                    }}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg overflow-auto">
                  <table className="w-full bg-white border-collapse text-xs">
                    {/* Multi-level Header */}
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      {/* Row 1: Main headers */}
                      <tr className="border-b border-gray-300">
                        <th rowSpan={2} className="w-32 p-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                          Customer
                        </th>
                        <th rowSpan={2} className="w-80 p-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                          Item
                        </th>
                        <th className="w-16 p-1 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                          BUD<br/>25
                        </th>
                        <th className="w-16 p-1 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                          YTD<br/>25
                        </th>
                        <th className="w-20 p-1 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                          FORECAST
                        </th>
                        <th className="w-16 p-1 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                          STOCK
                        </th>
                        <th className="w-16 p-1 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                          GIT
                        </th>
                        <th className="w-16 p-1 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                          ETA
                        </th>
                        {months.map((month, index) => (
                          <th key={index} className={`w-12 p-1 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-300 ${
                            month.isPast ? 'bg-gray-200' :
                            month.isCurrent ? 'bg-orange-300' :
                            'bg-green-50'
                          }`}>
                            {month.short}
                          </th>
                        ))}
                      </tr>
                      {/* Row 2: Sub headers and month year labels */}
                      <tr className="border-b border-gray-300">
                        <td className="p-1 text-center text-xs text-gray-500 border-r border-gray-300">25</td>
                        <td className="p-1 text-center text-xs text-gray-500 border-r border-gray-300">25</td>
                        <td className="p-1 text-center text-xs text-gray-500 border-r border-gray-300">26</td>
                        <td className="p-1 text-center text-xs text-gray-500 border-r border-gray-300"></td>
                        <td className="p-1 text-center text-xs text-gray-500 border-r border-gray-300"></td>
                        <td className="p-1 text-center text-xs text-gray-500 border-r border-gray-300"></td>
                        {months.map((month, index) => (
                          <td key={index} className={`p-1 text-center text-xs text-gray-500 border-r border-gray-300 ${
                            month.isPast ? 'bg-gray-200' :
                            month.isCurrent ? 'bg-orange-300' :
                            'bg-green-50'
                          }`}>
                            2024
                          </td>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {/* Budget Row (Orange highlighted) */}
                      <tr className="bg-orange-400 text-white font-semibold">
                        <td className="p-2 border-r border-gray-300">BUD 2026</td>
                        <td className="p-2 border-r border-gray-300"></td>
                        <td className="p-1 text-center border-r border-gray-300"></td>
                        <td className="p-1 text-center border-r border-gray-300"></td>
                        <td className="p-1 text-center border-r border-gray-300"></td>
                        <td className="p-1 text-center border-r border-gray-300"></td>
                        <td className="p-1 text-center border-r border-gray-300"></td>
                        <td className="p-1 text-center border-r border-gray-300"></td>
                        {months.map((month, index) => (
                          <td key={index} className="p-1 text-center border-r border-gray-300">
                            {/* Budget values could be added here */}
                          </td>
                        ))}
                      </tr>

                      {/* ACT 2026 Row */}
                      <tr className="bg-blue-100">
                        <td className="p-2 border-r border-gray-300 font-medium">ACT 2026</td>
                        <td className="p-2 border-r border-gray-300"></td>
                        <td className="p-1 text-center border-r border-gray-300">0</td>
                        <td className="p-1 text-center border-r border-gray-300">0</td>
                        <td className="p-1 text-center border-r border-gray-300">0</td>
                        <td className="p-1 text-center border-r border-gray-300">0</td>
                        <td className="p-1 text-center border-r border-gray-300">0</td>
                        <td className="p-1 text-center border-r border-gray-300">0</td>
                        {months.map((month, index) => (
                          <td key={index} className={`p-1 text-center border-r border-gray-300 ${
                            month.isPast ? 'bg-gray-100' :
                            month.isCurrent ? 'bg-orange-100' :
                            'bg-white'
                          }`}>
                            0
                          </td>
                        ))}
                      </tr>

                      {/* Data Rows */}
                      {tableData.map((row, rowIndex) => (
                        <tr key={row.id} className={`hover:bg-gray-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <td className="p-2 border-r border-gray-300 text-xs">
                            <div className="truncate" title={row.customer}>
                              {row.customer}
                            </div>
                          </td>
                          <td className="p-2 border-r border-gray-300 text-xs">
                            <div className="truncate max-w-xs" title={row.item}>
                              {row.item}
                            </div>
                          </td>
                          <td className="p-1 text-center border-r border-gray-300 text-xs">
                            {Math.round(row.budget2025 / 1000)}
                          </td>
                          <td className="p-1 text-center border-r border-gray-300 text-xs">
                            {row.ytd2025}
                          </td>
                          <td className="p-1 text-center border-r border-gray-300 text-xs">
                            {row.forecast2025}
                          </td>
                          <td className="p-1 text-center border-r border-gray-300 text-xs">
                            {row.stock}
                          </td>
                          <td className="p-1 text-center border-r border-gray-300 text-xs">
                            {row.git}
                          </td>
                          <td className="p-1 text-center border-r border-gray-300 text-xs">
                            <div className="flex items-center justify-center">
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                new Date(row.eta) > new Date() ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              {new Date(row.eta).getDate()}
                            </div>
                          </td>
                          {months.map((month, monthIndex) => (
                            <td key={monthIndex} className={`p-1 text-center border-r border-gray-300 ${
                              month.isPast ? 'bg-gray-100 text-gray-400' :
                              month.isCurrent ? 'bg-orange-100' :
                              'bg-white'
                            }`}>
                              {month.isFuture ? (
                                <input
                                  type="number"
                                  className="w-full text-center border-0 bg-transparent focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded text-xs p-1"
                                  placeholder="0"
                                  value={row.monthlyUnits[monthIndex] || ''}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setTableData(prev => prev.map(item =>
                                      item.id === row.id ? {
                                        ...item,
                                        monthlyUnits: { ...item.monthlyUnits, [monthIndex]: value }
                                      } : item
                                    ));
                                  }}
                                  min="0"
                                />
                              ) : (
                                <span className="text-gray-400">0</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  showNotification('Forecast data submitted successfully!', 'success');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

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

        {/* Customer Forecast Modal */}
        <CustomerForecastModal
          isOpen={isForecastModalOpen}
          onClose={() => setIsForecastModalOpen(false)}
          customer={null}
          items={[]}
          onSaveForecast={() => {}}
          existingForecast={null}
        />
      </div>
    </Layout>
  );
};

export default RollingForecast;
