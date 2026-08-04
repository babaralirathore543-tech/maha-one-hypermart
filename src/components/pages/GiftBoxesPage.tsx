import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const giftBoxes = [
  { name: 'Corporate Gift Box', price: 2500, items: 'Almonds, Cashews, Pistachios, Walnuts', image: 'https://images.unsplash.com/photo-1549465220-1a8b5f9a5e9d?w=400&h=400&fit=crop' },
  { name: 'Wedding Gift Box', price: 3000, items: 'Premium Dry Fruits, Dates, Chocolates', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop' },
  { name: 'Ramadan Box', price: 1800, items: 'Dates, Almonds, Apricots, Figs', image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=400&h=400&fit=crop' },
  { name: 'Eid Collection', price: 2200, items: 'Mixed Nuts, Dates, Dry Fruits', image: 'https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=400&h=400&fit=crop' },
];

const GiftBoxesPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#111827]">
            🎁 Premium <span className="text-gold-gradient">Gift Boxes</span>
          </h1>
          <p className="text-gray-500 mt-4">Perfect for corporate gifting, weddings, and special occasions.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {giftBoxes.map((box, index) => (
            <motion.div
              key={box.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-[#E5E7EB]"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={box.image} 
                  alt={box.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <FaStar className="text-[#D4AF37]" />
                    <FaStar className="text-[#D4AF37]" />
                    <FaStar className="text-[#D4AF37]" />
                    <FaStar className="text-[#D4AF37]" />
                    <FaStar className="text-[#D4AF37]" />
                    <span className="ml-1 text-xs">(4.9)</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[#111827] text-lg">{box.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{box.items}</p>
                <p className="text-[#D4AF37] font-bold text-xl mt-2">PKR {box.price}</p>
                <button className="w-full mt-4 bg-[#0F766E] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#065F46] transition">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftBoxesPage;