import React, { useState } from 'react';
import { X, Users, Package, Search } from 'lucide-react';

interface NewAdditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewAdditionData) => void;
}

export interface NewAdditionData {
  type: 'existing_customer' | 'new_customer';
  customerId?: string;
  customerName?: string;
  customerCode?: string;
  itemId?: string;
  itemName?: string;
}

const NewAdditionModal: React.FC<NewAdditionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchItem, setSearchItem] = useState('');

  // Sample data - in real app this would come from API
  const existingCustomers = [
    { id: '1', name: 'Action Aid International (Tz)', code: 'AAI001' },
    { id: '2', name: 'ADVENT CONSTRUCTION LTD', code: 'ACL002' },
    { id: '3', name: 'Zoya Enterprises', code: 'ZE003' },
    { id: '4', name: 'European Systems Ltd', code: 'ESL004' }
  ];

  const existingItems = [
    { id: '1', name: 'BF GOODRICH TYRE 235/85R16 120/116S TL AT/TA KO2 LRERWLGO' },
    { id: '2', name: 'BF GOODRICH TYRE 265/65R17 120/117S TL AT/TA KO2 LRERWLGO' },
    { id: '3', name: 'MICHELIN TYRE 265/65R17 112T TL LTX TRAIL' },
    { id: '4', name: 'WHEEL BALANCE ALLOY RIMS' }
  ];

  const filteredCustomers = existingCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  const filteredItems = existingItems.filter(item =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  const handleSave = () => {
    const data: NewAdditionData = {
      type: activeTab === 'existing' ? 'existing_customer' : 'new_customer',
      ...(activeTab === 'existing' 
        ? { customerId: selectedCustomer } 
        : { customerName, customerCode }),
      itemId: selectedItem
    };
    onSave(data);
    onClose();
    
    // Reset form
    setActiveTab('existing');
    setSelectedCustomer('');
    setCustomerName('');
    setCustomerCode('');
    setSelectedItem('');
    setSearchCustomer('');
    setSearchItem('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Customer/Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Selection Tabs */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab('existing')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                activeTab === 'existing'
                  ? 'border-orange-400 bg-orange-50 text-orange-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${activeTab === 'existing' ? 'bg-orange-500' : 'bg-gray-300'}`} />
              <Users className="w-5 h-5" />
              <span className="font-medium">Select from existing customers list</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                activeTab === 'new'
                  ? 'border-orange-400 bg-orange-50 text-orange-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${activeTab === 'new' ? 'bg-orange-500' : 'bg-gray-300'}`} />
              <Users className="w-5 h-5" />
              <span className="font-medium">Create New Customer</span>
            </button>
          </div>

          {/* Customer Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Customer</h3>
            
            {activeTab === 'existing' ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search customer"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={searchCustomer}
                    onChange={(e) => setSearchCustomer(e.target.value)}
                  />
                </div>
                
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                  {filteredCustomers.map((customer) => (
                    <label key={customer.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                      <input
                        type="radio"
                        name="customer"
                        value={customer.id}
                        checked={selectedCustomer === customer.id}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="mr-3 text-orange-500 focus:ring-orange-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.code}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CUSTOMER NAME</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CUSTOMER CODE</label>
                  <input
                    type="text"
                    placeholder="Enter customer code"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Item Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-400 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <Package className="w-5 h-5 text-orange-700" />
              <span className="font-medium text-orange-700">Select from existing items list</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Item</h3>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search item"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
              </div>
              
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                {filteredItems.map((item) => (
                  <label key={item.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <input
                      type="radio"
                      name="item"
                      value={item.id}
                      checked={selectedItem === item.id}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      className="mr-3 text-orange-500 focus:ring-orange-500"
                    />
                    <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              (activeTab === 'existing' && !selectedCustomer) ||
              (activeTab === 'new' && (!customerName || !customerCode)) ||
              !selectedItem
            }
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAdditionModal;
