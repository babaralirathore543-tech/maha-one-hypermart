import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowRight } from 'react-icons/fa';
// ❌ FaStar, FaTruck, FaShieldAlt, FaHeadset removed - unused

interface PopupProps {
  image: string;
  delay?: number;
}

const Popup: React.FC<PopupProps> = ({ 
  image,
  delay = 3000 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('popupSeen');
    if (seen === 'true') {
      setHasSeen(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('popupSeen', 'true');
    setHasSeen(true);
  };

  if (hasSeen) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup Content */}
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-up">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition"
        >
          <FaTimes className="text-gray-600 hover:text-gray-900" />
        </button>

        {/* Image */}
        <div className="relative">
          <img 
            src={image} 
            alt="Maha One Popup"
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Maha+One';
            }}
          />
          
          {/* SHOP NOW Button - Bottom Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <a
              href="/shop"
              onClick={() => {
                localStorage.setItem('popupSeen', 'true');
              }}
              className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#b8941f] text-white px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl w-full text-sm uppercase tracking-wider"
            >
              SHOP NOW <FaArrowRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;