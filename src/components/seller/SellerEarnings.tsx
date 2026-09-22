// src/components/seller/SellerEarnings.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  db,
  collection,
  query,
  where,
  getDocs,
} from '../../config/firebase';

// ============================================================
// TYPES
// ============================================================
interface EarningsData {
  grossSales: number;
  commission: number;
  netEarnings: number;
  pendingBalance: number;
  paidBalance: number;
}

interface Transaction {
  id: string;
  date: string;
  order: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

// ============================================================
// COMPONENT
// ============================================================
const SellerEarnings = () => {
  const { user, loading: authLoading } = useAuth();

  const [period, setPeriod] = useState('this-month');
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<EarningsData>({
    grossSales: 0,
    commission: 0,
    netEarnings: 0,
    pendingBalance: 0,
    paidBalance: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ============================================================
  // FETCH REAL DATA FROM FIRESTORE
  // ============================================================
  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchEarnings = async () => {
      setLoading(true);

      try {
        // Fetch seller orders
        const ordersSnap = await getDocs(
          query(
            collection(db, 'sellerOrders'),
            where('sellerId', '==', user.uid)
          )
        );

        if (cancelled) return;

        const orders: any[] = [];
        ordersSnap.forEach((d: any) =>
          orders.push({ id: d.id, ...d.data() })
        );

        // ============================================================
        // CALCULATE EARNINGS
        // ============================================================
        let grossSales = 0;
        let pendingBalance = 0;
        let paidBalance = 0;

        orders.forEach((o) => {
          const subtotal = o.subtotal || 0;

          // Gross = all non-cancelled orders
          if (o.status !== 'cancelled') {
            grossSales += subtotal;
          }

          // Delivered = paid, others = pending
          if (o.status === 'delivered') {
            paidBalance += subtotal;
          } else if (o.status !== 'cancelled') {
            pendingBalance += subtotal;
          }
        });

        // 10% commission
        const commission = Math.round(grossSales * 0.1);
        const netEarnings = grossSales - commission;

        setEarningsData({
          grossSales,
          commission,
          netEarnings,
          pendingBalance,
          paidBalance,
        });

        // ============================================================
        // RECENT TRANSACTIONS (latest 10)
        // ============================================================
        const sorted = [...orders].sort((a, b) => {
          const aTime =
            a.createdAt?.toDate?.()?.getTime?.() ||
            new Date(a.createdAt || 0).getTime();
          const bTime =
            b.createdAt?.toDate?.()?.getTime?.() ||
            new Date(b.createdAt || 0).getTime();
          return bTime - aTime;
        });

        const recentTxns: Transaction[] = sorted.slice(0, 10).map((o) => ({
          id: o.id,
          order: `#${o.orderId || o.id?.slice(0, 8) || '—'}`,
          date:
            o.createdAt?.toDate?.()?.toLocaleDateString('en-PK') ||
            new Date(o.createdAt || 0).toLocaleDateString('en-PK') ||
            '—',
          amount: o.subtotal || 0,
          status: o.status === 'delivered' ? 'Paid' : 'Pending',
        }));

        setTransactions(recentTxns);
      } catch (error) {
        console.error('❌ Error fetching earnings:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEarnings();

    return () => {
      cancelled = true;
    };
  }, [user?.uid, authLoading]);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-3xl text-[#0F766E]" />
      </div>
    );
  }

  // ============================================================
  // SUMMARY CARDS
  // ============================================================
  const summaryCards = [
    {
      label: 'Gross Sales',
      value: earningsData.grossSales,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Commission (10%)',
      value: earningsData.commission,
      icon: TrendingDown,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Net Earnings',
      value: earningsData.netEarnings,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Pending Balance',
      value: earningsData.pendingBalance,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Earnings
          </h1>
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
                <div
                  className={`${item.bg} p-1.5 sm:p-2.5 rounded-lg flex-shrink-0`}
                >
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
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp
              size={40}
              className="text-gray-300 mx-auto mb-2"
            />
            <p className="text-sm text-gray-500">No transactions yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Your earnings will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-600">
                      {txn.order.slice(0, 3)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {txn.order}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {txn.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                    Rs. {txn.amount.toLocaleString()}
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
        )}
      </div>

      {/* Payout */}
      <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              Available for Payout
            </h3>
            <p className="text-teal-100 text-xs sm:text-sm mt-1">
              Rs. {earningsData.paidBalance.toLocaleString()} ready to transfer
            </p>
          </div>
          <button
            disabled={earningsData.paidBalance === 0}
            className="w-full sm:w-auto bg-[#D4AF37] text-gray-900 px-5 sm:px-6 py-2.5 rounded-lg font-semibold hover:bg-[#C5A338] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Payout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;