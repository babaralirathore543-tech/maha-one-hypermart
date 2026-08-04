import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaTruck, FaBuilding, FaCreditCard,
  FaUniversity, FaWhatsapp, FaMoneyBillWave,
  FaArrowLeft, FaArrowRight, FaSpinner, FaMobileAlt
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Karachi',
    notes: ''
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // ============================================================
  // ✅ PAKISTAN KI TAMAM CITIES
  // ============================================================
  const cities = [
    // Sindh
    'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas',
    'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu', 'Badin', 'Thatta',
    'Ghotki', 'Sanghar', 'Naushahro Feroze', 'Kashmore', 'Umerkot',
    
    // Punjab
    'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala',
    'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Rahim Yar Khan',
    'Jhang', 'Kasur', 'Okara', 'Wah Cantt', 'Dera Ghazi Khan',
    'Mandi Bahauddin', 'Chiniot', 'Hafizabad', 'Khanewal', 'Muzaffargarh',
    'Toba Tek Singh', 'Nankana Sahib', 'Layyah', 'Bhakkar', 'Pakpattan',
    'Vehari', 'Lodhran', 'Sahiwal', 'Gujrat', 'Hasan Abdal',
    'Attock', 'Mianwali', 'Jhelum', 'Chakwal', 'Talagang',
    
    // Khyber Pakhtunkhwa
    'Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Dera Ismail Khan',
    'Mansehra', 'Kohat', 'Nowshera', 'Charsadda', 'Swabi',
    'Haripur', 'Bannu', 'Tank', 'Lakki Marwat', 'Hangu',
    'Batkhela', 'Timergara', 'Mingora', 'Parachinar',
    
    // Balochistan
    'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman',
    'Sibi', 'Loralai', 'Zhob', 'Mastung', 'Kalat',
    'Nushki', 'Panjgur', 'Killa Saifullah', 'Barkhan',
    
    // Islamabad
    'Islamabad',
    
    // Azad Kashmir
    'Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bhimber',
    
    // Gilgit-Baltistan
    'Gilgit', 'Skardu', 'Hunza', 'Nagar', 'Ghanche',
    'Astore', 'Diamer', 'Shigar', 'Kharmang',
  ];

  // ============================================================
  // ✅ YOUR PAYMENT DETAILS
  // ============================================================
  
  const BANK_DETAILS = {
    accountTitle: 'MAHNOOR',
    bankName: 'HABIBMETRO BANK',
    accountNumber: '9702347140143438',
    iban: 'PK05MPBL9702347140143438',
    branch: 'Main Branch'
  };

  const JAZZCASH_DETAILS = {
    number: '03293296822',
    formatted: '0329-3296822'
  };

  const EASYPAISA_DETAILS = {
    number: '03113252527',
    formatted: '0311-3252527'
  };

  // ============================================================
  // CALCULATIONS
  // ============================================================
  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 200;
  const discount = 0;
  const total = subtotal + shipping - discount;

  // ============================================================
  // ✅ PAYMENT FUNCTIONS
  // ============================================================

  const payWithJazzCash = () => {
    const amount = total;
    const account = JAZZCASH_DETAILS.number.replace(/-/g, '');
    
    const confirmPayment = window.confirm(
      `📱 JazzCash Payment\n\n` +
      `💰 Amount: PKR ${amount.toLocaleString()}\n` +
      `📱 Account: ${JAZZCASH_DETAILS.formatted}\n\n` +
      `⚠️ Please open JazzCash app and send payment to the above number.\n\n` +
      `✅ After payment, click OK to confirm your order.`
    );
    
    if (confirmPayment) {
      try {
        window.location.href = `jazzcash://pay?amount=${amount}&account=${account}`;
      } catch (e) {
        window.open(`https://www.jazzcash.com.pk/`, '_blank');
      }
      
      setTimeout(() => {
        placeOrder();
      }, 5000);
    }
  };

  const payWithEasyPaisa = () => {
    const amount = total;
    const account = EASYPAISA_DETAILS.number.replace(/-/g, '');
    
    const confirmPayment = window.confirm(
      `📱 EasyPaisa Payment\n\n` +
      `💰 Amount: PKR ${amount.toLocaleString()}\n` +
      `📱 Account: ${EASYPAISA_DETAILS.formatted}\n\n` +
      `⚠️ Please open EasyPaisa app and send payment to the above number.\n\n` +
      `✅ After payment, click OK to confirm your order.`
    );
    
    if (confirmPayment) {
      try {
        window.location.href = `easypaisa://pay?amount=${amount}&account=${account}`;
      } catch (e) {
        window.open(`https://www.easypaisa.com.pk/`, '_blank');
      }
      
      setTimeout(() => {
        placeOrder();
      }, 5000);
    }
  };

  const sendWhatsAppPayment = () => {
    const phone = JAZZCASH_DETAILS.number.replace(/-/g, '');
    const message = encodeURIComponent(
      `🛍️ *MAHA ONE HYPERMART - Order Confirmation*\n\n` +
      `🧾 Order #: *MAHA-${Date.now().toString().slice(-6)}*\n` +
      `👤 Customer: ${formData.firstName} ${formData.lastName}\n` +
      `📱 Phone: ${formData.phone}\n` +
      `💰 Amount: *PKR ${total.toLocaleString()}*\n\n` +
      `📱 *Payment Options:*\n` +
      `JazzCash: ${JAZZCASH_DETAILS.formatted}\n` +
      `EasyPaisa: ${EASYPAISA_DETAILS.formatted}\n\n` +
      `📸 Please send payment screenshot after transfer.\n\n` +
      `📍 Address: ${formData.address}, ${formData.city}`
    );
    
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const placeOrder = async () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrderId = `MAHA-${Date.now().toString().slice(-6)}`;
      setOrderId(newOrderId);
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({
        orderId: newOrderId,
        customer: formData,
        paymentMethod: paymentMethod,
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        status: 'Confirmed',
        date: new Date().toISOString()
      });
      localStorage.setItem('orders', JSON.stringify(orders));
      
      clearCart();
      setOrderPlaced(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
        alert('⚠️ Please fill all required fields! (Email is optional)');
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 2) {
      if (paymentMethod === 'jazzcash') {
        payWithJazzCash();
        return;
      }

      if (paymentMethod === 'easypaisa') {
        payWithEasyPaisa();
        return;
      }

      if (paymentMethod === 'whatsapp') {
        sendWhatsAppPayment();
        setTimeout(() => placeOrder(), 3000);
        return;
      }

      if (paymentMethod === 'card') {
        if (cardData.cardNumber.replace(/\s/g, '').length < 16 || cardData.cvv.length < 3) {
          alert('⚠️ Please enter valid card details!');
          return;
        }
      }
      
      placeOrder();
    }
  };

  // ============================================================
  // ORDER PLACED VIEW
  // ============================================================
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FFFDF7]">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#E5E7EB] text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F766E]">Order Placed!</h1>
          <p className="text-gray-600 mt-2">Thank you for shopping with MAHA ONE HYPERMART</p>
          
          <div className="mt-6 bg-[#F8FAFC] rounded-2xl p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-green-500 text-2xl" />
              <span className="font-bold text-gray-800">Order #{orderId}</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {formData.email && <p>📧 Confirmation sent to: <strong>{formData.email}</strong></p>}
              <p>📱 Order tracking via SMS: <strong>{formData.phone}</strong></p>
              <div className="pt-3 border-t border-[#E5E7EB]">
                <p className="font-medium text-gray-800">Payment Method:</p>
                <p className="capitalize">
                  {paymentMethod === 'cod' && '💵 Cash on Delivery'}
                  {paymentMethod === 'jazzcash' && '📱 JazzCash'}
                  {paymentMethod === 'easypaisa' && '📱 EasyPaisa'}
                  {paymentMethod === 'whatsapp' && '💬 WhatsApp Payment'}
                  {paymentMethod === 'bank' && '🏦 Bank Transfer'}
                  {paymentMethod === 'card' && '💳 Credit/Debit Card'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/" className="bg-[#0F766E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#065F46] transition">
              Continue Shopping
            </Link>
            <Link to="/dashboard" className="bg-white border-2 border-[#0F766E] text-[#0F766E] px-8 py-3 rounded-full font-semibold hover:bg-[#F8FAFC] transition">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN CHECKOUT FORM
  // ============================================================
  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-3xl text-[#D4AF37]" />
            <h1 className="text-3xl font-bold text-[#111827]">Checkout</h1>
          </div>
          <span className="bg-[#F8FAFC] px-3 py-1 rounded-full text-sm text-gray-600">
            Step {step} of 2
          </span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[#D4AF37]' : 'bg-[#E5E7EB]'}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-[#E5E7EB]'}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT - FORM */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB]">
              
              {/* STEP 1: ADDRESS */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Shipping Address</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" required />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" required />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="House #, Street, Area" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" required />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition">
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Any special instructions" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition resize-none" />
                  </div>

                  <button type="submit" className="w-full mt-6 bg-[#D4AF37] text-white py-3.5 rounded-xl font-semibold hover:bg-[#b8941f] transition flex items-center justify-center gap-2">
                    Continue to Payment <FaArrowRight />
                  </button>
                </div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-[#0F766E] transition">
                      <FaArrowLeft />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">💳 Payment Method</h2>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        paymentMethod === 'cod' ? 'border-[#0F766E] bg-[#F8FAF9] shadow-md' : 'border-[#E5E7EB] hover:border-[#0F766E]'
                      }`}
                    >
                      <FaTruck className={`text-2xl ${paymentMethod === 'cod' ? 'text-[#0F766E]' : 'text-gray-400'}`} />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when you receive</p>
                      </div>
                      {paymentMethod === 'cod' && <FaCheckCircle className="text-[#0F766E] text-xl" />}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('jazzcash')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        paymentMethod === 'jazzcash' ? 'border-[#0F766E] bg-[#F8FAF9] shadow-md' : 'border-[#E5E7EB] hover:border-[#0F766E]'
                      }`}
                    >
                      <FaMobileAlt className={`text-2xl ${paymentMethod === 'jazzcash' ? 'text-[#0F766E]' : 'text-gray-400'}`} />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">JazzCash</p>
                        <p className="text-xs text-gray-500">{JAZZCASH_DETAILS.formatted}</p>
                      </div>
                      {paymentMethod === 'jazzcash' && <FaCheckCircle className="text-[#0F766E] text-xl" />}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('easypaisa')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        paymentMethod === 'easypaisa' ? 'border-[#0F766E] bg-[#F8FAF9] shadow-md' : 'border-[#E5E7EB] hover:border-[#0F766E]'
                      }`}
                    >
                      <FaMobileAlt className={`text-2xl ${paymentMethod === 'easypaisa' ? 'text-[#0F766E]' : 'text-gray-400'}`} />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">EasyPaisa</p>
                        <p className="text-xs text-gray-500">{EASYPAISA_DETAILS.formatted}</p>
                      </div>
                      {paymentMethod === 'easypaisa' && <FaCheckCircle className="text-[#0F766E] text-xl" />}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        paymentMethod === 'whatsapp' ? 'border-[#0F766E] bg-[#F8FAF9] shadow-md' : 'border-[#E5E7EB] hover:border-[#0F766E]'
                      }`}
                    >
                      <FaWhatsapp className={`text-2xl ${paymentMethod === 'whatsapp' ? 'text-[#25D366]' : 'text-gray-400'}`} />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">WhatsApp Payment</p>
                        <p className="text-xs text-gray-500">💬 Send payment request</p>
                      </div>
                      {paymentMethod === 'whatsapp' && <FaCheckCircle className="text-[#0F766E] text-xl" />}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        paymentMethod === 'bank' ? 'border-[#0F766E] bg-[#F8FAF9] shadow-md' : 'border-[#E5E7EB] hover:border-[#0F766E]'
                      }`}
                    >
                      <FaBuilding className={`text-2xl ${paymentMethod === 'bank' ? 'text-[#0F766E]' : 'text-gray-400'}`} />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">Bank Transfer</p>
                        <p className="text-xs text-gray-500">HABIBMETRO BANK</p>
                      </div>
                      {paymentMethod === 'bank' && <FaCheckCircle className="text-[#0F766E] text-xl" />}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        paymentMethod === 'card' ? 'border-[#0F766E] bg-[#F8FAF9] shadow-md' : 'border-[#E5E7EB] hover:border-[#0F766E]'
                      }`}
                    >
                      <FaCreditCard className={`text-2xl ${paymentMethod === 'card' ? 'text-[#0F766E]' : 'text-gray-400'}`} />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">Credit / Debit Card</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, etc.</p>
                      </div>
                      {paymentMethod === 'card' && <FaCheckCircle className="text-[#0F766E] text-xl" />}
                    </button>
                  </div>

                  {/* JazzCash Details */}
                  {paymentMethod === 'jazzcash' && (
                    <div className="mt-4 p-4 bg-[#F8FAF9] rounded-lg border border-[#E5E7EB]">
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <FaMobileAlt className="text-[#0F766E]" />
                        <strong>JazzCash: {JAZZCASH_DETAILS.formatted}</strong>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">📱 JazzCash App will open automatically</p>
                    </div>
                  )}

                  {/* EasyPaisa Details */}
                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-4 p-4 bg-[#F8FAF9] rounded-lg border border-[#E5E7EB]">
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <FaMobileAlt className="text-[#0F766E]" />
                        <strong>EasyPaisa: {EASYPAISA_DETAILS.formatted}</strong>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">📱 EasyPaisa App will open automatically</p>
                    </div>
                  )}

                  {/* WhatsApp Details */}
                  {paymentMethod === 'whatsapp' && (
                    <div className="mt-4 p-4 bg-[#F8FAF9] rounded-lg border border-[#E5E7EB]">
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <FaWhatsapp className="text-[#25D366]" />
                        <strong>WhatsApp will open with payment details</strong>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Send payment to JazzCash: {JAZZCASH_DETAILS.formatted}</p>
                    </div>
                  )}

                  {/* Bank Details */}
                  {paymentMethod === 'bank' && (
                    <div className="mt-4 p-4 bg-[#F8FAF9] rounded-lg border border-[#E5E7EB]">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <FaUniversity className="text-[#0F766E]" /> Bank Transfer Details
                      </h4>
                      <div className="space-y-2 text-sm bg-white p-4 rounded-lg border border-[#E5E7EB]">
                        <p><span className="font-medium">Account Title:</span> <span className="text-[#0F766E] font-bold">{BANK_DETAILS.accountTitle}</span></p>
                        <p><span className="font-medium">Bank:</span> {BANK_DETAILS.bankName}</p>
                        <p><span className="font-medium">IBAN:</span> <span className="font-mono text-sm font-bold text-[#0F766E]">{BANK_DETAILS.iban}</span></p>
                        <p><span className="font-medium">Account #:</span> <span className="font-bold">{BANK_DETAILS.accountNumber}</span></p>
                      </div>
                      <p className="text-xs text-red-500 mt-2">⚠️ Use Order ID as reference when transferring</p>
                    </div>
                  )}

                  {/* Card Details */}
                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input type="text" name="cardNumber" value={cardData.cardNumber} onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setCardData({ ...cardData, cardNumber: formatted });
                        }} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input type="text" name="cardName" value={cardData.cardName} onChange={handleCardChange} placeholder="John Doe" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input type="text" name="expiry" value={cardData.expiry} onChange={(e) => {
                            const formatted = formatExpiry(e.target.value);
                            setCardData({ ...cardData, expiry: formatted });
                          }} placeholder="MM/YY" maxLength={5} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input type="password" name="cvv" value={cardData.cvv} onChange={handleCardChange} placeholder="123" maxLength={4} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COD Info */}
                  {paymentMethod === 'cod' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700">💵 <strong>Cash on Delivery</strong><br/>Pay with cash when our delivery partner arrives.</p>
                      <p className="text-xs text-gray-500 mt-1">✅ No extra charges for COD</p>
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className={`w-full mt-6 bg-[#0F766E] text-white py-4 rounded-xl font-semibold transition-all duration-300 text-lg flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#065F46]'}`}>
                    {isSubmitting ? <><FaSpinner className="animate-spin" /> Processing...</> : <>Place Order • PKR {total.toLocaleString()} <FaArrowRight /></>}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB] sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Order Summary</h2>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB] last:border-0">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#0F766E]">PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">PKR {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold text-green-600">{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span></div>
                <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">PKR {total.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <FaCheckCircle className="text-green-500 text-xs" /> Free delivery on orders above PKR 2,000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;