import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaTiktok } from 'react-icons/fa';

// ✅ Logo Import
import logo from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-400 border-t border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* ============================================================
          LOGO + MAHA ONE + HYPERMART
          ============================================================ */}
          <div>
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo Image */}
              <img 
                src={logo} 
                alt="MAHA ONE" 
                className="h-10 w-auto object-contain"
              />
              
              {/* Brand Name */}
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold tracking-tight">
                  <span className="text-[#0F766E]">MAHA</span>
                  <span className="text-[#D4AF37]"> ONE</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.35em] text-gray-500 font-medium">
                  HYPERMART
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-gray-500 mt-3">Premium dry fruits, nuts, and healthy snacks sourced from the finest farms.</p>
            
            <div className="flex gap-4 mt-4 text-xl">
              <FaFacebook className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
              <FaInstagram className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
              <FaWhatsapp className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
              <FaTiktok className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
              <FaYoutube className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
            </div>
          </div>

          {/* ============================================================
          QUICK LINKS
          ============================================================ */}
          <div>
            <h5 className="text-white font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Shop All</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* ============================================================
          SUPPORT
          ============================================================ */}
          <div>
            <h5 className="text-white font-semibold mb-4">Support</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faqs" className="hover:text-[#D4AF37] transition-colors">FAQs</Link></li>
              <li><Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms</Link></li>
              <li><Link to="/returns" className="hover:text-[#D4AF37] transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* ============================================================
          NEWSLETTER
          ============================================================ */}
          <div>
            <h5 className="text-white font-semibold mb-4">Newsletter</h5>
            <p className="text-sm text-gray-500 mb-3">Subscribe for premium offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-2 rounded-l-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]" 
              />
              <button className="bg-[#D4AF37] text-black px-4 py-2 rounded-r-lg hover:bg-[#c4a030] transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
          <p>© 2026 MAHA ONE. All Rights Reserved. Made with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;