import { motion } from 'framer-motion';
import { FaStar, FaTruck, FaLeaf, FaMedal } from 'react-icons/fa';

const Hero = () => {
  const stats = [
    { icon: <FaStar className="text-[#D4AF37]" />, label: 'Happy Customers', value: '10,000+' },
    { icon: <FaTruck className="text-[#D4AF37]" />, label: 'Nationwide Delivery', value: '100%' },
    { icon: <FaLeaf className="text-[#D4AF37]" />, label: '100% Natural', value: 'Pure' },
    { icon: <FaMedal className="text-[#D4AF37]" />, label: 'Premium Quality', value: 'Trusted' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FFFDF7]">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-block px-4 py-1.5 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] text-sm font-medium mb-6">
              🌱 Premium Dry Fruits
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1]">
              <span className="text-[#111827]">Eat Pure.</span><br />
              <span className="text-gold-gradient">Live Better.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg text-gray-600 mt-6 max-w-lg leading-relaxed">
              Premium handpicked dry fruits sourced from the finest farms and delivered fresh across Pakistan.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-4 mt-8">
              <button className="bg-gradient-to-r from-[#D4AF37] to-[#b8941f] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">Shop Now</button>
              <button className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-full font-semibold hover:bg-[#D4AF37] hover:text-white transition">Explore Collection</button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/70 backdrop-blur p-4 text-center rounded-xl border border-[#E5E7EB]">
                  <div className="text-2xl flex justify-center">{stat.icon}</div>
                  <p className="text-sm font-bold text-[#111827] mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative">
            <img src="https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=600&h=600&fit=crop" alt="Premium Dry Fruits" className="rounded-3xl shadow-2xl w-full max-w-lg mx-auto" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;