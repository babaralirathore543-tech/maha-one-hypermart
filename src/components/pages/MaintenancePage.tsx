// src/components/pages/MaintenancePage.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaTools, 
  FaClock, 
  FaEnvelope, 
  FaWhatsapp, 
  FaFacebook, 
  FaInstagram, 
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MaintenancePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 72,
    minutes: 0,
    seconds: 0
  });

  // ✅ Countdown Timer (72 hours from now)
  useEffect(() => {
    const maintenanceEnd = new Date();
    maintenanceEnd.setHours(maintenanceEnd.getHours() + 72);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = maintenanceEnd.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        clearInterval(timer);
        window.location.href = '/';
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ Social Media Links
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebook className="text-2xl" />,
      url: 'https://www.facebook.com/share/1CS3PhXJh9/',
      color: 'hover:bg-[#1877F2]'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="text-2xl" />,
      url: 'https://www.instagram.com/mahaonehypermarket?utm_source=qr&igsh=cDd4OHAxb20yMm1q',
      color: 'hover:bg-gradient-to-br from-[#E4405F] via-[#F58529] to-[#833AB4]'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube className="text-2xl" />,
      url: 'https://www.youtube.com/@MahaOneHyperMarket',
      color: 'hover:bg-[#FF0000]'
    },
    {
      name: 'TikTok',
      icon: <FaTiktok className="text-2xl" />,
      url: 'https://www.tiktok.com/@maha.one.hyper.ma?_r=1&_t=ZS-992Feajrx01',
      color: 'hover:bg-black'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F766E] via-[#065F46] to-[#0A3D38] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10">
        
        {/* Logo - Cloudinary Image */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787685509/logo_mhrzum.png"
              alt="Maha One Hypermart"
              className="w-56 h-auto mx-auto"
            />
            <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase mt-3">
              Premium Shopping Experience
            </p>
          </motion.div>
        </div>

        {/* Icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-block bg-white/5 p-6 rounded-full border border-white/10">
            <FaTools className="text-6xl text-[#D4AF37] animate-spin-slow" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            We'll Be Back Soon!
          </h2>
          <p className="text-white/50 text-base md:text-lg mt-3 max-w-lg mx-auto">
            Our website is currently undergoing scheduled maintenance
            <br className="hidden sm:block" />
            to serve you better.
          </p>
        </motion.div>

        {/* Timer - 72 Hours */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto my-10"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/5 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-white/30 text-xs uppercase tracking-wider mt-2">Hours</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/5 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-white/30 text-xs uppercase tracking-wider mt-2">Minutes</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/5 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-white/30 text-xs uppercase tracking-wider mt-2">Seconds</div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <FaClock className="text-white/10" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-white/30 text-sm max-w-md mx-auto leading-relaxed"
        >
          <p>
            We're working hard to improve your shopping experience.
            <br />
            Please check back later. Thank you for your patience! 🙏
          </p>
        </motion.div>

        {/* Contact - Website Removed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-white/30 text-sm mb-3">Need help? Contact us:</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 flex-wrap">
            <a
              href="mailto:mahaonehypermarket@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 text-sm border border-white/5 hover:border-white/20"
            >
              <FaEnvelope /> mahaonehypermarket@gmail.com
            </a>
            <a
              href="https://wa.me/923033169725"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 text-sm border border-white/5 hover:border-white/20"
            >
              <FaWhatsapp /> +92 303 3169725
            </a>
          </div>
        </motion.div>

        {/* Social Media - Linkable Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-8"
        >
          <p className="text-center text-white/20 text-[10px] uppercase tracking-[0.3em] mb-4">
            Follow us on social media
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (index * 0.1), duration: 0.4 }}
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 ${social.color}`}
                whileHover={{ scale: 1.15, y: -3 }}
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
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="text-white/10 text-xs space-y-1">
            <p>© {new Date().getFullYear()} Maha One Hypermart. All rights reserved.</p>
            <p className="text-[10px] text-white/5">
              Made with Mahaone.org in Pakistan
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenancePage;