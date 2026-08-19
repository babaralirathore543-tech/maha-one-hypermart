import { Link } from 'react-router-dom';
import { FaMapPin, FaTruck, FaMapMarkerAlt, FaHeadset, FaWhatsapp, FaFacebook, FaInstagram, FaGoogle } from 'react-icons/fa';

const AnnouncementBar = () => {
  return (
    <div className="bg-[#065F46] text-white text-xs md:text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FaMapPin className="text-[#D4AF37]" />
          <span>🇵🇰 Deliver to Pakistan</span>
        </div>
        
        <div className="flex items-center gap-4">
          <FaTruck />
          <span>Free Delivery</span>
          <FaMapMarkerAlt />
          <span>Order Tracking</span>
          <FaHeadset />
          <span>Support</span>
        </div>
        
        <div className="flex items-center gap-3">
          <FaWhatsapp className="text-green-400" />
          <FaFacebook className="text-blue-400" />
          <FaInstagram className="text-pink-400" />
          <FaGoogle className="text-yellow-400" />
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/login" className="hover:text-[#D4AF37] transition-colors">Login</Link>
          <Link to="/register" className="hover:text-[#D4AF37] transition-colors">Register</Link>
          <span className="border-l border-white/30 pl-3">PKR</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;