import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount] = useState(0);

  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 300;
  const total = subtotal + shipping - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#111827]">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2">Start shopping for premium dry fruits!</p>
          <Link to="/shop" className="inline-block mt-6 bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg hover:shadow-xl">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-[#111827]">🛒 Shopping Cart</h1>
          <span className="bg-[#F8FAFC] px-3 py-1 rounded-full text-sm text-gray-600">
            {getCartCount()} items
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-[#E5E7EB] flex items-center gap-4 shadow-sm">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#111827]">{item.name}</h3>
                  <p className="text-[#D4AF37] font-bold">PKR {item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full hover:bg-[#F8FAFC] transition"><FaMinus className="text-sm" /></button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full hover:bg-[#F8FAFC] transition"><FaPlus className="text-sm" /></button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500 hover:text-red-700 transition"><FaTrash /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#0F766E]">PKR {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-[#E5E7EB] h-fit sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold text-[#111827] mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">PKR {subtotal}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold">{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-PKR {discount}</span></div>}
              <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>Total</span><span className="text-[#D4AF37]">PKR {total}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <input type="text" placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#D4AF37]" />
              <button className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#b8941f] transition">Apply</button>
            </div>
            {/* ✅ Fixed: Removed 'block' className, only 'w-full' */}
            <Link to="/checkout" className="w-full mt-6 bg-[#0F766E] text-white py-3.5 rounded-xl font-semibold text-center hover:bg-[#065F46] transition flex items-center justify-center gap-2">
              Proceed to Checkout <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;