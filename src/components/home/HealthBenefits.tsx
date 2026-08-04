import { motion } from 'framer-motion';
import { FaHeart, FaAppleAlt, FaBolt, FaLeaf, FaGem, FaBatteryFull } from 'react-icons/fa';

const benefits = [
  { icon: <FaHeart />, title: 'Heart Healthy', desc: 'Rich in healthy fats and antioxidants' },
  { icon: <FaBolt />, title: 'Rich in Protein', desc: 'High-quality plant-based protein source' },
  { icon: <FaLeaf />, title: 'Omega 3', desc: 'Essential fatty acids for brain health' },
  { icon: <FaAppleAlt />, title: 'High Fiber', desc: 'Promotes digestive health' },
  { icon: <FaGem />, title: 'Vitamin E', desc: 'Powerful antioxidant for skin health' },
  { icon: <FaBatteryFull />, title: 'Natural Energy', desc: 'Sustained energy throughout the day' },
];

const HealthBenefits = () => {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <img src="https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=600&h=600&fit=crop" alt="Health Benefits" className="rounded-3xl shadow-2xl w-full" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Health Benefits</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2 mb-6">Why Dry Fruits Are <span className="text-gold-gradient">Good For You</span></h2>
            <p className="text-gray-500 mb-8 leading-relaxed">Packed with essential nutrients, vitamins, and minerals that support overall health and wellness.</p>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="bg-white/70 backdrop-blur p-4 rounded-xl border border-[#E5E7EB] flex items-center gap-3">
                  <div className="text-[#D4AF37] text-xl">{benefit.icon}</div>
                  <div><h4 className="font-semibold text-[#111827] text-sm">{benefit.title}</h4><p className="text-xs text-gray-500">{benefit.desc}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HealthBenefits;