import { Link } from 'react-router-dom';
import { FaArrowLeft, FaClock } from 'react-icons/fa';

const FashionPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#FFFDF7] to-[#F8FAFC] px-4">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="text-8xl mb-6 animate-pulse">👗</div>
        
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-[#111827] mb-4">
          <span className="text-[#0F766E]">Fashion</span>{' '}
          <span className="text-[#D4AF37]">Collection</span>
        </h1>
        
        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-6 py-2 rounded-full text-sm font-medium border border-[#D4AF37]/20 mb-6">
          <FaClock className="text-xs" />
          <span>Coming Soon</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          We're working on something amazing! Our premium fashion collection 
          is coming soon. Stay tuned for the latest trends in luxury wear.
        </p>
        
        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-[#0F766E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#065F46] transition shadow-lg hover:shadow-xl"
        >
          <FaArrowLeft /> Back to Home
        </Link>
        
        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-[#E5E7EB]">
            <span className="text-3xl block mb-2">👕</span>
            <p className="text-sm font-medium text-[#111827]">Premium Wear</p>
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-[#E5E7EB]">
            <span className="text-3xl block mb-2">👗</span>
            <p className="text-sm font-medium text-[#111827]">Luxury Collection</p>
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-[#E5E7EB]">
            <span className="text-3xl block mb-2">👔</span>
            <p className="text-sm font-medium text-[#111827]">Exclusive Styles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionPage;