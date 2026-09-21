// src/components/seller/SellerEarnings.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
} from 'lucide-react';

const SellerEarnings = () => {
  const [period, setPeriod] = useState('this-month');

  const earningsData = {
    grossSales: 125000,
    commission: 12500,
    netEarnings: 112500,
    pendingBalance: 35000,
    paidBalance: 77500,
  };

  const transactions = [
    { id: 1, date: '2024-01-15', order: '#1001', amount: 4500, status: 'Paid' },
    { id: 2, date: '2024-01-14', order: '#1000', amount: 3200, status: 'Pending' },
    { id: 3, date: '2024-01-13', order: '#998', amount: 2800, status: 'Paid' },
    { id: 4, date: '2024-01-12', order: '#997', amount: 5100, status: 'Pending' },
  ];

  const summaryCards = [
    { label: 'Gross Sales', value: earningsData.grossSales, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Commission (10%)', value: earningsData.commission, icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Net Earnings', value: earningsData.netEarnings, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Balance', value: earningsData.pendingBalance, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Earnings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Track your sales and earnings
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
          <button className="px-3 sm:px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] flex items-center gap-1.5 text-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {summaryCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-3 sm:p-5 border border-gray-100"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                    {item.label}
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-gray-800 mt-1 truncate">
                    Rs. {item.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${item.bg} p-1.5 sm:p-2.5 rounded-lg flex-shrink-0`}>
                  <Icon size={14} className={item.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <button className="text-xs sm:text-sm text-[#0F766E] hover:text-[#065F46] font-medium">
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] sm:text-xs font-medium text-gray-600">
                    {txn.order}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {txn.order}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{txn.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                  Rs. {txn.amount}
                </span>
                <span
                  className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${
                    txn.status === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout */}
      <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              Available for Payout
            </h3>
            <p className="text-teal-100 text-xs sm:text-sm mt-1">
              Rs. {earningsData.pendingBalance.toLocaleString()} ready to transfer
            </p>
          </div>
          <button className="w-full sm:w-auto bg-[#D4AF37] text-gray-900 px-5 sm:px-6 py-2.5 rounded-lg font-semibold hover:bg-[#C5A338] transition-colors text-sm">
            Request Payout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;