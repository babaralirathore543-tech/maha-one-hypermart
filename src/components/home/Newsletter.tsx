import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';

const Newsletter = () => {
  return (
    <section className="py-20 bg-[#FFFDF7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/70 backdrop-blur p-8 md:p-12 text-center rounded-2xl border border-[#E5E7EB] relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#0F766E]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <FaEnvelope className="text-5xl text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-[#111827]">Get Healthy Offers <span className="text-gold-gradient">Every Week</span></h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-lg mx-auto">Subscribe for premium offers, health tips, and exclusive discounts.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300" />
              <button className="bg-gradient-to-r from-[#D4AF37] to-[#b8941f] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">Subscribe</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;