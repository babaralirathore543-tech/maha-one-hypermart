// src/components/pages/CheckoutPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaBuilding, FaUniversity, FaWhatsapp, 
  FaMoneyBillWave, FaArrowLeft, FaArrowRight, FaSpinner, 
  FaMobileAlt, FaQrcode, FaCopy, FaCheck, FaClock
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../services/orderService';
import QRCodePayment from '../Payment/QRCodePayment';
import { sendOrderConfirmationWhatsApp } from '../../services/whatsappNotificationService';
import { auth } from '../../config/firebase';
import { sendOrderConfirmationEmail } from '../../services/emailService';

// ✅ Payment Accounts with proper types
interface PaymentAccount {
  name: string;
  icon: string;
  number: string;
  accountTitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  bankName?: string;
  iban?: string;
}

const PAYMENT_ACCOUNTS: Record<string, PaymentAccount> = {
  jazzcash: {
    name: 'JazzCash',
    icon: '📱',
    number: '0329-3296822',
    accountTitle: 'Maha One Hypermart',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  easypaisa: {
    name: 'EasyPaisa',
    icon: '💳',
    number: '0329-3296822',
    accountTitle: 'Maha One Hypermart',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  bank: {
    name: 'Bank Transfer',
    icon: '🏦',
    number: '697022930571414343438',
    accountTitle: 'MAHNOOR',
    bankName: 'HABIBMETRO BANK',
    iban: 'PK05MPBL9702347140143438',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
};

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('jazzcash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrAmount, setQrAmount] = useState(0);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Karachi',
    province: 'Punjab',
    postalCode: '',
    notes: '',
    transactionId: '',
    paymentDate: '',
    senderName: '',
    senderPhone: ''
  });

  const cities = [
    'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas',
    'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu', 'Badin', 'Thatta',
    'Ghotki', 'Sanghar', 'Naushahro Feroze', 'Kashmore', 'Umerkot',
    'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala',
    'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Rahim Yar Khan',
    'Jhang', 'Kasur', 'Okara', 'Wah Cantt', 'Dera Ghazi Khan',
    'Mandi Bahauddin', 'Chiniot', 'Hafizabad', 'Khanewal', 'Muzaffargarh',
    'Toba Tek Singh', 'Nankana Sahib', 'Layyah', 'Bhakkar', 'Pakpattan',
    'Vehari', 'Lodhran', 'Sahiwal', 'Gujrat', 'Hasan Abdal',
    'Attock', 'Mianwali', 'Jhelum', 'Chakwal', 'Talagang',
    'Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Dera Ismail Khan',
    'Mansehra', 'Kohat', 'Nowshera', 'Charsadda', 'Swabi',
    'Haripur', 'Bannu', 'Tank', 'Lakki Marwat', 'Hangu',
    'Batkhela', 'Timergara', 'Mingora', 'Parachinar',
    'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman',
    'Sibi', 'Loralai', 'Zhob', 'Mastung', 'Kalat',
    'Nushki', 'Panjgur', 'Killa Saifullah', 'Barkhan',
    'Islamabad',
    'Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bhimber',
    'Gilgit', 'Skardu', 'Hunza', 'Nagar', 'Ghanche',
    'Astore', 'Diamer', 'Shigar', 'Kharmang',
  ];

  const calculateShipping = (city: string) => {
    if (city.toLowerCase() === 'karachi') return 250;
    return 290;
  };

  const subtotal = getCartTotal();
  const shipping = calculateShipping(formData.city);
  const discount = 0;
  const total = subtotal + shipping - discount;

  const getUserId = () => {
    const user = auth.currentUser;
    if (!user) {
      alert('❌ Please login to place order');
      window.location.href = '/login';
      return null;
    }
    return user.uid;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // ✅ Place Order with Payment Verification
  const placeOrderToFirebase = async () => {
    const userId = getUserId();
    if (!userId) return;

    if (!formData.transactionId || formData.transactionId.trim() === '') {
      alert('⚠️ Please enter your transaction ID');
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Fix: Use valid payment method types
      const validPaymentMethod = paymentMethod as 'jazzcash' | 'bank' | 'cod' | 'card';
      
      const orderData = {
        userId: userId,
        userEmail: formData.email || auth.currentUser?.email || 'guest@email.com',
        userName: `${formData.firstName} ${formData.lastName}`,
        userPhone: formData.phone,
        items: cart.map((item: any) => ({
          productId: item.id || item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          image: item.image || '/images/placeholder.jpg',
          weight: item.weight || null,
          colour: item.colour || null,
          size: item.size || null,
          variantId: item.variantId || null,
          sku: item.sku || null
        })),
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        paymentMethod: validPaymentMethod,
        paymentStatus: 'pending_verification' as 'pending' | 'paid' | 'failed' | 'refunded',
        transactionId: formData.transactionId,
        paymentDate: formData.paymentDate || new Date().toISOString().split('T')[0],
        senderName: formData.senderName || '',
        senderPhone: formData.senderPhone || '',
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          province: formData.province || 'Punjab',
          postalCode: formData.postalCode || '54000',
          country: 'Pakistan',
          phone: formData.phone
        },
        notes: formData.notes || '',
        orderDate: new Date().toISOString(),
        isVerified: false,
        verifiedBy: null,
        verifiedAt: null
      };

      console.log('📦 Order Data:', orderData);
      console.log('👤 User ID:', userId);

      const result = await placeOrder(orderData);
      
      if (result.success) {
        const orderNumber = result.orderNumber || '';
        setOrderId(orderNumber);
        setOrderPlaced(true);
        clearCart();
        
        // ✅ Send Order Confirmation Email
        try {
          const customerEmail = formData.email || auth.currentUser?.email || '';
          if (customerEmail) {
            await sendOrderConfirmationEmail({
              email: customerEmail,
              name: `${formData.firstName} ${formData.lastName}`,
              orderId: orderNumber,
              orderDate: new Date().toLocaleDateString('en-PK', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }),
              paymentMethod: paymentMethod,
              subtotal: subtotal,
              shipping: shipping,
              discount: discount,
              total: total,
              customerName: `${formData.firstName} ${formData.lastName}`,
              address: formData.address,
              city: formData.city,
              province: formData.province || 'Punjab',
              postalCode: formData.postalCode || '54000',
              phone: formData.phone,
              items: cart.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price * item.quantity
              }))
            });
            console.log('✅ Order confirmation email sent');
          }
        } catch (emailError) {
          console.error('❌ Email error:', emailError);
        }
        
        // ✅ Send WhatsApp
        if (formData.phone) {
          try {
            sendOrderConfirmationWhatsApp(
              formData.phone,
              orderNumber,
              `${formData.firstName} ${formData.lastName}`,
              cart.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              total,
              `${formData.address}, ${formData.city}, ${formData.province}`,
              '2-3 business days'
            );
            console.log('✅ WhatsApp notification sent');
          } catch (whatsappError) {
            console.error('❌ WhatsApp error:', whatsappError);
          }
        }
        
        window.dispatchEvent(new Event('orderPlaced'));
        window.dispatchEvent(new Event('storage'));
      } else {
        alert('❌ Failed to place order: ' + (result.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert('❌ Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQRPaymentSuccess = () => {
    setShowQRCode(false);
    placeOrderToFirebase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
        alert('⚠️ Please fill all required fields!');
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 2) {
      if (!auth.currentUser) {
        alert('❌ Please login to place order');
        window.location.href = '/login';
        return;
      }

      if (!formData.transactionId || formData.transactionId.trim() === '') {
        alert('⚠️ Please enter your transaction ID for verification');
        return;
      }

      placeOrderToFirebase();
    }
  };

  // ✅ Order Placed View
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FFFDF7]">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#E5E7EB] text-center">
          <div className="text-7xl mb-6">⏳</div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37]">Payment Verification Pending!</h1>
          <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
          <p className="text-gray-500 text-sm mt-1">Please wait for admin to verify your payment.</p>
          
          <div className="mt-6 bg-[#F8FAFC] rounded-2xl p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <FaClock className="text-[#D4AF37] text-2xl" />
              <span className="font-bold text-gray-800">Order #{orderId}</span>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Pending Verification</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📱 Payment Method: <strong className="capitalize">{paymentMethod}</strong></p>
              <p>🔑 Transaction ID: <strong className="font-mono">{formData.transactionId}</strong></p>
              <p>💳 Amount: <strong className="text-[#D4AF37]">PKR {total.toLocaleString()}</strong></p>
              {formData.email && <p>📧 Confirmation sent to: <strong>{formData.email}</strong></p>}
              <div className="pt-3 border-t border-[#E5E7EB]">
                <p className="text-sm text-amber-600 flex items-center gap-2">
                  <span>⏳</span>
                  <span>Your order will be confirmed after payment verification.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/" className="bg-[#0F766E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#065F46] transition">
              Continue Shopping
            </Link>
            <Link to="/dashboard?tab=orders" className="bg-white border-2 border-[#0F766E] text-[#0F766E] px-8 py-3 rounded-full font-semibold hover:bg-[#F8FAFC] transition">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Show QR Code Payment
  if (showQRCode) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => setShowQRCode(false)}
            className="text-[#0F766E] hover:text-[#D4AF37] transition mb-4 flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Payment Options
          </button>
          <QRCodePayment 
            amount={qrAmount}
            onSuccess={handleQRPaymentSuccess}
            onCancel={() => setShowQRCode(false)}
          />
        </div>
      </div>
    );
  }

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
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" required />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 text-xs">(Optional)</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" required />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="House #, Street, Area" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" required />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                    <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition">
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Shipping: PKR {calculateShipping(formData.city)} 
                      {formData.city.toLowerCase() === 'karachi' ? ' (Karachi rate)' : ' (Other cities rate)'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <select name="province" value={formData.province} onChange={handleChange} className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition">
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                        <option value="AJK">AJK</option>
                        <option value="Islamabad">Islamabad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="54000" className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition" />
                    </div>
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

              {/* STEP 2: PAYMENT + VERIFICATION */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-[#0F766E] transition">
                      <FaArrowLeft />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">💳 Payment & Verification</h2>
                  </div>

                  {/* Payment Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {Object.entries(PAYMENT_ACCOUNTS).map(([key, account]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPaymentMethod(key)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                          paymentMethod === key
                            ? `border-[#0F766E] bg-[#F8FAF9] shadow-md`
                            : 'border-[#E5E7EB] hover:border-[#0F766E]'
                        }`}
                      >
                        <div className="text-3xl mb-1">{account.icon}</div>
                        <p className="font-semibold text-gray-800 text-sm">{account.name}</p>
                        {paymentMethod === key && (
                          <FaCheckCircle className="text-[#0F766E] mx-auto mt-1" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Payment Details */}
                  {(() => {
                    const account = PAYMENT_ACCOUNTS[paymentMethod as keyof typeof PAYMENT_ACCOUNTS];
                    if (!account) return null;
                    return (
                      <div className={`${account.bgColor} border ${account.borderColor} rounded-xl p-4 mb-4`}>
                        <h3 className="font-bold text-gray-800 mb-2">{account.icon} {account.name} Payment</h3>
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0F766E] text-lg">{account.number}</span>
                              <button 
                                onClick={() => copyToClipboard(account.number.replace(/-/g, ''))} 
                                className="text-gray-400 hover:text-[#0F766E] transition"
                              >
                                {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account Title</span>
                            <span className="font-semibold">{account.accountTitle}</span>
                          </div>
                          {account.bankName && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bank</span>
                              <span className="font-semibold">{account.bankName}</span>
                            </div>
                          )}
                          {account.iban && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">IBAN</span>
                              <span className="font-mono text-xs text-[#0F766E]">{account.iban}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-600">Amount</span>
                            <span className="font-bold text-[#D4AF37] text-lg">PKR {total.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">📝 Send payment and enter transaction details below</p>
                      </div>
                    );
                  })()}

                  {/* PAYMENT VERIFICATION FORM */}
                  <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaCheckCircle className="text-[#0F766E]" /> Payment Verification
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">Enter your payment details for verification</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID *</label>
                        <input
                          type="text"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleChange}
                          placeholder="Enter transaction ID"
                          className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
                        <input
                          type="text"
                          name="senderName"
                          value={formData.senderName}
                          onChange={handleChange}
                          placeholder="Your name as per bank"
                          className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sender Phone</label>
                        <input
                          type="text"
                          name="senderPhone"
                          value={formData.senderPhone}
                          onChange={handleChange}
                          placeholder="03XX-XXXXXXX"
                          className="w-full px-4 py-2.5 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                        />
                      </div>
                    </div>

                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-700 flex items-center gap-2">
                        <span className="text-lg">⏳</span>
                        <span>
                          <strong>Verification Required:</strong> Your order will be processed after admin verifies your payment.
                        </span>
                      </p>
                    </div>

                    {/* WhatsApp Payment Option */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const account = PAYMENT_ACCOUNTS[paymentMethod as keyof typeof PAYMENT_ACCOUNTS];
                          const message = encodeURIComponent(
                            `🛍️ *MAHA ONE HYPERMARKET - Payment Details*\n\n` +
                            `🧾 Order #: *MAHA-${Date.now().toString().slice(-6)}*\n` +
                            `💰 Amount: *PKR ${total.toLocaleString()}*\n` +
                            `📱 Payment Method: *${account.name}*\n` +
                            `🔑 Transaction ID: *${formData.transactionId || 'Not entered yet'}*\n\n` +
                            `👤 Customer: ${formData.firstName} ${formData.lastName}\n` +
                            `📞 Phone: ${formData.phone}\n\n` +
                            `📍 Address: ${formData.address}, ${formData.city}`
                          );
                          window.open(`https://wa.me/${account.number.replace(/-/g, '')}?text=${message}`, '_blank');
                        }}
                        className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                      >
                        <FaWhatsapp className="text-xl" />
                        Send Payment Details via WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 bg-[#0F766E] text-white py-4 rounded-xl font-semibold transition-all duration-300 text-lg flex items-center justify-center gap-2 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#065F46]'
                    }`}
                  >
                    {isSubmitting ? (
                      <><FaSpinner className="animate-spin" /> Processing...</>
                    ) : (
                      <>Place Order • PKR {total.toLocaleString()} <FaArrowRight /></>
                    )}
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-[#0F766E]">
                    PKR {shipping}
                    <span className="text-xs text-gray-400 ml-1">
                      ({formData.city.toLowerCase() === 'karachi' ? 'Karachi' : 'Other'})
                    </span>
                  </span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">PKR {total.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <FaCheckCircle className="text-green-500 text-xs" /> 
                {formData.city.toLowerCase() === 'karachi' 
                  ? '📍 Karachi: PKR 250 shipping' 
                  : '📍 Other Cities: PKR 290 shipping'}
              </p>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700 flex items-center gap-1">
                  <span>⏳</span>
                  <span>Order will be confirmed after payment verification</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;