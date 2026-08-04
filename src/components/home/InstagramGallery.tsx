import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

const images = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1598114004903-2d4e1d5d8fa2?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1587923623986-c6d34e9a286b?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582320130174-bce5cf11b865?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=300&h=300&fit=crop',
];

const InstagramGallery = () => {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Instagram</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">Follow Us <span className="text-gold-gradient">@mahaone</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {images.map((img, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer">
              <img src={img} alt="Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaHeart className="text-white text-2xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;