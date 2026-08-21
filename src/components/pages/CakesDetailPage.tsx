import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  FaStar, FaShoppingCart, FaArrowLeft, 
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

interface CakesProduct {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  category: 'celebration' | 'birthday' | 'wedding' | 'custom';
  image: string;
  images: string[];
  sizes: number[];
  flavors: string[];
  stock: number;
  description: string;
  ingredients: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

const CakesDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<number>(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [mainImage, setMainImage] = useState('');

  // ✅ All Cakes Products
  const products: CakesProduct[] = [
    {
      id: 701,
      name: 'Chocolate Fudge Cake',
      price: 1800,
      oldPrice: 2200,
      discount: 18,
      rating: 4.9,
      category: 'celebration',
      image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/cakes/chocolate-fudge-cake.jpg',
      images: [
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/cakes/chocolate-fudge-cake-1.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/cakes/chocolate-fudge-cake-2.jpg',
        'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/cakes/chocolate-fudge-cake-3.jpg'
      ],
      sizes: [1, 2, 3, 4, 5],
      flavors: ['Chocolate', 'Vanilla'],
      stock: 15,
      description: 'Rich and moist chocolate fudge cake with layers of creamy chocolate ganache.',
      ingredients: ['Flour', 'Sugar', 'Cocoa', 'Eggs', 'Butter', 'Chocolate'],
      isNew: true,
      isFeatured: true
    },
    
    
  ];

  const product = products.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111827]">Cake Not Found</h1>
          <p className="text-gray-500 mt-2">The cake you are looking for does not exist.</p>
          <Link to="/cakes" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Cakes
          </Link>
        </div>
      </div>
    );
  }

  const mainImageUrl = mainImage || product.images[0] || product.image;
  
  // ✅ Size-based pricing
  const getSizePrice = (size: number) => {
    const basePrice = product.price;
    const multiplier = size === 1 ? 1 : size === 2 ? 1.8 : size === 3 ? 2.5 : size === 4 ? 3.2 : 3.8;
    return Math.round(basePrice * multiplier);
  };

  const currentPrice = getSizePrice(selectedSize);
  const totalPrice = currentPrice * quantity;

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/cakes" className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition mb-6">
          <FaArrowLeft /> Back to Cakes
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB] relative">
              <img
                src={mainImageUrl}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-cover transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/600x600/D4AF37/FFFFFF?text=${product.name}`;
                }}
              />
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => {
                      const idx = product.images.indexOf(mainImageUrl);
                      const prev = (idx - 1 + product.images.length) % product.images.length;
                      setMainImage(product.images[prev]);
                    }} 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-lg"
                  >
                    <FaChevronLeft className="text-gray-600" />
                  </button>
                  <button 
                    onClick={() => {
                      const idx = product.images.indexOf(mainImageUrl);
                      const next = (idx + 1) % product.images.length;
                      setMainImage(product.images[next]);
                    }} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-lg"
                  >
                    <FaChevronRight className="text-gray-600" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
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
                  <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{product.discount}% OFF
            </span>
            {product.isNew && (
              <span className="absolute top-4 left-24 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                NEW
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium capitalize">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                ))}
                <span className="text-gray-400 text-xs ml-1">({product.rating})</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">{product.name}</h1>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-[#D4AF37]">PKR {currentPrice.toLocaleString()}</span>
              <span className="text-gray-400 line-through text-lg">PKR {product.oldPrice.toLocaleString()}</span>
              <span className="bg-green-100 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
                Save {product.discount}%
              </span>
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Size <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  const sizePrice = getSizePrice(size);
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedSize === size
                          ? 'bg-[#D4AF37] text-white shadow-md'
                          : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                      }`}
                    >
                      {size}lb
                      <span className="block text-[10px] opacity-75">
                        PKR {sizePrice.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flavor Selector */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Flavor <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map(flavor => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedFlavor === flavor
                        ? 'bg-[#D4AF37] text-white shadow-md'
                        : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>

            {/* Karachi Only Notice */}
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-amber-600 text-xl mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">📍 Karachi Only</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Our cakes are currently available for delivery in Karachi only. 
                    We will expand to other cities soon!
                  </p>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
              <p className="text-sm font-semibold text-gray-700">Ingredients:</p>
              <p className="text-sm text-gray-600 mt-1">{product.ingredients.join(', ')}</p>
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-green-600 font-medium">In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

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

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  if (!selectedFlavor) {
                    alert('Please select a flavor');
                    return;
                  }
                  addToCart({
                    ...product,
                    price: currentPrice,
                    size: selectedSize,
                    flavor: selectedFlavor,
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
                <FaShoppingCart /> {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
              </button>
              <button
                onClick={() => {
                  if (!selectedFlavor) {
                    alert('Please select a flavor');
                    return;
                  }
                  addToCart({
                    ...product,
                    price: currentPrice,
                    size: selectedSize,
                    flavor: selectedFlavor,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  window.location.href = '/checkout';
                }}
                disabled={product.stock === 0}
                className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg hover:shadow-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaTruck className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Fresh Delivery</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaShieldAlt className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Premium Quality</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaLeaf className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Homemade</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakesDetailPage;