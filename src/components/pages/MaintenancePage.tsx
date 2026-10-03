// src/components/pages/MaintenancePage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaTools,
  FaEnvelope,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaClock,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaRocket,
  FaShieldAlt,
  FaHeart,
} from 'react-icons/fa';
import { Sparkles, RefreshCw } from 'lucide-react';

// ============================================================
// LOGO URL (Cloudinary)
// ============================================================
const LOGO_URL =
  'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787685509/logo_mhrzum.png';

// ============================================================
// TYPES
// ============================================================
interface MaintenancePageProps {
  /** Optional custom message from Firestore config */
  message?: string;
  /** Optional expected completion time (ISO string or display text) */
  expectedBack?: string;
  /** Optional progress percentage (0-100) */
  progress?: number;
}

// ============================================================
// COMPONENT
// ============================================================
const MaintenancePage: React.FC<MaintenancePageProps> = ({
  message,
  expectedBack,
  progress,
}) => {
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progressValue, setProgressValue] = useState(progress || 0);

  // ============================================================
  // COUNTDOWN TIMER
  // ============================================================
  useEffect(() => {
    // ✅ Fixed 24 hours from now (change this as needed)
    const maintenanceEnd = new Date();
    maintenanceEnd.setHours(maintenanceEnd.getHours() + 24);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = maintenanceEnd.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // PROGRESS ANIMATION
  // ============================================================
  useEffect(() => {
    if (progress !== undefined) {
      setProgressValue(progress);
      return;
    }
    // Simulate progress (10% → 85%)
    const timer = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 85) return prev;
        return Math.min(prev + 1, 85);
      });
    }, 800);
    return () => clearInterval(timer);
  }, [progress]);

  // ============================================================
  // SOCIAL LINKS
  // ============================================================
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      url: 'https://www.facebook.com/share/1CS3PhXJh9/',
      color: 'hover:bg-[#1877F2]',
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      url: 'https://www.instagram.com/mahaonehypermarket',
      color: 'hover:bg-gradient-to-br hover:from-[#E4405F] hover:via-[#F58529] hover:to-[#833AB4]',
    },
    {
      name: 'YouTube',
      icon: <FaYoutube />,
      url: 'https://www.youtube.com/@MahaOneHyperMarket',
      color: 'hover:bg-[#FF0000]',
    },
    {
      name: 'TikTok',
      icon: <FaTiktok />,
      url: 'https://www.tiktok.com/@maha.one.hyper.ma',
      color: 'hover:bg-black',
    },
  ];

  // ============================================================
  // FEATURES (what's coming)
  // ============================================================
  const features = [
    {
      icon: <FaRocket />,
      title: 'Faster Performance',
      desc: 'Optimized loading & faster checkout',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Enhanced Security',
      desc: 'Better protection for your data',
    },
    {
      icon: <Sparkles />,
      title: 'New Features',
      desc: 'Exciting updates coming soon',
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F766E] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative blur circles */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#0F766E]/30 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-white/10"
      >
        {/* ============================================================
            LOGO + BRANDING
        ============================================================ */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6 sm:mb-8"
        >
          <img
            src={LOGO_URL}
            alt="MAHA ONE HYPERMARKET"
            className="w-40 sm:w-52 md:w-64 h-auto mx-auto drop-shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />

          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-[#D4AF37]">MAHA</span>
              <span className="text-white"> ONE</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-white/50 tracking-[0.4em] uppercase mt-1">
              HYPERMART
            </p>
          </div>
        </motion.div>

        {/* ============================================================
            MAINTENANCE ICON
        ============================================================ */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-white/5 p-5 sm:p-6 rounded-full border border-white/10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <FaTools className="text-4xl sm:text-5xl md:text-6xl text-[#D4AF37]" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            TITLE + MESSAGE
        ============================================================ */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            We'll Be Back Soon! 🚧
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {message ||
              "Our website is currently undergoing scheduled maintenance to serve you better. We appreciate your patience and apologize for any inconvenience."}
          </p>
          {expectedBack && (
            <p className="text-[#D4AF37] text-xs sm:text-sm mt-3 font-medium">
              Expected back: {expectedBack}
            </p>
          )}
        </motion.div>

        {/* ============================================================
            COUNTDOWN TIMER
        ============================================================ */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto my-6 sm:my-8"
        >
          <TimeCard value={timeLeft.hours} label="Hours" delay={0} />
          <TimeCard value={timeLeft.minutes} label="Minutes" delay={0.05} />
          <TimeCard value={timeLeft.seconds} label="Seconds" delay={0.1} />
        </motion.div>

        {/* ============================================================
            PROGRESS BAR
        ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-md mx-auto mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
            <span className="text-white/60 flex items-center gap-1.5">
              <RefreshCw size={12} className="animate-spin" />
              Maintenance Progress
            </span>
            <span className="text-[#D4AF37] font-bold">{progressValue}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] rounded-full shadow-lg shadow-[#D4AF37]/30"
            />
          </div>
        </motion.div>

        {/* ============================================================
            FEATURES — What's coming
        ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-colors duration-300 text-center"
            >
              <div className="text-[#D4AF37] text-2xl sm:text-3xl mb-2 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                {feature.title}
              </h3>
              <p className="text-white/50 text-xs sm:text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ============================================================
            DIVIDER
        ============================================================ */}
        <div className="flex items-center gap-3 sm:gap-4 my-6 sm:my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-[#D4AF37] text-[10px] sm:text-xs tracking-[0.3em]">
            ✦ CONTACT US ✦
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* ============================================================
            CONTACT SECTION
        ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <p className="text-white/50 text-center text-xs sm:text-sm mb-4">
            Need urgent help? Reach out to us:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Email */}
            <a
              href="mailto:mahaonehypermarket@gmail.com"
              className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/30 transition-colors">
                <FaEnvelope className="text-[#D4AF37]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-xs sm:text-sm truncate">
                  mahaonehypermarket@gmail.com
                </p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923033169725"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/30 transition-colors">
                <FaWhatsapp className="text-[#25D366]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  WhatsApp
                </p>
                <p className="text-xs sm:text-sm">+92 303 3169725</p>
              </div>
            </a>
          </div>

          {/* Address & Hours Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-white/60 border border-white/5">
              <FaMapMarkerAlt className="text-[#D4AF37] flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Location
                </p>
                <p className="text-xs sm:text-sm">Ayesha Manzil, Karachi</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-white/60 border border-white/5">
              <FaClock className="text-[#D4AF37] flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Business Hours
                </p>
                <p className="text-xs sm:text-sm">Mon-Sat: 9AM - 9PM</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            SOCIAL MEDIA
        ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] mb-4">
            Follow us on social media
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  inline-flex items-center justify-center
                  w-11 h-11 sm:w-12 sm:h-12
                  rounded-full
                  bg-white/5 hover:bg-white/15
                  text-white/60 hover:text-white
                  transition-all duration-300
                  border border-white/10 hover:border-white/30
                  ${social.color}
                `}
                title={`Follow us on ${social.name}`}
                aria-label={social.name}
              >
                <span className="text-lg sm:text-xl">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ============================================================
            STATUS BANNER
        ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-[#D4AF37] text-lg flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white/80 text-xs sm:text-sm font-medium">
                Your orders and data are safe!
              </p>
              <p className="text-white/50 text-[10px] sm:text-xs mt-0.5">
                All existing orders will be processed as normal. We'll notify
                you via WhatsApp once we're back online.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            FOOTER
        ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center"
        >
          <div className="text-white/30 text-[10px] sm:text-xs space-y-1">
            <p className="flex items-center justify-center gap-1.5">
              Made with
              <FaHeart className="text-red-400 text-xs animate-pulse" />
              in Pakistan
            </p>
            <p>
              © {new Date().getFullYear()} Maha One Hypermart. All rights
              reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ============================================================
// TIME CARD (small helper)
// ============================================================
interface TimeCardProps {
  value: number;
  label: string;
  delay?: number;
}

const TimeCard: React.FC<TimeCardProps> = ({ value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-5 text-center border border-white/10 hover:bg-white/10 transition-colors duration-300"
  >
    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37] font-mono tabular-nums">
      {String(value).padStart(2, '0')}
    </div>
    <div className="text-white/40 text-[9px] sm:text-xs uppercase tracking-wider mt-1.5 sm:mt-2">
      {label}
    </div>
  </motion.div>
);

export default MaintenancePage;