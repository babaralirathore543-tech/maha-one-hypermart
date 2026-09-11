// src/components/seller/SellerEarnings.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download,
  ChevronDown
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Earnings</h1>
          <p className="text-sm text-gray-500 mt-1">Track your sales and earnings</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Gross Sales',
            value: `Rs. ${earningsData.grossSales.toLocaleString()}`,
            icon: TrendingUp,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Commission (10%)',
            value: `Rs. ${earningsData.commission.toLocaleString()}`,
            icon: TrendingDown,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
          },
          {
            label: 'Net Earnings',
            value: `Rs. ${earningsData.netEarnings.toLocaleString()}`,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Pending Balance',
            value: `Rs. ${earningsData.pendingBalance.toLocaleString()}`,
            icon: Calendar,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{item.value}</p>
              </div>
              <div className={`${item.bg} p-3 rounded-lg`}>
                <item.icon className={`${item.color}`} size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          <button className="text-sm text-[#0F766E] hover:text-[#065F46] font-medium">
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{transaction.order}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.order}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800">Rs. {transaction.amount}</span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  transaction.status === 'Paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Request */}
      <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Available for Payout</h3>
            <p className="text-teal-100 text-sm mt-1">
              Rs. {earningsData.pendingBalance.toLocaleString()} is ready to be transferred
            </p>
          </div>
          <button className="bg-[#D4AF37] text-gray-900 px-6 py-2.5 rounded-lg font-medium hover:bg-[#C5A338] transition-colors">
            Request Payout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;