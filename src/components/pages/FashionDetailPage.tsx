import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { 
  FaStar, FaShoppingCart, FaArrowLeft, 
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight,
  FaCircle, FaChevronRight as FaArrowRight
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

interface FashionProduct {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  category: 'men' | 'women' | 'kids' | 'accessories' | 'watches';
  subCategory: string;
  image: string;
  images: string[];
  colorImages?: Record<string, string[]>;
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  material: string;
  careInstructions: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

// ✅ Helper function to convert description to bullet points
const formatDescription = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim());
  return lines.map((line) => {
    if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
      return line.trim();
    }
    if (line.includes(':')) {
      return `• ${line.trim()}`;
    }
    if (line.trim().length < 30 && line.trim() === line.trim().toUpperCase()) {
      return line.trim();
    }
    return `• ${line.trim()}`;
  });
};

const FashionDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // ✅ Slider refs
  const sliderRef = useRef<HTMLDivElement>(null);

  // ✅ Products Data
  const fashionProducts: FashionProduct[] = [
    {
      id: 101,
      name: 'Black Queen - Embroidered Shamoze Silk Suit',
      price: 4250,
      oldPrice: 4950,
      discount: 12,
      rating: 4.9,
      category: 'women',
      subCategory: 'Unstiched',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461517/Gemini_Generated_Image_lneqw1lneqw1lneq_bkwrs8.jpg',
      images: [
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461530/Gemini_Generated_Image_v258zjv258zjv258_kjk3v7.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461516/Gemini_Generated_Image_jeh50rjeh50rjeh5_qszplb.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461450/Gemini_Generated_Image_y94evny94evny94e_bztkvi.jpg'
      ],
      colorImages: {
        'Black': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461517/Gemini_Generated_Image_lneqw1lneqw1lneq_bkwrs8.jpg']
      },
      sizes: ['One Size'],
      colors: ['Black'],
      stock: 10,
      description: `👑 BLACK QUEEN - Premium Luxury Wear

✨ BRAND: JAZMINE
👗 WEARING BY: SADAF KANWAL

🌟 DETAILS:
• PREMIUM HIGH QUALITY SHAMOZ SILK FRONT
• FULLY HEAVY ALTERNET EMBROIDERED NECK
• EMBELISHED WITH HIGH QUALITY ADDA WORK
• PREMIUM HIGH QUALITY SHAMOZ SILK BACK
• PREMIUM HIGH QUALITY SHAMOZ SILK SLEEVES
• PREMIUM HIGH QUALITY DIGITAL PRINTED SHAMOZ SILK TROUSER
• CRINCKLE CHIFFON FULLY HEAVY EMBROIDERED DUPATTA
• EMBELISHED WITH 4SIDE FANCY BEADS ATTACHED

💫 A masterpiece of traditional elegance with modern sophistication.`,
      material: 'Premium Shamoz Silk with Crinkle Chiffon Dupatta',
      careInstructions: 'Dry clean only.',
      isNew: true,
      isFeatured: true
    },
    {
      id: 102,
      name: 'TYE & DYE Suit - 3-Piece Embroidered Shamoze Silk Suit',
      price: 4190,
      oldPrice: 5100,
      discount: 18,
      rating: 4.9,
      category: 'women',
      subCategory: 'Unstiched',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583325/1787569011956_iltiu9.jpg',
      images: [
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583325/1787569011956_iltiu9.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583312/1787581244534_lvdw3y.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583311/1787581244572_fdkeb2.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583306/1787581244725_robym5.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583306/1787581244687_jktjkr.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583315/1787581244504_vza3iu.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583308/1787581244614_v8xdc4.jpg'
      ],
      colorImages: {
        'Green': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583325/1787569011956_iltiu9.jpg'],
        'Blue': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583312/1787581244534_lvdw3y.jpg'],
        'Cream': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583311/1787581244572_fdkeb2.jpg'],
        'Purple': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583306/1787581244725_robym5.jpg'],
        'Orange': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583306/1787581244687_jktjkr.jpg'],
        'Pink': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583308/1787581244614_v8xdc4.jpg']
      },
      sizes: ['One Size'],
      colors: ['Green', 'Blue', 'Cream', 'Purple', 'Orange', 'Pink'],
      stock: 15,
      description: `💎 TYE & DYE - Premium 3-Piece Shamoze Silk Suit

⭐ BRAND: JAZMINE

🌟 FEATURES:
• Shamoze Silk Tye & Dye Printed Shirt
• Beautiful Pearls & Beads Handwork
• Separate Embroidered Sleeves
• Shamoze Silk Tye & Dye Printed Trouser
• Silk Digital Tye & Dye Printed Dupatta
• 3-Piece Dress 👗

✨ Perfect for weddings and formal events.`,
      material: 'Shirt: Shamoze Silk, Sleeves: Embroidered Fabric, Trouser: Shamoze Silk, Dupatta: Silk Digital Tye & Dye Print',
      careInstructions: 'Dry clean only.',
      isNew: true,
      isFeatured: true
    },
    {
      id: 103,
      name: 'AGHA NOOR Unstitched Replica - Embroidered Suit',
      price: 3299,
      oldPrice: 4150,
      discount: 21,
      rating: 4.9,
      category: 'women',
      subCategory: 'Unstiched',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583885/1787583699344_ki0lze.jpg',
      images: [
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583885/1787583699344_ki0lze.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583318/1787581244463_ljbbtx.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583320/1787581244425_fy3z8g.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583323/1787581244386_marq3j.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583325/1787581244345_sv3x4h.jpg'
      ],
      colorImages: {
        'Green': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583318/1787581244463_ljbbtx.jpg'],
        'Pink': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583320/1787581244425_fy3z8g.jpg']
      },
      sizes: ['One Size'],
      colors: ['Green', 'Pink'],
      stock: 10,
      description: `👗 AGHA NOOR - Elegant Embroidered Suit

⭐ BRAND: AGHA NOOR

🌟 FEATURES:
• Pearl Embroidered Neckline
• Pearl Embroidered Front
• Sequence & Pearl Embroidered Sleeves
• Plain Back
• Organza Dupatta with Ball Lace on 4 Sides
• Plain Malai Trouser

🧵 FABRIC:
• Shirt: Organza
• Dupatta: Organza  
• Trouser: Malai

✨ Premium quality with delicate embroidery.`,
      material: 'Shirt: Organza, Dupatta: Organza, Trouser: Malai',
      careInstructions: 'Dry clean only.',
      isNew: true,
      isFeatured: true
    },
    {
      id: 104,
      name: 'MARIA B Exclusive Heavy Embroidered Saree',
      price: 6250,
      oldPrice: 7500,
      discount: 17,
      rating: 4.9,
      category: 'women',
      subCategory: 'Sarees',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787650742/1787649270496_m30x38.jpg',
      images: [
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787650742/1787649270496_m30x38.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787650743/1787649270462_hmbtam.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787652027/1787651444034_t1avmm.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787652027/1787651443978_s7ei26.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787652028/1787651443914_rql0fm.jpg'
      ],
      colorImages: {
        'Grey': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787650743/1787649270462_hmbtam.jpg'],
        'Turquoise': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787652027/1787651444034_t1avmm.jpg'],
        'Black': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787652027/1787651443978_s7ei26.jpg'],
        'Pink': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787650742/1787649270496_m30x38.jpg']
      },
      sizes: ['One Size'],
      colors: ['Grey', 'Turquoise', 'Black', 'Pink'],
      stock: 15,
      description: `👗 A luxurious and elegant saree featuring intricate heavy embroidery, beautiful Adda work, detailed cut-work borders, and hanging tassels. Perfect for weddings, festive occasions, and formal events.

⭐ BRAND: MARIA B

🌟Fully heavy embroidered net front and back
Cut-work borders
Heavy Adda work on front body
Heavy Adda work neckline
Heavy embroidered sleeves with Adda work
Cut-work sleeve cuffs
Hanging tassels
Heavy Jhall embroidered pallu
Cut-work pallu borders
Hanging tassels on pallu
Petticoat included
✨ Premium quality with delicate embroidery.`,
      material: 'Net Saree with Embroidered Net Fabric, Adda Work, Cut-Work Borders and Petticoat.',
      careInstructions: 'Dry clean only.',
      isNew: true,
      isFeatured: true
    },
  ];

  const product = fashionProducts.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Product Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">The product you are looking for does not exist.</p>
          <Link to="/fashion" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Fashion
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Get all images
  const allImages = product.images.length > 0 ? product.images : [product.image];
  const mainImageUrl = mainImage || allImages[0] || product.image;

  // ✅ Image Navigation
  const nextImage = () => {
    const currentIndex = allImages.indexOf(mainImageUrl);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setMainImage(allImages[nextIndex]);
    setImageLoaded(false);
  };

  const prevImage = () => {
    const currentIndex = allImages.indexOf(mainImageUrl);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setMainImage(allImages[prevIndex]);
    setImageLoaded(false);
  };

  const totalPrice = product.price * quantity;

  const isSizeRequired = product.sizes.length > 0 && product.sizes[0] !== 'One Size';
  const isColorRequired = product.colors.length > 0;

  const canAddToCart = () => {
    if (isSizeRequired && !selectedSize) return false;
    if (isColorRequired && !selectedColor) return false;
    return true;
  };

  // ✅ Color Map
  const colorMap: Record<string, string> = {
    'Red': 'bg-red-500', 'Blue': 'bg-blue-500', 'Green': 'bg-green-500',
    'Yellow': 'bg-yellow-400', 'Black': 'bg-black', 'White': 'bg-white border-2 border-gray-300',
    'Pink': 'bg-pink-400', 'Gold': 'bg-yellow-600', 'Silver': 'bg-gray-300',
    'Brown': 'bg-amber-700', 'Grey': 'bg-gray-400', 'Beige': 'bg-amber-100',
    'Rose Gold': 'bg-rose-300', 'Tan': 'bg-amber-500', 'Orange': 'bg-orange-500',
    'Purple': 'bg-purple-500', 'Navy': 'bg-blue-900', 'Teal': 'bg-teal-500',
    'Maroon': 'bg-red-800', 'Olive': 'bg-green-700', 'Peach': 'bg-orange-200',
    'Lavender': 'bg-purple-200', 'Mint': 'bg-green-200', 'Coral': 'bg-red-300',
    'Cream': 'bg-amber-50', 'Turquoise': 'bg-teal-400'
  };

  // ✅ Format description as bullet points
  const descriptionLines = formatDescription(product.description);

  // ✅ Get suggested products (all other products except current)
  const suggestedProducts = fashionProducts.filter(p => p.id !== product.id);

  // ✅ Scroll functions for slider
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-6 md:pt-8 lg:pt-12 pb-4 sm:pb-6 md:pb-8 lg:pb-12">
        
        <Link to="/fashion" className="inline-flex items-center gap-2 text-[#0F766E] dark:text-[#14b8a6] hover:text-[#D4AF37] transition mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
          <FaArrowLeft className="text-xs sm:text-sm md:text-base" /> Back to Fashion
        </Link>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          
          {/* ============================================================
          ✅ PRODUCT IMAGES GALLERY
          ============================================================ */}
          <div className="relative">
            <div className="bg-[#F5F3FF] dark:bg-[#1F2937] rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-gray-700 relative">
              <div className="w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] relative">
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/600x800/D4AF37/FFFFFF?text=${product.name}`;
                    setImageLoaded(true);
                  }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 sm:p-2.5 hover:bg-white dark:hover:bg-gray-700 transition shadow-lg z-10"
                  >
                    <FaChevronLeft className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 sm:p-2.5 hover:bg-white dark:hover:bg-gray-700 transition shadow-lg z-10"
                  >
                    <FaChevronRight className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/70 text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full z-10">
                {allImages.indexOf(mainImageUrl) + 1} / {allImages.length}
              </div>
            )}

            <div className="mt-2 sm:mt-3 md:mt-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-1.5 sm:gap-2 min-w-max">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMainImage(img);
                      setImageLoaded(false);
                    }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      mainImage === img || (mainImage === '' && i === 0)
                        ? 'border-[#D4AF37] shadow-md'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i+1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/100x100/D4AF37/FFFFFF?text=${i+1}`;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
              -{product.discount}%
            </span>
            {product.isNew && (
              <span className="absolute top-2 left-12 sm:top-3 sm:left-16 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
                NEW
              </span>
            )}
            {product.isFeatured && (
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#D4AF37] text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
                ★ Featured
              </span>
            )}
          </div>

          {/* ============================================================
          ✅ PRODUCT INFO
          ============================================================ */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize">
                {product.category} / {product.subCategory || 'General'}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                ))}
                <span className="text-gray-400 dark:text-gray-500 text-[10px] ml-0.5">({product.rating})</span>
              </div>
            </div>

            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#111827] dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#D4AF37]">
                PKR {product.price.toLocaleString()}
              </span>
              <span className="text-gray-400 dark:text-gray-500 line-through text-sm sm:text-base">
                PKR {product.oldPrice.toLocaleString()}
              </span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                Save {product.discount}%
              </span>
            </div>

            <div className="bg-[#F8FAFC] dark:bg-[#1F2937] rounded-xl border border-[#E5E7EB] dark:border-gray-700 p-3 sm:p-4">
              <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed space-y-1">
                {descriptionLines.map((line, idx) => {
                  if (line.includes('👑') || line.includes('💎') || line.includes('👗') || 
                      (line.length < 30 && line === line.toUpperCase() && line.trim().length > 0)) {
                    return (
                      <div key={idx} className="font-semibold text-[#111827] dark:text-white text-xs sm:text-sm mt-2 first:mt-0">
                        {line}
                      </div>
                    );
                  }
                  if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                    return (
                      <div key={idx} className="flex items-start gap-1.5 sm:gap-2 py-0.5">
                        <FaCircle className="text-[#D4AF37] text-[4px] sm:text-[6px] mt-1.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs">
                          {line.replace(/^[•\-*]\s*/, '')}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs py-0.5">
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-2.5 sm:p-3 md:p-4 bg-[#F8FAFC] dark:bg-[#1F2937] rounded-xl border border-[#E5E7EB] dark:border-gray-700">
              <p className="text-[10px] sm:text-xs md:text-sm"><span className="font-semibold">Material:</span> {product.material}</p>
              <p className="text-[10px] sm:text-xs md:text-sm mt-0.5"><span className="font-semibold">Care:</span> {product.careInstructions}</p>
            </div>

            <div>
              {product.stock > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-red-600 dark:text-red-400 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {isSizeRequired && (
              <div>
                <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                  Select Size <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition ${
                        selectedSize === size
                          ? 'bg-[#D4AF37] text-white shadow-md'
                          : 'bg-[#F8FAFC] dark:bg-[#1F2937] text-gray-600 dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-gray-700 border border-[#E5E7EB] dark:border-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isColorRequired && (
              <div>
                <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                  Select Color <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.colors.map(color => {
                    const bgColor = colorMap[color] || 'bg-gray-200';
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          if (product.colorImages && product.colorImages[color]) {
                            setMainImage(product.colorImages[color][0]);
                            setImageLoaded(false);
                          }
                        }}
                        className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition ${
                          selectedColor === color
                            ? 'bg-[#D4AF37] text-white shadow-md'
                            : 'bg-[#F8FAFC] dark:bg-[#1F2937] text-gray-600 dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-gray-700 border border-[#E5E7EB] dark:border-gray-700'
                        }`}
                      >
                        <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${bgColor} ${color === 'White' ? 'border border-gray-300' : ''}`}></span>
                        <span className="text-[10px] sm:text-xs">{color}</span>
                        {selectedColor === color && (
                          <span className="text-white text-[8px] sm:text-[10px]">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#F8FAFC] dark:bg-[#1F2937] hover:bg-[#E5E7EB] dark:hover:bg-gray-700 transition flex items-center justify-center"
                >
                  <span className="text-sm sm:text-base font-medium">-</span>
                </button>
                <span className="w-6 sm:w-7 md:w-8 text-center font-semibold text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#F8FAFC] dark:bg-[#1F2937] hover:bg-[#E5E7EB] dark:hover:bg-gray-700 transition flex items-center justify-center"
                >
                  <span className="text-sm sm:text-base font-medium">+</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-2.5 md:gap-3 mt-1">
              <button
                onClick={() => {
                  if (!canAddToCart()) {
                    alert('Please select size and color');
                    return;
                  }
                  addToCart({
                    ...product,
                    price: product.price,
                    size: selectedSize || 'One Size',
                    color: selectedColor || 'Default',
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  alert('✅ Added to Cart!');
                }}
                disabled={product.stock === 0}
                className={`flex-1 px-3 py-2 sm:px-5 sm:py-2.5 md:px-7 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 ${
                  product.stock > 0
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="text-xs sm:text-sm" />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              <button
                onClick={() => {
                  if (!canAddToCart()) {
                    alert('Please select size and color');
                    return;
                  }
                  addToCart({
                    ...product,
                    price: product.price,
                    size: selectedSize || 'One Size',
                    color: selectedColor || 'Default',
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  window.location.href = '/checkout';
                }}
                disabled={product.stock === 0}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 ${
                  product.stock > 0 
                    ? 'bg-[#D4AF37] text-white hover:bg-[#b8941f] cursor-pointer' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-1">
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaTruck className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">Free Delivery</p>
              </div>
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaShieldAlt className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">Premium Quality</p>
              </div>
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaLeaf className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">100% Authentic</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
        ✅ SUGGESTED PRODUCTS SLIDER
        ============================================================ */}
        {suggestedProducts.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">✨</span> You May Also Like
              </h2>
              <Link to="/fashion" className="text-[#D4AF37] hover:text-[#b8941f] transition text-xs sm:text-sm font-medium flex items-center gap-1">
                View All <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="relative">
              {/* Slider Controls - Left */}
              <button
                onClick={scrollLeft}
                className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1F2937] rounded-full p-1.5 sm:p-2 shadow-lg border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition"
              >
                <FaChevronLeft className="text-gray-600 dark:text-gray-400 text-sm sm:text-base" />
              </button>

              {/* Slider Container */}
              <div
                ref={sliderRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {suggestedProducts.map((suggested) => (
                  <Link
                    key={suggested.id}
                    to={`/fashion/${suggested.id}`}
                    className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] bg-white dark:bg-[#1F2937] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#E5E7EB] dark:border-gray-700 hover:-translate-y-1 group"
                  >
                    <div className="relative aspect-square bg-[#F5F3FF] dark:bg-[#1F2937]">
                      <img
                        src={suggested.image}
                        alt={suggested.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${suggested.name}`;
                        }}
                      />
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        -{suggested.discount}%
                      </span>
                      {suggested.isNew && (
                        <span className="absolute top-1 left-10 bg-green-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="p-2 sm:p-3">
                      <h4 className="font-semibold text-[#111827] dark:text-white text-[10px] sm:text-xs line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                        {suggested.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                        <span className="text-[#D4AF37] font-bold text-xs sm:text-sm">
                          PKR {suggested.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 line-through text-[8px] sm:text-[10px]">
                          PKR {suggested.oldPrice.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (suggested.stock > 0) {
                            addToCart({ ...suggested, quantity: 1 });
                            alert(`✅ ${suggested.name} added to cart!`);
                          }
                        }}
                        disabled={suggested.stock === 0}
                        className={`w-full mt-1 px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-medium transition flex items-center justify-center gap-1 ${
                          suggested.stock > 0
                            ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart className="text-[8px] sm:text-[10px]" />
                        {suggested.stock > 0 ? 'Add' : 'Sold'}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Slider Controls - Right */}
              <button
                onClick={scrollRight}
                className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1F2937] rounded-full p-1.5 sm:p-2 shadow-lg border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition"
              >
                <FaChevronRight className="text-gray-600 dark:text-gray-400 text-sm sm:text-base" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionDetailPage;