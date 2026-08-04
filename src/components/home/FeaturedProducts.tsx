import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';

const products = [
  { id: 1, name: 'Premium Almonds', price: 1200, oldPrice: 1500, discount: 20, rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' },
  { id: 2, name: 'Premium Cashews', price: 1400, oldPrice: 1800, discount: 22, rating: 4.9, reviews: 98, image: 'https://images.unsplash.com/photo-1598114004903-2d4e1d5d8fa2?w=400&h=400&fit=crop' },
  { id: 3, name: 'Iranian Pistachios', price: 1800, oldPrice: 2300, discount: 21, rating: 4.7, reviews: 156, image: 'https://images.unsplash.com/photo-1587923623986-c6d34e9a286b?w=400&h=400&fit=crop' },
  { id: 4, name: 'California Walnuts', price: 1600, oldPrice: 2000, discount: 20, rating: 4.6, reviews: 87, image: 'https://images.unsplash.com/photo-1582320130174-bce5cf11b865?w=400&h=400&fit=crop' },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Featured</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">Best Selling <span className="text-gold-gradient">Products</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-[#E5E7EB]">
              <div className="relative overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">-{product.discount}%</span>
                <button className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-[#D4AF37] transition-all duration-300 group-hover:scale-110">
                  <FaHeart className="text-gray-600 hover:text-white transition-colors" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-sm">
                  {[...Array(5)].map((_, i) => (<FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />))}
                  <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
                </div>
                <h3 className="font-semibold text-[#111827] text-lg mt-1">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[#D4AF37] font-bold text-xl">PKR {product.price}</span>
                  <span className="text-gray-400 line-through text-sm">PKR {product.oldPrice}</span>
                </div>
                <button className="w-full mt-4 bg-[#0F766E] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#065F46] transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                  <FaShoppingCart className="text-xs" /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;