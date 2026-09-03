import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount] = useState(0);
  
  // ✅ City Selection State
  const [selectedCity, setSelectedCity] = useState('karachi');

  const subtotal = getCartTotal();
  
  // ✅ Shipping Charges: Karachi = 250, Other Cities = 290
  const shipping = selectedCity === 'karachi' ? 250 : 290;
  
  const total = subtotal + shipping - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7] dark:bg-[#111827] px-4">
        <div className="text-center">
          <FaShoppingBag className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white">Your Cart is Empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">Start shopping for premium dry fruits!</p>
          <Link to="/shop" className="inline-block mt-6 bg-[#D4AF37] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg hover:shadow-xl text-sm sm:text-base">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] dark:text-white flex items-center gap-2">
            🛒 Shopping Cart
          </h1>
          <span className="bg-[#F8FAFC] dark:bg-[#1F2937] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E5E7EB] dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition"
              >
                {/* Product Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#F8FAFC] dark:bg-[#1F2937] border border-gray-100 dark:border-gray-700">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/80x80/D4AF37/FFFFFF?text=Product';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <h3 className="font-semibold text-[#111827] dark:text-white text-sm sm:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-[#D4AF37] font-bold text-sm sm:text-base">
                    PKR {item.price}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-600"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base text-[#111827] dark:text-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-600"
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="ml-1 sm:ml-2 p-1.5 sm:p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                      aria-label="Remove item"
                    >
                      <FaTrash className="text-xs sm:text-sm" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="w-full sm:w-auto text-right sm:text-left border-t sm:border-t-0 pt-2 sm:pt-0 mt-2 sm:mt-0 border-gray-100 dark:border-gray-700">
                  <p className="font-bold text-[#0F766E] dark:text-[#14b8a6] text-sm sm:text-base">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-[#E5E7EB] dark:border-gray-700 h-fit sticky top-20 sm:top-24 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white mb-3 sm:mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold text-[#111827] dark:text-white">PKR {subtotal.toLocaleString()}</span>
              </div>
              
              {/* ✅ Shipping with City Selection */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold text-[#111827] dark:text-white">
                    PKR {shipping}
                  </span>
                </div>
                
                {/* ✅ City Selection Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">City:</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="flex-1 px-2 py-1 text-xs sm:text-sm border border-[#E5E7EB] dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1F2937] dark:text-white bg-white"
                  >
                    <option value="karachi">Karachi (PKR 250)</option>
                    <option value="other">Other Cities (PKR 290)</option>
                  </select>
                </div>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-PKR {discount}</span>
                </div>
              )}
              
              <div className="border-t border-[#E5E7EB] dark:border-gray-700 pt-2 sm:pt-3 flex justify-between text-base sm:text-lg font-bold">
                <span className="text-[#111827] dark:text-white">Total</span>
                <span className="text-[#D4AF37]">PKR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mt-3 sm:mt-4 flex flex-col xs:flex-row gap-2">
              <input 
                type="text" 
                placeholder="Coupon code" 
                value={coupon} 
                onChange={(e) => setCoupon(e.target.value)} 
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-[#E5E7EB] dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1F2937] dark:text-white text-sm sm:text-base"
              />
              <button className="bg-[#D4AF37] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#b8941f] transition text-sm sm:text-base whitespace-nowrap">
                Apply
              </button>
            </div>

            {/* Checkout Button */}
            <Link 
              to="/checkout" 
              state={{ shipping, selectedCity }} 
              className="w-full mt-4 sm:mt-5 md:mt-6 bg-[#0F766E] text-white py-3 sm:py-3.5 rounded-xl font-semibold text-center hover:bg-[#065F46] transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Proceed to Checkout <FaArrowRight className="text-xs sm:text-sm" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;