import React, { useState, useEffect } from 'react';
import { 
  FaWallet, 
  FaPlus, 
  FaArrowUp, 
  FaHistory, 
  FaArrowDown,
  FaTimes,
  FaQrcode
} from 'react-icons/fa';
// ❌ FaCreditCard removed - unused
import QRCodePayment from '../Payment/QRCodePayment';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'transfer';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference?: string;
}

const MahaWallet: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Load wallet data
  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = () => {
    try {
      const walletData = JSON.parse(localStorage.getItem('mahaWallet') || '{"balance": 0, "transactions": []}');
      setBalance(walletData.balance || 0);
      setTransactions(walletData.transactions || []);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  // ✅ Handle Successful Payment (from QR Code)
  const handlePaymentSuccess = (newBalance: number) => {
    setBalance(newBalance);
    setShowAddMoney(false);
    setShowQRCode(false);
    setAmount('');
    setDescription('');
    loadWalletData();
  };

  // ✅ Withdraw Money
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amountNum > balance) {
      alert('❌ Insufficient balance!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newBalance = balance - amountNum;
      const transaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'debit',
        amount: amountNum,
        description: description || 'Withdrawn from Maha Wallet',
        status: 'completed',
        date: new Date().toISOString()
      };

      const updatedTransactions = [transaction, ...transactions];
      setBalance(newBalance);
      setTransactions(updatedTransactions);
      localStorage.setItem('mahaWallet', JSON.stringify({
        balance: newBalance,
        transactions: updatedTransactions
      }));

      setShowWithdraw(false);
      setAmount('');
      setDescription('');
      setLoading(false);
      alert(`✅ PKR ${amountNum.toLocaleString()} withdrawn successfully!`);
    }, 1000);
  };

  // ✅ Get Status Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'failed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // ✅ Get Type Icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credit': return <FaArrowDown className="text-green-500" />;
      case 'debit': return <FaArrowUp className="text-red-500" />;
      default: return <FaArrowDown className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <FaWallet className="text-3xl text-[#D4AF37]" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Maha Wallet</h2>
            <p className="text-xs sm:text-sm text-gray-500">Your digital wallet</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setShowAddMoney(true); setShowWithdraw(false); setShowQRCode(false); }}
            className="bg-[#0F766E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-[#065F46] transition flex items-center gap-1 sm:gap-2"
          >
            <FaPlus size={14} /> Add Money
          </button>
          <button
            onClick={() => { setShowWithdraw(true); setShowAddMoney(false); setShowQRCode(false); }}
            className="bg-yellow-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-yellow-600 transition flex items-center gap-1 sm:gap-2"
          >
            <FaArrowUp size={14} /> Withdraw
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl p-4 sm:p-6 text-white mb-6">
        <p className="text-xs sm:text-sm opacity-80">Available Balance</p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1">
          PKR {balance.toLocaleString()}
        </p>
        <p className="text-[10px] sm:text-xs opacity-60 mt-2">💰 Maha Wallet</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Deposits</p>
          <p className="text-sm sm:text-lg font-bold text-[#0F766E]">
            PKR {transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Withdrawals</p>
          <p className="text-sm sm:text-lg font-bold text-red-500">
            PKR {transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500">Transactions</p>
          <p className="text-sm sm:text-lg font-bold text-gray-800">{transactions.length}</p>
        </div>
      </div>

      {/* ✅ Add Money Form - Only Real Payment (QR Code) */}
      {showAddMoney && !showQRCode && (
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
              <FaPlus className="text-[#0F766E]" /> Add Money
            </h3>
            <button
              type="button"
              onClick={() => setShowAddMoney(false)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                placeholder="Why are you adding money?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowQRCode(true)}
              className="bg-[#0F766E] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-[#065F46] transition flex items-center gap-2 text-sm"
            >
              <FaQrcode /> Pay with QR Code
            </button>
            <button
              type="button"
              onClick={() => setShowAddMoney(false)}
              className="bg-gray-300 text-gray-700 px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-gray-400 transition text-sm"
            >
              Cancel
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
            💳 Real payment via JazzCash/EasyPaisa QR Code
          </p>
        </div>
      )}

      {/* ✅ QR Code Payment */}
      {showQRCode && (
        <div className="mb-4">
          <QRCodePayment 
            amount={parseFloat(amount) || 0}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowQRCode(false)}
          />
        </div>
      )}

      {/* Withdraw Form */}
      {showWithdraw && (
        <form onSubmit={handleWithdraw} className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
              <FaArrowUp className="text-yellow-500" /> Withdraw Money
            </h3>
            <button
              type="button"
              onClick={() => setShowWithdraw(false)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
                min="1"
                max={balance}
              />
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Max: PKR {balance.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                placeholder="Why are you withdrawing?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
            <button
              type="button"
              onClick={() => setShowWithdraw(false)}
              className="bg-gray-300 text-gray-700 px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-gray-400 transition text-sm"
            >
              Cancel
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
            ⏱️ Withdrawals are processed within 24-48 hours.
          </p>
        </form>
      )}

      {/* Transaction History */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <FaHistory className="text-[#D4AF37]" /> Transaction History
        </h3>
        {transactions.length === 0 ? (
          <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">No transactions yet</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Start using your Maha Wallet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition gap-2 sm:gap-0"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {getTypeIcon(txn.type)}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">{txn.description}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      {new Date(txn.date).toLocaleDateString()} • {new Date(txn.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right w-full sm:w-auto">
                  <p className={`text-xs sm:text-sm font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'credit' ? '+' : '-'} PKR {txn.amount.toLocaleString()}
                  </p>
                  <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-[10px] sm:text-xs text-gray-400">
          🔒 Secure • Fast • Reliable • Maha Wallet
        </p>
      </div>
    </div>
  );
};

export default MahaWallet;