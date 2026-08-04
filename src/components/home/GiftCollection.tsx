import { motion } from 'framer-motion';
import { FaGift } from 'react-icons/fa';

const gifts = [
  { name: 'Corporate Gift Box', price: '2,500', image: 'https://images.unsplash.com/photo-1549465220-1a8b5f9a5e9d?w=400&h=400&fit=crop' },
  { name: 'Wedding Gift', price: '3,000', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop' },
  { name: 'Ramadan Box', price: '1,800', image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=400&h=400&fit=crop' },
  { name: 'Eid Collection', price: '2,200', image: 'https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=400&h=400&fit=crop' },
];

const GiftCollection = () => {
  return (
    <section className="py-20 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Gift Collection</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">Premium <span className="text-gold-gradient">Gift Boxes</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {gifts.map((gift, index) => (
            <motion.div key={gift.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-2xl">
              <div className="relative h-72 overflow-hidden">
                <img src={gift.image} alt={gift.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <FaGift className="text-[#D4AF37] text-2xl mb-2" />
                  <h3 className="text-lg font-semibold">{gift.name}</h3>
                  <p className="text-sm text-white/70">From PKR {gift.price}</p>
                  <button className="mt-3 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#c4a030] transition">Explore</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftCollection;