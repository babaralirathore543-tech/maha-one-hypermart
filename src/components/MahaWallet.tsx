import React, { useState, useEffect } from 'react';
import { 
  FaWallet, 
  FaPlus, 
  FaArrowUp, 
  FaHistory, 
  FaArrowDown,
  FaTimes
} from 'react-icons/fa';

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

  // ✅ Add Money
  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newBalance = balance + amountNum;
      const transaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'credit',
        amount: amountNum,
        description: description || 'Added money to Maha Wallet',
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

      setShowAddMoney(false);
      setAmount('');
      setDescription('');
      setLoading(false);
      alert(`✅ PKR ${amountNum.toLocaleString()} added successfully!`);
    }, 1000);
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
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaWallet className="text-3xl text-[#D4AF37]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Maha Wallet</h2>
            <p className="text-sm text-gray-500">Your digital wallet</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAddMoney(true); setShowWithdraw(false); }}
            className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#065F46] transition flex items-center gap-2"
          >
            <FaPlus /> Add Money
          </button>
          <button
            onClick={() => { setShowWithdraw(true); setShowAddMoney(false); }}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition flex items-center gap-2"
          >
            <FaArrowUp /> Withdraw
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl p-6 text-white mb-6">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-4xl font-bold mt-1">
          PKR {balance.toLocaleString()}
        </p>
        <p className="text-xs opacity-60 mt-2">💰 Maha Wallet</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Total Deposits</p>
          <p className="text-lg font-bold text-[#0F766E]">
            PKR {transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Total Withdrawals</p>
          <p className="text-lg font-bold text-red-500">
            PKR {transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Transactions</p>
          <p className="text-lg font-bold text-gray-800">{transactions.length}</p>
        </div>
      </div>

      {/* Add Money Form */}
      {showAddMoney && (
        <form onSubmit={handleAddMoney} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                placeholder="Why are you adding money?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add Money'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddMoney(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            💳 Secure payment. Money will be added to your Maha Wallet instantly.
          </p>
        </form>
      )}

      {/* Withdraw Form */}
      {showWithdraw && (
        <form onSubmit={handleWithdraw} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
                min="1"
                max={balance}
              />
              <p className="text-xs text-gray-400 mt-1">Max: PKR {balance.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                placeholder="Why are you withdrawing?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
            <button
              type="button"
              onClick={() => setShowWithdraw(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            ⏱️ Withdrawals are processed within 24-48 hours.
          </p>
        </form>
      )}

      {/* Transaction History */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FaHistory className="text-[#D4AF37]" /> Transaction History
        </h3>
        {transactions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-xs text-gray-400 mt-1">Start using your Maha Wallet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {getTypeIcon(txn.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{txn.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(txn.date).toLocaleDateString()} • {new Date(txn.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'credit' ? '+' : '-'} PKR {txn.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(txn.status)}`}>
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
        <p className="text-xs text-gray-400">
          🔒 Secure • Fast • Reliable • Maha Wallet
        </p>
      </div>
    </div>
  );
};

export default MahaWallet;