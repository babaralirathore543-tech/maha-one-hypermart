import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  { id: 1, name: 'Ayesha Khan', location: 'Karachi', text: 'The best dry fruits I have ever tasted! Premium quality and fresh delivery. Highly recommend MAHA ONE!', rating: 5, image: '👩' },
  { id: 2, name: 'Dr. Usman Ahmed', location: 'Lahore', text: 'As a nutritionist, I recommend MAHA ONE to all my clients. Pure, natural, and chemical-free products.', rating: 5, image: '👨' },
  { id: 3, name: 'Fatima Ali', location: 'Islamabad', text: 'The gift boxes are stunning! Perfect for corporate gifting. The packaging is absolutely premium.', rating: 5, image: '👩' },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-[#FFFDF7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">What Our <span className="text-gold-gradient">Customers Say</span></h2>
        </motion.div>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="bg-white/70 backdrop-blur p-8 md:p-12 text-center rounded-2xl border border-[#E5E7EB]">
              <FaQuoteLeft className="text-[#D4AF37] text-4xl opacity-30 mx-auto mb-6" />
              <p className="text-lg md:text-xl text-[#111827] leading-relaxed">"{testimonials[currentIndex].text}"</p>
              <div className="flex justify-center text-[#D4AF37] text-xl mt-4">{[...Array(5)].map((_, i) => (<FaStar key={i} />))}</div>
              <div className="mt-4"><span className="text-4xl block">{testimonials[currentIndex].image}</span><h4 className="font-semibold text-[#111827] mt-2">{testimonials[currentIndex].name}</h4><p className="text-sm text-gray-500">{testimonials[currentIndex].location}</p></div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (<button key={index} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-gray-300'}`} />))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;