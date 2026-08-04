import { motion } from 'framer-motion';
import { FaLeaf, FaBox, FaTruck, FaMedal, FaShieldAlt, FaLock } from 'react-icons/fa';

const reasons = [
  { icon: <FaLeaf className="text-3xl" />, title: '100% Natural', description: 'Pure, organic, and chemical-free dry fruits.' },
  { icon: <FaBox className="text-3xl" />, title: 'Fresh Packaging', description: 'Vacuum-sealed to preserve freshness.' },
  { icon: <FaTruck className="text-3xl" />, title: 'Fast Delivery', description: 'Nationwide delivery across Pakistan.' },
  { icon: <FaMedal className="text-3xl" />, title: 'Premium Quality', description: 'Handpicked from the finest farms.' },
  { icon: <FaShieldAlt className="text-3xl" />, title: 'No Preservatives', description: '100% natural, no added chemicals.' },
  { icon: <FaLock className="text-3xl" />, title: 'Secure Payments', description: 'Safe and trusted payment methods.' },
];

const WhyChoose = () => {
  return (
    <section className="py-20 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">Why <span className="text-gold-gradient">MAHA ONE</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reasons.map((reason, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur p-6 text-center rounded-xl border border-[#E5E7EB] group">
              <div className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300 flex justify-center">{reason.icon}</div>
              <h4 className="font-semibold text-[#111827] mt-3 text-sm">{reason.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;