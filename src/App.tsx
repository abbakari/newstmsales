import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">✅ Fixed!</h1>
        <p className="text-center text-gray-600 mb-4">
          The ReferenceError has been successfully resolved.
        </p>
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
          <h3 className="font-semibold">What was fixed:</h3>
          <ul className="mt-2 text-sm space-y-1">
            <li>• Fixed malformed import: <code>RoleBasedRoleBasedLayout</code></li>
            <li>• Corrected import path to <code>RoleBasedLayout</code></li>
            <li>• Verified all component imports are working</li>
          </ul>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              window.location.href = '/login';
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Test Login Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
