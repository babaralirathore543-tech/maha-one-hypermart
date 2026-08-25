// src/components/pages/EidMiladPage.tsx
import React from 'react';
import { 
  FaHeart, 
  FaMosque,
  FaFacebook, 
  FaInstagram, 
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaEnvelope
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const EidMiladPage: React.FC = () => {
  // ✅ Social Media Links
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebook className="text-xl sm:text-2xl" />,
      url: 'https://www.facebook.com/share/1CS3PhXJh9/',
      color: 'hover:bg-[#1877F2]'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="text-xl sm:text-2xl" />,
      url: 'https://www.instagram.com/mahaonehypermarket?utm_source=qr&igsh=cDd4OHAxb20yMm1q',
      color: 'hover:bg-gradient-to-br from-[#E4405F] via-[#F58529] to-[#833AB4]'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube className="text-xl sm:text-2xl" />,
      url: 'https://www.youtube.com/@MahaOneHyperMarket',
      color: 'hover:bg-[#FF0000]'
    },
    {
      name: 'TikTok',
      icon: <FaTiktok className="text-xl sm:text-2xl" />,
      url: 'https://www.tiktok.com/@maha.one.hyper.ma?_r=1&_t=ZS-992Feajrx01',
      color: 'hover:bg-black'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F766E] via-[#065F46] to-[#0A3D38] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/10 mx-2 sm:mx-4">
        
        {/* Logo */}
        <div className="text-center mb-4 sm:mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787685509/logo_mhrzum.png"
              alt="Maha One Hypermart"
              className="w-32 sm:w-40 md:w-48 h-auto mx-auto"
            />
          </motion.div>
        </div>

        {/* Islamic Decorative Border */}
        <div className="text-center mb-4 sm:mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="inline-block px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 border border-[#D4AF37]/30 rounded-full bg-[#D4AF37]/5">
              <span className="text-[10px] sm:text-xs md:text-sm text-[#D4AF37] tracking-[0.2em] sm:tracking-[0.3em] font-medium">
                ✦ 12 RABI UL AWWAL ✦
              </span>
            </div>
          </motion.div>
        </div>

        {/* Main Icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-4 sm:mb-6"
        >
          <div className="inline-block bg-white/5 p-4 sm:p-5 md:p-6 rounded-full border border-white/10">
            <FaMosque className="text-4xl sm:text-5xl md:text-6xl text-[#D4AF37]" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mb-3 sm:mb-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#D4AF37]">
            🌙 Amad-e-Rasool ﷺ
          </h1>
          <div className="mt-2 sm:mt-3 text-white/80 text-sm sm:text-base md:text-lg lg:text-xl font-light">
            <p className="text-xl sm:text-2xl md:text-3xl text-white font-arabic">
              ﷺ
            </p>
            <p className="mt-2 px-2 text-xs sm:text-sm md:text-base">
              "And We have not sent you, [O Muhammad], except as a mercy to the worlds."
            </p>
            <p className="text-white/40 text-[10px] sm:text-xs md:text-sm mt-1">
              — Surah Al-Anbiya, 21:107
            </p>
          </div>
        </motion.div>

        {/* Message Box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 my-4 sm:my-6 md:my-8 border border-white/5"
        >
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center gap-1 sm:gap-2 text-[#D4AF37]">
              <FaHeart className="text-xl sm:text-2xl animate-pulse" />
              <FaHeart className="text-xl sm:text-2xl animate-pulse delay-100" />
              <FaHeart className="text-xl sm:text-2xl animate-pulse delay-200" />
            </div>
            
            <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed px-2">
              "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ"
            </p>
            
            <p className="text-white/50 text-[10px] sm:text-xs md:text-sm px-2">
              O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim, verily You are Praiseworthy and Glorious.
            </p>
            
            <div className="flex justify-center gap-1 sm:gap-2 text-[#D4AF37]">
              <FaHeart className="text-xl sm:text-2xl animate-pulse delay-200" />
              <FaHeart className="text-xl sm:text-2xl animate-pulse delay-100" />
              <FaHeart className="text-xl sm:text-2xl animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Today's Special Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block bg-[#D4AF37]/10 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full border border-[#D4AF37]/20">
            <p className="text-white/70 text-[10px] sm:text-xs md:text-sm flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              <span className="text-[#D4AF37]">✦</span>
              Today we are closed in celebration of 
              <span className="text-[#D4AF37] font-semibold">12 Rabi ul Awwal</span>
              <span className="text-[#D4AF37]">✦</span>
            </p>
          </div>
          <p className="text-white/40 text-[10px] sm:text-xs mt-2 sm:mt-3 px-2">
            We will be back tomorrow, Insha'Allah! 
            <br />
            JazakAllah for your understanding. 🤲
          </p>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-2 sm:gap-4 my-4 sm:my-6 md:my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent"></div>
          <span className="text-[#D4AF37] text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em]">✦ 🤲 ✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent"></div>
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-4 sm:mt-6 text-center"
        >
          <p className="text-white/30 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3">Need help? Contact us:</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 flex-wrap px-2">
            <a
              href="mailto:mahaonehypermarket@gmail.com"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 text-[10px] sm:text-xs md:text-sm border border-white/5 hover:border-white/20 w-full sm:w-auto justify-center"
            >
              <FaEnvelope className="text-xs sm:text-sm" /> 
              <span className="truncate">mahaonehypermarket@gmail.com</span>
            </a>
            <a
              href="https://wa.me/923033169725"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 text-[10px] sm:text-xs md:text-sm border border-white/5 hover:border-white/20 w-full sm:w-auto justify-center"
            >
              <FaWhatsapp className="text-xs sm:text-sm" /> 
              +92 303 3169725
            </a>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-6 sm:mt-8"
        >
          <p className="text-center text-white/20 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-3 md:mb-4">
            Follow us on social media
          </p>
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + (index * 0.1), duration: 0.4 }}
                className={`inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 ${social.color}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={`Follow us on ${social.name}`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-6 sm:mt-8 text-center"
        >
          <div className="text-white/10 text-[8px] sm:text-[10px] md:text-xs space-y-0.5 sm:space-y-1">
            <p>© {new Date().getFullYear()} Maha One Hypermart. All rights reserved.</p>
            <p className="text-[7px] sm:text-[9px] md:text-[10px] text-white/5 px-2">
              "And We have not sent you except as a mercy to the worlds." 🌙
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EidMiladPage;