import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  FaStar, FaHeart, FaShoppingCart, FaArrowLeft, 
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ✅ Product Interface with colorImages
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

const FashionDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');

  // ✅ ALL PRODUCTS - Complete Data
  const fashionProducts: FashionProduct[] = [
    // ==================== 👨 MEN ====================
    {
      id: 107,
      name: 'Premium Cotton T-Shirt',
      price: 1200,
      oldPrice: 1500,
      discount: 20,
      rating: 4.5,
      category: 'men',
      subCategory: 'tshirts',
      image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/men/tshirts/tshirt-1-main.jpg',
      images: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/men/tshirts/tshirt-1-main.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/men/tshirts/tshirt-1-2.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/men/tshirts/tshirt-1-3.jpg'
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Blue', 'Red', 'Grey'],
      stock: 60,
      description: 'Soft and comfortable cotton t-shirt. Perfect for daily wear.',
      material: '100% Cotton',
      careInstructions: 'Machine wash warm. Tumble dry low.',
      isNew: true
    },

    // ==================== 👩 WOMEN ====================
    {
      id: 201,
      name: 'Premium Embroidered Lawn Suit',
      price: 4500,
      oldPrice: 5500,
      discount: 18,
      rating: 4.8,
      category: 'women',
      subCategory: 'lawn',
      image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/women/lawn/lawn-1-main.jpg',
      images: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/women/lawn/lawn-1-main.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/women/lawn/lawn-1-2.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/women/lawn/lawn-1-3.jpg'
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Red', 'Blue', 'Green', 'Yellow'],
      stock: 45,
      description: 'Premium embroidered lawn suit with digital prints. Perfect for summer wear.',
      material: '100% Lawn Cotton',
      careInstructions: 'Dry clean recommended. Iron on low heat.',
      isNew: true
    },
    {
      id: 209,
      name: '1 Carat Zircon Locket Set',
      price: 1650,
      oldPrice: 1900,
      discount: 19,
      rating: 4.8,
      category: 'women',
      subCategory: 'accessories',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg',
      images: [
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_red_ldhifj.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_green_sccnmw.jpg',
        'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_blue_ymumqp.jpg'
      ],
      colorImages: {
      'Red': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_red_ldhifj.jpg'],
      'Blue': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_blue_ymumqp.jpg'],
      'Black': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg'],
      'Green': ['https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_green_sccnmw.jpg']
    },
      sizes: ['One Size'],
      colors: ['Green', 'Black', 'Red', 'Blue'],
      stock: 15,
      description: 'Beautiful 1 Carat Zircon Locket Set with elegant design.',
      material: 'Zircon with Alloy Setting',
      careInstructions: 'Wipe with soft cloth. Keep in jewelry box.'
    },

    // ==================== 👶 KIDS ====================
    {
      id: 301,
      name: 'Kids Cotton T-Shirt',
      price: 1200,
      oldPrice: 1500,
      discount: 20,
      rating: 4.5,
      category: 'kids',
      subCategory: 'tshirts',
      image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/kids/tshirts/kids-tshirt-1-main.jpg',
      images: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/kids/tshirts/kids-tshirt-1-main.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/kids/tshirts/kids-tshirt-1-2.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/kids/tshirts/kids-tshirt-1-3.jpg'
      ],
      sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
      colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink'],
      stock: 35,
      description: 'Soft and comfortable cotton t-shirt for kids.',
      material: '100% Cotton',
      careInstructions: 'Machine wash warm. Tumble dry low.',
      isNew: true
    },
  

    // ==================== ⌚ WATCHES ====================
    {
      id: 501,
      name: 'Premium Luxury Gold Watch',
      price: 25000,
      oldPrice: 32000,
      discount: 22,
      rating: 4.9,
      category: 'watches',
      subCategory: 'luxury',
      image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/watches/luxury/watch-1-main.jpg',
      images: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/watches/luxury/watch-1-main.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/watches/luxury/watch-1-2.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/fashion/watches/luxury/watch-1-3.jpg'
      ],
      sizes: ['One Size'],
      colors: ['Gold', 'Silver', 'Rose Gold'],
      stock: 10,
      description: 'Premium luxury watch with gold plating. Perfect for formal occasions.',
      material: 'Stainless Steel with Gold Plating',
      careInstructions: 'Wipe clean with soft cloth. Avoid water contact.',
      isNew: true,
      isFeatured: true
    },
  ];

  // ✅ Find product by ID
  const product = fashionProducts.find(p => p.id === parseInt(id || '0'));

  // ✅ If product not found
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111827]">Product Not Found</h1>
          <p className="text-gray-500 mt-2">The product you are looking for does not exist.</p>
          <Link to="/fashion" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Fashion
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Get main image (first image or selected)
  const mainImageUrl = mainImage || product.images[0] || product.image;

  // ✅ Image Gallery Navigation
  const nextImage = () => {
    const currentIndex = product.images.indexOf(mainImageUrl);
    const nextIndex = (currentIndex + 1) % product.images.length;
    setMainImage(product.images[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = product.images.indexOf(mainImageUrl);
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setMainImage(product.images[prevIndex]);
  };

  // ✅ Total price
  const totalPrice = product.price * quantity;

  // ✅ Check if size and color are selected for add to cart
  const isSizeRequired = product.sizes.length > 0 && product.sizes[0] !== 'One Size';
  const isColorRequired = product.colors.length > 0;

  const canAddToCart = () => {
    if (isSizeRequired && !selectedSize) return false;
    if (isColorRequired && !selectedColor) return false;
    return true;
  };

  // ✅ Color Map for Display
  const colorMap: Record<string, string> = {
    'Red': 'bg-red-500',
    'Blue': 'bg-blue-500',
    'Green': 'bg-green-500',
    'Yellow': 'bg-yellow-400',
    'Black': 'bg-black',
    'White': 'bg-white border-2 border-gray-300',
    'Pink': 'bg-pink-400',
    'Gold': 'bg-yellow-600',
    'Silver': 'bg-gray-300',
    'Brown': 'bg-amber-700',
    'Grey': 'bg-gray-400',
    'Beige': 'bg-amber-100',
    'Rose Gold': 'bg-rose-300',
    'Tan': 'bg-amber-500',
    'Orange': 'bg-orange-500',
    'Purple': 'bg-purple-500',
    'Navy': 'bg-blue-900',
    'Teal': 'bg-teal-500',
    'Maroon': 'bg-red-800',
    'Olive': 'bg-green-700',
    'Peach': 'bg-orange-200',
    'Lavender': 'bg-purple-200',
    'Mint': 'bg-green-200',
    'Coral': 'bg-red-300'
  };

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ Back Button */}
        <Link to="/fashion" className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition mb-6">
          <FaArrowLeft /> Back to Fashion
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* ===== PRODUCT IMAGES GALLERY ===== */}
          <div className="relative">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB] relative">
              <img
                src={mainImageUrl}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-cover transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/600x600/D4AF37/FFFFFF?text=${product.name}`;
                }}
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-lg"
                  >
                    <FaChevronLeft className="text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-lg"
                  >
                    <FaChevronRight className="text-gray-600" />
                  </button>
                </>
              )}
            </div>

            {/* Image Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {product.images.indexOf(mainImageUrl) + 1} / {product.images.length}
              </div>
            )}

            {/* ✅ Thumbnails - 3 Images */}
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    mainImage === img || (mainImage === '' && i === 0)
                      ? 'border-[#D4AF37] shadow-md'
                      : 'border-transparent hover:border-gray-300'
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

            {/* Badges */}
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{product.discount}% OFF
            </span>
            {product.isNew && (
              <span className="absolute top-4 left-24 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                NEW
              </span>
            )}
            <button className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-[#D4AF37] transition">
              <FaHeart className="text-gray-600 hover:text-white" />
            </button>
          </div>

          {/* ===== PRODUCT INFO ===== */}
          <div>
            {/* Category & Rating */}
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium capitalize">
                {product.category} / {product.subCategory}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                ))}
                <span className="text-gray-400 text-xs ml-1">({product.rating})</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-[#D4AF37]">PKR {product.price.toLocaleString()}</span>
              <span className="text-gray-400 line-through text-lg">PKR {product.oldPrice.toLocaleString()}</span>
              <span className="bg-green-100 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
                Save {product.discount}%
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

            {/* Material & Care */}
            <div className="mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
              <p className="text-sm"><span className="font-semibold">Material:</span> {product.material}</p>
              <p className="text-sm mt-1"><span className="font-semibold">Care:</span> {product.careInstructions}</p>
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Size <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedSize === size
                          ? 'bg-[#D4AF37] text-white shadow-md'
                          : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ Color Selector with Image Change */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Color <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => {
                    const bgColor = colorMap[color] || 'bg-gray-200';
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          // ✅ Color select karne par image update
                          if (product.colorImages && product.colorImages[color]) {
                            setMainImage(product.colorImages[color][0]);
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition ${
                          selectedColor === color
                            ? 'bg-[#D4AF37] text-white shadow-lg scale-105'
                            : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                        }`}
                      >
                        {/* ✅ Color Circle */}
                        <span className={`w-5 h-5 rounded-full ${bgColor} ${color === 'White' ? 'border border-gray-300' : ''}`}></span>
                        {/* ✅ Color Name */}
                        {color}
                        {/* ✅ Selected Check Mark */}
                        {selectedColor === color && (
                          <span className="ml-1 text-white">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#E5E7EB] transition"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#E5E7EB] transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4 mt-8">
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
                    color: selectedColor,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  alert('✅ Added to Cart!');
                }}
                disabled={product.stock === 0}
                className={`flex-1 px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  product.stock > 0
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
                    color: selectedColor,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  window.location.href = '/checkout';
                }}
                disabled={product.stock === 0}
                className={`bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  product.stock > 0 
                    ? 'hover:bg-[#b8941f] cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaTruck className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Free Delivery</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaShieldAlt className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Premium Quality</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaLeaf className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">100% Authentic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionDetailPage;