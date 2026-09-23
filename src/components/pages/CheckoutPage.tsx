// src/components/pages/CheckoutPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaCheckCircle,
  FaWhatsapp,
  FaMoneyBillWave,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaCopy,
  FaCheck,
  FaClock,
  FaTruck,
  FaLock,
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../services/orderService';
import { sendOrderConfirmationWhatsApp } from '../../services/whatsappNotificationService';
import { auth } from '../../config/firebase';
import { sendOrderConfirmationEmail } from '../../services/emailService';

// ============================================================
// PAYMENT ACCOUNTS — EasyPaisa REMOVED
// ============================================================
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
    accountTitle: 'Mahnoor Naseeb',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
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
    borderColor: 'border-blue-200',
  },
};

// ============================================================
// PAYMENT TYPES — type-safe
// ============================================================
const VALID_PAYMENT_METHODS = ['jazzcash', 'bank'] as const;
type PaymentMethod = (typeof VALID_PAYMENT_METHODS)[number];

// ============================================================
// SHIPPING RATES — same as CartPage
// ============================================================
const SHIPPING_RATES = {
  karachi: 250,
  other: 290,
} as const;

// ============================================================
// CITIES
// ============================================================
const CITIES = [
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

// ============================================================
// PROVINCE MAP — city → province
// ============================================================
const CITY_PROVINCE_MAP: Record<string, string> = {
  Karachi: 'Sindh',
  Hyderabad: 'Sindh',
  Sukkur: 'Sindh',
  Larkana: 'Sindh',
  Nawabshah: 'Sindh',
  Lahore: 'Punjab',
  Faisalabad: 'Punjab',
  Rawalpindi: 'Punjab',
  Multan: 'Punjab',
  Islamabad: 'Islamabad',
  Peshawar: 'KPK',
  Quetta: 'Balochistan',
  Gilgit: 'Gilgit-Baltistan',
  Skardu: 'Gilgit-Baltistan',
  Muzaffarabad: 'AJK',
  Mirpur: 'AJK',
};

// ============================================================
// COMPONENT
// ============================================================
const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, getCartTotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('jazzcash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Karachi',
    province: 'Sindh',
    postalCode: '',
    notes: '',
    transactionId: '',
    paymentDate: '',
    senderName: '',
    senderPhone: '',
  });

  // ============================================================
  // ✅ Auto-update province when city changes
  // ============================================================
  useEffect(() => {
    const autoProvince = CITY_PROVINCE_MAP[formData.city];
    if (autoProvince) {
      setFormData((prev) => ({ ...prev, province: autoProvince }));
    }
  }, [formData.city]);

  // ============================================================
  // CALCULATIONS
  // ============================================================
  const subtotal = useMemo(() => getCartTotal(), [cart, getCartTotal]);
  const shipping = useMemo(
    () => (formData.city.toLowerCase() === 'karachi'
      ? SHIPPING_RATES.karachi
      : SHIPPING_RATES.other),
    [formData.city]
  );
  const discount = 0;
  const total = subtotal + shipping - discount;

  // ============================================================
  // COPY TO CLIPBOARD
  // ============================================================
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  // ============================================================
  // PLACE ORDER
  // ============================================================
  const placeOrderToFirebase = async () => {
    // ✅ Auth check with navigate + toast (no window.location)
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (!formData.transactionId || formData.transactionId.trim() === '') {
      toast.error('Please enter your transaction ID');
      return;
    }

    // ✅ Snapshot cart BEFORE clearing
    const cartSnapshot = [...cart];

    setIsSubmitting(true);
    const toastId = toast.loading('Placing your order...');

    try {
      const orderData = {
        userId: currentUser.uid,
        userEmail: formData.email || currentUser.email || 'guest@email.com',
        userName: `${formData.firstName} ${formData.lastName}`,
        userPhone: formData.phone,
        items: cartSnapshot.map((item: any) => ({
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
          sku: item.sku || null,
        })),
        subtotal,
        shipping,
        discount,
        total,
        paymentMethod,
        paymentStatus: 'pending_verification' as
          | 'pending'
          | 'paid'
          | 'failed'
          | 'refunded',
        transactionId: formData.transactionId,
        paymentDate:
          formData.paymentDate || new Date().toISOString().split('T')[0],
        senderName: formData.senderName || '',
        senderPhone: formData.senderPhone || '',
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          province: formData.province || 'Sindh',
          postalCode: formData.postalCode || '54000',
          country: 'Pakistan',
          phone: formData.phone,
        },
        notes: formData.notes || '',
        orderDate: new Date().toISOString(),
        isVerified: false,
        verifiedBy: null,
        verifiedAt: null,
      };

      const result = await placeOrder(orderData);

      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }

      const orderNumber = result.orderNumber || '';
      setOrderId(orderNumber);
      setOrderPlaced(true);

      // ✅ Clear cart AFTER snapshot
      clearCart();

      // ✅ Send Email (using snapshot, NOT cart)
      const customerEmail =
        formData.email || currentUser.email || '';
      if (customerEmail) {
        try {
          await sendOrderConfirmationEmail({
            email: customerEmail,
            name: `${formData.firstName} ${formData.lastName}`,
            orderId: orderNumber,
            orderDate: new Date().toLocaleDateString('en-PK', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            paymentMethod,
            subtotal,
            shipping,
            discount,
            total,
            customerName: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            province: formData.province || 'Sindh',
            postalCode: formData.postalCode || '54000',
            phone: formData.phone,
            items: cartSnapshot.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price * item.quantity,
            })),
          });
        } catch (emailError) {
          console.error('❌ Email error:', emailError);
          // Non-blocking — order still placed
        }
      }

      // ✅ Send WhatsApp (using snapshot, NOT cart)
      if (formData.phone) {
        try {
          sendOrderConfirmationWhatsApp(
            formData.phone,
            orderNumber,
            `${formData.firstName} ${formData.lastName}`,
            cartSnapshot.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total,
            `${formData.address}, ${formData.city}, ${formData.province}`,
            '2-3 business days'
          );
        } catch (whatsappError) {
          console.error('❌ WhatsApp error:', whatsappError);
        }
      }

      toast.success('Order placed successfully!', { id: toastId });

      window.dispatchEvent(new Event('orderPlaced'));
      window.dispatchEvent(new Event('storage'));
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(
        'Failed to place order: ' + (error.message || 'Please try again'),
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // HANDLE FORM CHANGE
  // ============================================================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phone ||
        !formData.address
      ) {
        toast.error('Please fill all required fields');
        return;
      }
      if (!/^(92)?3\d{9}$/.test(formData.phone.replace(/[-\s+]/g, ''))) {
        toast.error('Invalid phone number. Use: 03XX-XXXXXXX');
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 2) {
      if (!auth.currentUser) {
        toast.error('Please login to place order');
        navigate('/login');
        return;
      }
      if (!formData.transactionId || formData.transactionId.trim() === '') {
        toast.error('Please enter your transaction ID');
        return;
      }
      placeOrderToFirebase();
    }
  };

  // ============================================================
  // ORDER PLACED VIEW
  // ============================================================
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FFFDF7]">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-[#E5E7EB] text-center">
          <div className="text-6xl sm:text-7xl mb-6">⏳</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D4AF37]">
            Payment Verification Pending!
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Your order has been placed successfully.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Please wait for admin to verify your payment.
          </p>

          <div className="mt-6 bg-[#F8FAFC] rounded-2xl p-4 sm:p-6 text-left">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
              <FaClock className="text-[#D4AF37] text-xl sm:text-2xl" />
              <span className="font-bold text-gray-800 text-sm sm:text-base">
                Order #{orderId}
              </span>
              <span className="bg-yellow-100 text-yellow-700 text-[10px] sm:text-xs px-2 py-1 rounded-full">
                Pending Verification
              </span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <p>
                📱 Payment Method:{' '}
                <strong className="capitalize">{paymentMethod}</strong>
              </p>
              <p>
                🔑 Transaction ID:{' '}
                <strong className="font-mono">{formData.transactionId}</strong>
              </p>
              <p>
                💳 Amount:{' '}
                <strong className="text-[#D4AF37]">
                  PKR {total.toLocaleString()}
                </strong>
              </p>
              {formData.email && (
                <p>
                  📧 Confirmation sent to: <strong>{formData.email}</strong>
                </p>
              )}
              <div className="pt-3 border-t border-[#E5E7EB]">
                <p className="text-xs sm:text-sm text-amber-600 flex items-start gap-2">
                  <span>⏳</span>
                  <span>
                    Your order will be confirmed after payment verification.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/"
              className="bg-[#0F766E] text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-[#065F46] transition active:scale-95 text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
            <Link
              to="/dashboard?tab=orders"
              className="bg-white border-2 border-[#0F766E] text-[#0F766E] px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-[#F8FAFC] transition active:scale-95 text-sm sm:text-base"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="bg-[#FFFDF7] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaMoneyBillWave className="text-2xl sm:text-3xl text-[#D4AF37]" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827]">
              Checkout
            </h1>
          </div>
          <span className="bg-[#F8FAFC] px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-600">
            Step {step} of 2
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div
            className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
              step >= 1 ? 'bg-[#D4AF37]' : 'bg-[#E5E7EB]'
            }`}
          />
          <div
            className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
              step >= 2 ? 'bg-[#D4AF37]' : 'bg-[#E5E7EB]'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* ============================================================
              LEFT — FORM
          ============================================================ */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-[#E5E7EB]"
            >
              {/* STEP 1: ADDRESS */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    📍 Shipping Address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email{' '}
                      <span className="text-gray-400 text-[10px] sm:text-xs">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XX-XXXXXXX"
                      className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House #, Street, Area"
                      className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FaTruck className="text-[#0F766E]" size={10} />
                      Shipping: PKR {shipping}{' '}
                      {formData.city.toLowerCase() === 'karachi'
                        ? '(Karachi rate)'
                        : '(Other cities rate)'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Province
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                      >
                        <option value="Sindh">Sindh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                        <option value="AJK">AJK</option>
                        <option value="Islamabad">Islamabad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="54000"
                        className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Order Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Any special instructions"
                      className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-[#D4AF37] text-white py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-[#b8941f] transition flex items-center justify-center gap-2 active:scale-95 text-sm sm:text-base"
                  >
                    Continue to Payment <FaArrowRight />
                  </button>
                </div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-500 hover:text-[#0F766E] transition p-1"
                      aria-label="Back"
                    >
                      <FaArrowLeft />
                    </button>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      💳 Payment & Verification
                    </h2>
                  </div>

                  {/* Payment Options — 2 options now */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {Object.entries(PAYMENT_ACCOUNTS).map(
                      ([key, account]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setPaymentMethod(key as PaymentMethod)
                          }
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                            paymentMethod === key
                              ? 'border-[#0F766E] bg-[#F8FAF9] shadow-md'
                              : 'border-[#E5E7EB] hover:border-[#0F766E]'
                          }`}
                        >
                          <div className="text-3xl mb-1">{account.icon}</div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {account.name}
                          </p>
                          {paymentMethod === key && (
                            <FaCheckCircle className="text-[#0F766E] mx-auto mt-1" />
                          )}
                        </button>
                      )
                    )}
                  </div>

                  {/* Payment Details */}
                  {(() => {
                    const account = PAYMENT_ACCOUNTS[paymentMethod];
                    if (!account) return null;
                    return (
                      <div
                        className={`${account.bgColor} border ${account.borderColor} rounded-xl p-3 sm:p-4 mb-4`}
                      >
                        <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">
                          {account.icon} {account.name} Payment
                        </h3>
                        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-600 text-xs sm:text-sm">
                              Account Number
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0F766E] text-xs sm:text-lg font-mono">
                                {account.number}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    account.number.replace(/-/g, ''),
                                    'number'
                                  )
                                }
                                className="text-gray-400 hover:text-[#0F766E] transition p-1"
                                aria-label="Copy number"
                              >
                                {copied === 'number' ? (
                                  <FaCheck className="text-green-500" />
                                ) : (
                                  <FaCopy />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-gray-600 text-xs sm:text-sm">
                              Account Title
                            </span>
                            <span className="font-semibold text-xs sm:text-sm">
                              {account.accountTitle}
                            </span>
                          </div>
                          {account.bankName && (
                            <div className="flex justify-between gap-2">
                              <span className="text-gray-600 text-xs sm:text-sm">
                                Bank
                              </span>
                              <span className="font-semibold text-xs sm:text-sm">
                                {account.bankName}
                              </span>
                            </div>
                          )}
                          {account.iban && (
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-gray-600 text-xs sm:text-sm">
                                IBAN
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-[10px] sm:text-xs text-[#0F766E] break-all">
                                  {account.iban}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(account.iban!, 'iban')
                                  }
                                  className="text-gray-400 hover:text-[#0F766E] transition p-1 shrink-0"
                                  aria-label="Copy IBAN"
                                >
                                  {copied === 'iban' ? (
                                    <FaCheck className="text-green-500" />
                                  ) : (
                                    <FaCopy />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-600 text-xs sm:text-sm">
                              Amount
                            </span>
                            <span className="font-bold text-[#D4AF37] text-sm sm:text-lg">
                              PKR {total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                          📝 Send payment and enter transaction details below
                        </p>
                      </div>
                    );
                  })()}

                  {/* Verification Form */}
                  <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <FaCheckCircle className="text-[#0F766E]" /> Payment
                      Verification
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3">
                      Enter your payment details for verification
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Transaction ID{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleChange}
                          placeholder="Enter transaction ID"
                          className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Sender Name
                        </label>
                        <input
                          type="text"
                          name="senderName"
                          value={formData.senderName}
                          onChange={handleChange}
                          placeholder="Your name as per bank"
                          className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Sender Phone
                        </label>
                        <input
                          type="text"
                          name="senderPhone"
                          value={formData.senderPhone}
                          onChange={handleChange}
                          placeholder="03XX-XXXXXXX"
                          className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0F766E] transition"
                        />
                      </div>
                    </div>

                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs sm:text-sm text-amber-700 flex items-start gap-2">
                        <span className="text-lg shrink-0">⏳</span>
                        <span>
                          <strong>Verification Required:</strong> Your order
                          will be processed after admin verifies your payment.
                        </span>
                      </p>
                    </div>

                    {/* WhatsApp Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const account = PAYMENT_ACCOUNTS[paymentMethod];
                        if (!account) return;
                        const message = encodeURIComponent(
                          `🛍️ *MAHA ONE HYPERMARKET - Payment Details*\n\n` +
                            `🧾 Order #: *MAHA-${Date.now()
                              .toString()
                              .slice(-6)}*\n` +
                            `💰 Amount: *PKR ${total.toLocaleString()}*\n` +
                            `📱 Payment Method: *${account.name}*\n` +
                            `🔑 Transaction ID: *${
                              formData.transactionId || 'Not entered yet'
                            }*\n\n` +
                            `👤 Customer: ${formData.firstName} ${formData.lastName}\n` +
                            `📞 Phone: ${formData.phone}\n\n` +
                            `📍 Address: ${formData.address}, ${formData.city}`
                        );
                        window.open(
                          `https://wa.me/${account.number.replace(
                            /-/g,
                            ''
                          )}?text=${message}`,
                          '_blank'
                        );
                      }}
                      className="w-full mt-4 bg-[#25D366] hover:bg-[#1DA851] text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 active:scale-95 text-sm sm:text-base"
                    >
                      <FaWhatsapp className="text-xl" />
                      Send Payment Details via WhatsApp
                    </button>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 bg-[#0F766E] text-white py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-lg flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#065F46] active:scale-95'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Place Order • PKR {total.toLocaleString()}{' '}
                        <FaArrowRight />
                      </>
                    )}
                  </button>

                  {/* Security note */}
                  <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                    <FaLock size={10} /> Your information is secure
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* ============================================================
              RIGHT — ORDER SUMMARY
          ============================================================ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-[#E5E7EB] lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                📦 Order Summary
              </h2>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {cart.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB] last:border-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/40x40/D4AF37/FFFFFF?text=P';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#0F766E] whitespace-nowrap">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-[#0F766E]">
                    PKR {shipping}
                    <span className="text-[10px] text-gray-400 ml-1">
                      (
                      {formData.city.toLowerCase() === 'karachi'
                        ? 'Karachi'
                        : 'Other'}
                      )
                    </span>
                  </span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-[10px] sm:text-xs text-gray-400 mt-3 flex items-center gap-1">
                <FaCheckCircle className="text-green-500" size={10} />
                {formData.city.toLowerCase() === 'karachi'
                  ? '📍 Karachi: PKR 250 shipping'
                  : '📍 Other Cities: PKR 290 shipping'}
              </p>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-[10px] sm:text-xs text-amber-700 flex items-start gap-1">
                  <span>⏳</span>
                  <span>
                    Order will be confirmed after payment verification
                  </span>
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