// src/components/customer/tabs/HistoryTab.tsx
import React from 'react';
import { FaHistory } from 'react-icons/fa';

const HistoryTab = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📜 History</h2>

      <div className="text-center py-12">
        <FaHistory className="text-5xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No activity history yet</p>
        <p className="text-xs text-gray-400 mt-2">
          Your recent activity will appear here
        </p>
      </div>
    </div>
  );
};

export default HistoryTab;