import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const bestSellers = [
  { id: 1, name: 'Afghani Raisins', price: 800, rating: 4.8, image: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=300&h=300&fit=crop' },
  { id: 2, name: 'Ajwa Dates', price: 900, rating: 4.9, image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=300&h=300&fit=crop' },
  { id: 3, name: 'Dried Figs', price: 1100, rating: 4.7, image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=300&h=300&fit=crop' },
  { id: 4, name: 'Mixed Dry Fruits', price: 2500, rating: 4.9, image: 'https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=300&h=300&fit=crop' },
  { id: 5, name: 'Premium Almonds', price: 1200, rating: 4.8, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop' },
  { id: 6, name: 'Iranian Pistachios', price: 1800, rating: 4.9, image: 'https://images.unsplash.com/photo-1587923623986-c6d34e9a286b?w=300&h=300&fit=crop' },
];

const BestSellers = () => {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Best Sellers</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">Customer <span className="text-gold-gradient">Favorites</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {bestSellers.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur p-4 text-center rounded-xl border border-[#E5E7EB] group">
              <div className="relative overflow-hidden rounded-xl"><img src={product.image} alt={product.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="mt-3">
                <div className="flex justify-center text-[#D4AF37] text-sm">{[...Array(5)].map((_, i) => (<FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />))}</div>
                <h4 className="font-semibold text-[#111827] text-sm mt-1">{product.name}</h4>
                <p className="text-[#D4AF37] font-bold text-sm">PKR {product.price}</p>
                <button className="w-full mt-2 bg-[#0F766E] text-white px-3 py-1.5 rounded-full text-xs hover:bg-[#065F46] transition flex items-center justify-center gap-1"><FaShoppingCart className="text-[10px]" /> Add</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;