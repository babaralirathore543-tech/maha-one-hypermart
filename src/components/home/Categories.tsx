import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const categories = [
  { name: 'Almonds', icon: '🥜', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' },
  { name: 'Cashews', icon: '🌰', image: 'https://images.unsplash.com/photo-1598114004903-2d4e1d5d8fa2?w=400&h=400&fit=crop' },
  { name: 'Pistachios', icon: '💚', image: 'https://images.unsplash.com/photo-1587923623986-c6d34e9a286b?w=400&h=400&fit=crop' },
  { name: 'Walnuts', icon: '🌳', image: 'https://images.unsplash.com/photo-1582320130174-bce5cf11b865?w=400&h=400&fit=crop' },
  { name: 'Raisins', icon: '🍇', image: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=400&h=400&fit=crop' },
  { name: 'Dates', icon: '🌴', image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=400&h=400&fit=crop' },
  { name: 'Dried Figs', icon: '🍈', image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=400&h=400&fit=crop' },
  { name: 'Mixed Nuts', icon: '🥣', image: 'https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=400&h=400&fit=crop' },
];

const Categories = () => {
  return (
    <section className="py-20 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Categories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">Explore Our <span className="text-gold-gradient">Premium Collection</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div key={category.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-2xl">
              <Link to={`/shop?category=${category.name.toLowerCase()}`}>
                <div className="relative h-64 overflow-hidden">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <span className="text-3xl mb-2 block">{category.icon}</span>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-white/70 group-hover:text-[#D4AF37] transition-colors">
                      <span>Explore</span><FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;