import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaBox, FaStar, FaSeedling, FaCookie, FaTshirt, FaTruck, FaLeaf, FaMedal, FaHeart } from 'react-icons/fa';

// ✅ Logo Import
import logo from '../../assets/images/logo.png';

const AboutPage = () => {
  const stats = [
    { icon: <FaUsers />, value: '10,000+', label: 'Happy Customers' },
    { icon: <FaBox />, value: '100+', label: 'Products' },
    { icon: <FaStar />, value: '4.9', label: 'Average Rating' },
    { icon: <FaTrophy />, value: '100%', label: 'Natural' },
  ];

  return (
    <div className="bg-[#FFFDF7] py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827]">
            About <span className="text-[#D4AF37]">MAHA ONE</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Your one-stop destination for premium quality dry fruits, sweets, fashion, and more. 
            Quality you can trust, delivered to your doorstep.
          </p>
        </motion.div>

        {/* Content with Logo */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Left Side - Logo Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="MAHA ONE HYPERMART" 
                className="w-full max-w-md rounded-2xl shadow-2xl border border-[#D4AF37]/20 p-8 bg-white"
              />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#0F766E]/10 rounded-full blur-2xl" />
              <div className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37]/20 pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-[#111827] mb-4">Welcome to <span className="text-[#D4AF37]">Maha One Hypermart</span></h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Maha One Hypermart, we bring you a diverse range of premium quality products 
              under one roof. From the finest dry fruits and delicious sweets to stylish 
              fashion wear, we are your ultimate shopping destination.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our mission is to provide our customers with the highest quality products at 
              competitive prices, delivered with care and convenience. We believe in building 
              lasting relationships with our customers through trust, transparency, and 
              exceptional service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're looking for healthy snacks, festive treats, or the latest fashion 
              trends, Maha One Hypermart has something for everyone.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/80 backdrop-blur p-4 rounded-xl border border-[#E5E7EB] text-center shadow-sm"
                >
                  <div className="text-[#D4AF37] text-2xl flex justify-center">{stat.icon}</div>
                  <p className="text-xl font-bold text-[#111827]">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ✅ Categories We Offer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[#111827] text-center mb-8">
            What We <span className="text-[#D4AF37]">Offer</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <FaSeedling className="text-3xl" />, name: 'Dry Fruits', desc: 'Premium quality, handpicked' },
              { icon: <FaCookie className="text-3xl" />, name: 'Sweets', desc: 'Delicious treats & gifts' },
              { icon: <FaTshirt className="text-3xl" />, name: 'Fashion', desc: 'Latest trends & styles' },
              { icon: <FaBox className="text-3xl" />, name: 'More', desc: 'Coming soon...' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB] text-center hover:shadow-lg transition">
                <div className="text-[#D4AF37] flex justify-center mb-2">{item.icon}</div>
                <h3 className="font-semibold text-[#111827]">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ✅ Why Choose Us */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[#111827] text-center mb-8">
            Why Choose <span className="text-[#D4AF37]">Maha One</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <FaMedal className="text-2xl" />, title: 'Premium Quality', desc: 'Only the best products, carefully selected' },
              { icon: <FaTruck className="text-2xl" />, title: 'Fast Delivery', desc: 'Nationwide delivery with care' },
              { icon: <FaLeaf className="text-2xl" />, title: '100% Natural', desc: 'Pure and authentic products' },
              { icon: <FaHeart className="text-2xl" />, title: 'Customer First', desc: 'Your satisfaction is our priority' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB] text-center hover:shadow-lg transition">
                <div className="text-[#D4AF37] flex justify-center mb-2">{item.icon}</div>
                <h3 className="font-semibold text-[#111827] text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AboutPage;