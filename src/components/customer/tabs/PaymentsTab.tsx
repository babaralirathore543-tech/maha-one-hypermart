// src/components/customer/tabs/PaymentsTab.tsx
import React from 'react';
import { FaCreditCard } from 'react-icons/fa';

const PaymentsTab = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">💳 Payment Methods</h2>

      <div className="text-center py-12">
        <FaCreditCard className="text-5xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No payment methods saved</p>
        <p className="text-xs text-gray-400 mt-2">
          Payment methods will be available after your first order
        </p>
      </div>
    </div>
  );
};

export default PaymentsTab;