import React, { useState } from 'react';
import { 
  FaCopy, 
  FaCheck, 
  FaSpinner, 
  FaDownload, 
  FaWhatsapp, 
  FaTimes,
  FaQrcode,
  FaMoneyBillWave,
  FaMobileAlt,
  FaInfoCircle
} from 'react-icons/fa';

interface QRCodePaymentProps {
  amount: number;
  onSuccess: (balance: number) => void;
  onCancel?: () => void;
}

const QRCodePayment: React.FC<QRCodePaymentProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'scanning' | 'paid'>('idle');
  const [selectedMethod, setSelectedMethod] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [transactionId, setTransactionId] = useState('');

  // ✅ YOUR TILL IDs
  const JAZZCASH_TILL_ID = '984170861';
  const EASYPAISA_TILL_ID = '997589773';

  // ✅ CLOUDINARY QR CODE IMAGES
  // ⚠️ Apne Cloudinary URLs yahan paste karein
  const JAZZCASH_QR_IMAGE = 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/jazzcash-qr.png';
  const EASYPAISA_QR_IMAGE = 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787123190/easypaisa_ujsnr7.png';

  // ✅ QR Code Data
  const generateQRData = () => {
    const orderId = `ORD_${Date.now()}`;
    const tillId = selectedMethod === 'jazzcash' ? JAZZCASH_TILL_ID : EASYPAISA_TILL_ID;
    const provider = selectedMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa';
    
    return JSON.stringify({
      tillId: tillId,
      amount: amount,
      currency: 'PKR',
      orderId: orderId,
      merchant: 'Maha One HyperMart',
      provider: provider,
      description: 'Maha Wallet Top-up',
      timestamp: new Date().toISOString()
    });
  };

  const qrData = generateQRData();
  const orderId = `ORD_${Date.now()}`;
  const tillId = selectedMethod === 'jazzcash' ? JAZZCASH_TILL_ID : EASYPAISA_TILL_ID;
  const provider = selectedMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa';
  const qrImage = selectedMethod === 'jazzcash' ? JAZZCASH_QR_IMAGE : EASYPAISA_QR_IMAGE;

  // ✅ Copy to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      alert('❌ Failed to copy QR data');
    }
  };

  // ✅ Download QR Code Image
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${selectedMethod}-qr-${amount}.png`;
    link.href = qrImage;
    link.click();
  };

  // ✅ Share via WhatsApp
  const handleShareWhatsApp = () => {
    const message = `💰 *Maha Wallet Payment*\n\n` +
      `💵 Amount: PKR ${amount}\n` +
      `🆔 Order ID: ${orderId}\n` +
      `📱 Provider: ${provider}\n` +
      `🏷️ Till ID: ${tillId}\n` +
      `🏦 Merchant: Maha One HyperMart\n\n` +
      `📱 Scan QR code to pay via ${provider} app.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ✅ Reset
  const handleReset = () => {
    setPaymentStatus('idle');
    setTransactionId('');
    setCopied(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-lg sm:text-xl">
              <FaQrcode />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg">QR Code Payment</h3>
              <p className="text-white/70 text-xs sm:text-sm">JazzCash / EasyPaisa</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-white/70 hover:text-white transition"
            >
              <FaTimes size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        
        {/* ✅ Provider Selection */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
          <button
            onClick={() => setSelectedMethod('jazzcash')}
            className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
              selectedMethod === 'jazzcash'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <FaMobileAlt className={`text-xl sm:text-2xl mx-auto ${selectedMethod === 'jazzcash' ? 'text-orange-500' : 'text-gray-400'}`} />
            <p className={`text-xs sm:text-sm font-medium mt-1 ${selectedMethod === 'jazzcash' ? 'text-orange-600' : 'text-gray-600'}`}>
              JazzCash
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 font-mono">Till: {JAZZCASH_TILL_ID}</p>
          </button>
          
          <button
            onClick={() => setSelectedMethod('easypaisa')}
            className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
              selectedMethod === 'easypaisa'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <FaMobileAlt className={`text-xl sm:text-2xl mx-auto ${selectedMethod === 'easypaisa' ? 'text-purple-500' : 'text-gray-400'}`} />
            <p className={`text-xs sm:text-sm font-medium mt-1 ${selectedMethod === 'easypaisa' ? 'text-purple-600' : 'text-gray-600'}`}>
              EasyPaisa
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 font-mono">Till: {EASYPAISA_TILL_ID}</p>
          </button>
        </div>

        {/* ✅ Amount Display */}
        <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-[#0F766E] mb-3 sm:mb-4">
          <FaMoneyBillWave className="text-[#D4AF37] text-lg sm:text-xl" />
          PKR {amount.toLocaleString()}
        </div>

        {/* ✅ QR Code Image - Cloudinary */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg">
            <img 
              src={qrImage}
              alt={`${provider} QR Code`}
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=' + provider + '+QR';
              }}
            />
          </div>
          
          {/* ✅ Order ID & Till ID */}
          <div className="mt-2 sm:mt-3 text-center w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Order ID</p>
                <p className="text-xs sm:text-sm font-mono font-bold text-gray-700">{orderId}</p>
              </div>
              <div className="hidden sm:block text-gray-300">|</div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Till ID</p>
                <p className="text-xs sm:text-sm font-mono font-bold text-[#0F766E]">{tillId}</p>
              </div>
              <div className="hidden sm:block text-gray-300">|</div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Provider</p>
                <p className="text-xs sm:text-sm font-bold text-gray-700">{provider}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Action Buttons */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          <button
            onClick={handleDownload}
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium"
          >
            <FaDownload className="text-xs sm:text-sm" /> Download
          </button>
          <button
            onClick={handleCopy}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium ${
              copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copied ? <FaCheck className="text-xs sm:text-sm" /> : <FaCopy className="text-xs sm:text-sm" />} 
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium"
          >
            <FaWhatsapp className="text-xs sm:text-sm" /> Share
          </button>
        </div>

        {/* ✅ Till ID Info Box */}
        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-1.5 sm:gap-2">
            <FaInfoCircle className="text-blue-500 mt-0.5 text-xs sm:text-sm" />
            <div>
              <p className="text-[10px] sm:text-xs text-blue-700">
                <span className="font-semibold">Till ID:</span> <span className="font-mono">{tillId}</span>
              </p>
              <p className="text-[10px] sm:text-xs text-blue-600">
                Scan QR code with {provider} app to pay
              </p>
              <p className="text-[10px] sm:text-xs text-blue-500 mt-1">
                💡 After payment, click "I've Paid" to confirm
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Payment Status */}
        {paymentStatus === 'scanning' && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
            <FaSpinner className="animate-spin text-yellow-600 text-2xl sm:text-3xl mx-auto mb-2" />
            <p className="text-sm text-yellow-700 font-medium">Waiting for payment confirmation...</p>
            <p className="text-[10px] sm:text-xs text-yellow-600 mt-1">
              Please scan QR code with {provider} app
            </p>
          </div>
        )}

        {paymentStatus === 'paid' && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <div className="text-green-500 text-3xl sm:text-4xl mb-1">✅</div>
            <p className="text-base sm:text-lg font-bold text-green-700">Payment Successful!</p>
            <p className="text-xs sm:text-sm text-green-600 mt-1">PKR {amount.toLocaleString()} added to your wallet</p>
            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-white rounded-lg text-left text-[10px] sm:text-sm">
              <p className="text-gray-600"><span className="font-medium">Transaction ID:</span> {transactionId}</p>
              <p className="text-gray-600"><span className="font-medium">Provider:</span> {provider}</p>
              <p className="text-gray-600"><span className="font-medium">Till ID:</span> <span className="font-mono font-bold text-[#0F766E]">{tillId}</span></p>
              <p className="text-gray-600"><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Completed</span></p>
            </div>
          </div>
        )}

        {/* ✅ Action Buttons */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          {paymentStatus === 'idle' && (
            <>
              <button
                onClick={() => {
                  setPaymentStatus('scanning');
                }}
                className="flex-1 bg-[#0F766E] text-white py-2 sm:py-3 rounded-xl hover:bg-[#065F46] transition font-medium flex items-center justify-center gap-2 text-sm"
              >
                💳 I've Paid
              </button>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium text-sm"
                >
                  Cancel
                </button>
              )}
            </>
          )}
          
          {paymentStatus === 'scanning' && (
            <>
              <button
                onClick={() => {
                  const txnId = `TXN_${Date.now()}`;
                  setTransactionId(txnId);
                  
                  const wallet = JSON.parse(localStorage.getItem('mahaWallet') || '{"balance": 0, "transactions": []}');
                  const newBalance = wallet.balance + amount;
                  wallet.balance = newBalance;
                  wallet.transactions.unshift({
                    id: txnId,
                    type: 'credit',
                    amount: amount,
                    description: `Added money via ${provider} QR Code (Till: ${tillId})`,
                    status: 'completed',
                    date: new Date().toISOString(),
                    reference: `Till ID: ${tillId}`
                  });
                  localStorage.setItem('mahaWallet', JSON.stringify(wallet));
                  
                  setPaymentStatus('paid');
                  onSuccess(newBalance);
                }}
                className="flex-1 bg-green-600 text-white py-2 sm:py-3 rounded-xl hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 text-sm"
              >
                ✅ Confirm Payment
              </button>
              <button
                onClick={() => setPaymentStatus('idle')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium text-sm"
              >
                Cancel
              </button>
            </>
          )}
          
          {paymentStatus === 'paid' && (
            <button
              onClick={handleReset}
              className="flex-1 bg-[#0F766E] text-white py-2 sm:py-3 rounded-xl hover:bg-[#065F46] transition font-medium text-sm"
            >
              Done
            </button>
          )}
        </div>

        {/* ✅ Footer */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
          <span>🔒 Secure</span>
          <span>•</span>
          <span>📱 {provider}</span>
          <span>•</span>
          <span>🏷️ Till ID: <span className="font-mono">{tillId}</span></span>
        </div>
      </div>
    </div>
  );
};

export default QRCodePayment;