import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaBox, FaStar } from 'react-icons/fa';

// ✅ Logo Import
import logo from '../../assets/images/logo.png';

const AboutPage = () => {
  const stats = [
    { icon: <FaUsers />, value: '10,000+', label: 'Happy Customers' },
    { icon: <FaBox />, value: '50+', label: 'Products' },
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
            Pakistan's premium dry fruit brand, bringing you the finest quality nuts and dried fruits from around the world.
          </p>
        </motion.div>

        {/* Content with Logo */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          
          {/* ✅ Left Side - Logo Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              {/* Logo */}
              <img 
                src={logo} 
                alt="MAHA ONE HYPERMART" 
                className="w-full max-w-md rounded-2xl shadow-2xl border border-[#D4AF37]/20 p-8 bg-white"
              />
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#0F766E]/10 rounded-full blur-2xl" />
              
              {/* Gold Border Ring */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37]/20 pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-[#111827] mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              MAHA ONE was born from a passion for health and quality. We believe that everyone deserves access to the finest dry fruits, sourced ethically and delivered fresh.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              From the lush valleys of Pakistan to the finest farms worldwide, we handpick every product to ensure premium quality.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default AboutPage;