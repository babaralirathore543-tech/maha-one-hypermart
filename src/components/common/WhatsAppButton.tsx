import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '03033169725';
  const message = 'Assalam-o-Alaikum! 👋 How can we help you?';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',        // ← Left side
        zIndex: 9999,
        backgroundColor: '#25D366',
        color: 'white',
        width: '60px',       // ← Circle size
        height: '60px',      // ← Circle size
        borderRadius: '50%', // ← Circle
        boxShadow: '0 10px 25px rgba(37, 211, 102, 0.4)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(37, 211, 102, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 211, 102, 0.4)';
      }}
    >
      <FaWhatsapp size={32} />
    </a>
  );
};

export default WhatsAppButton;