// src/components/pages/CakesDetailPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaStar, FaShoppingCart, FaArrowLeft, 
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight,
  FaMapMarkerAlt, FaHeart, FaSpinner
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, doc, getDoc } from '../../config/firebase';

// ✅ Product Interface - Matching Admin Product Form
interface CakesProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPrice?: number;
  discount?: number;
  rating: number;
  category: string;
  subCategory?: string;
  subSubCategory?: string;
  productId: string;
  image: string;
  images: string[];
  colorImages?: { [key: string]: string[] };
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  material?: string;
  careInstructions?: string;
  isNew: boolean;
  isFeatured: boolean;
  flavor?: string;
  weight?: string;
  calories?: number;
  preparationTime?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const CakesDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<CakesProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ Fetch Product from Firebase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔵 Fetching product with ID:', id);
        
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        console.log('🔵 Document exists:', docSnap.exists());
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('🔵 Product data:', data);
          
          // ✅ Remove category filter - Show all products regardless of category
          // Just check if it's a valid product with required fields
          if (data.name && data.price) {
            const productData: CakesProduct = {
              id: docSnap.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discountPrice: data.discountPrice || 0,
              discount: data.discount || data.discountPrice || 0,
              rating: data.rating || 0,
              category: data.category || 'cakes',
              subCategory: data.subCategory || '',
              subSubCategory: data.subSubCategory || '',
              productId: data.productId || '',
              image: data.image || '',
              images: data.images || [],
              colorImages: data.colorImages || {},
              sizes: data.sizes || [],
              colors: data.colors || [],
              stock: data.stock || 0,
              description: data.description || '',
              material: data.material || '',
              careInstructions: data.careInstructions || '',
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              flavor: data.flavor || '',
              weight: data.weight || '',
              calories: data.calories || 0,
              preparationTime: data.preparationTime || '',
              isVegetarian: data.isVegetarian || false,
              isGlutenFree: data.isGlutenFree || false,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };
            
            console.log('✅ Product loaded:', productData.name);
            setProduct(productData);
            
            // ✅ Set default selections
            if (data.sizes && data.sizes.length > 0) {
              setSelectedSize(data.sizes[0]);
            }
            if (data.colors && data.colors.length > 0) {
              setSelectedFlavor(data.colors[0]);
            }
            
            // ✅ Set main image
            const images = data.images || [];
            if (images.length > 0) {
              setMainImage(images[0]);
            } else if (data.image) {
              setMainImage(data.image);
            }
          } else {
            setError('Invalid product data');
          }
        } else {
          setError('Product not found');
        }
      } catch (error: any) {
        console.error('❌ Error fetching cake:', error);
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Get price with discount
  const getDiscountedPrice = () => {
    if (!product) return 0;
    if (product.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  };

  // ✅ Get discount percentage
  const getDiscountPercent = () => {
    if (!product) return 0;
    if (product.discount) return product.discount;
    if (product.discountPrice && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  // ✅ Get all images
  const getAllImages = () => {
    if (!product) return [];
    const images = product.images || [];
    return images.length > 0 ? images : (product.image ? [product.image] : []);
  };

  // ✅ Check if product is in stock
  const isInStock = () => {
    if (!product) return false;
    return product.stock > 0;
  };

  // ✅ Image navigation
  const prevImage = () => {
    const images = getAllImages();
    if (images.length <= 1) return;
    const idx = images.indexOf(mainImage);
    const prev = (idx - 1 + images.length) % images.length;
    setMainImage(images[prev]);
    setImageLoaded(false);
  };

  const nextImage = () => {
    const images = getAllImages();
    if (images.length <= 1) return;
    const idx = images.indexOf(mainImage);
    const next = (idx + 1) % images.length;
    setMainImage(images[next]);
    setImageLoaded(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-600">Loading cake details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🎂</div>
          <h1 className="text-2xl font-bold text-[#111827]">Product Not Found</h1>
          <p className="text-gray-500 mt-2">
            {error || 'The cake you are looking for does not exist.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Product ID: {id}</p>
          <Link to="/cakes" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Cakes
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = getDiscountedPrice();
  const totalPrice = currentPrice * quantity;
  const images = getAllImages();
  const discountPercent = getDiscountPercent();

  return (
    <div className="bg-[#FFFDF7] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        <Link to="/cakes" className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition mb-4 sm:mb-6 text-sm sm:text-base">
          <FaArrowLeft /> Back to Cakes
        </Link>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          
          {/* ============================================================
          PRODUCT IMAGES
          ============================================================ */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB] relative">
              <div className="w-full aspect-square relative">
                <img
                  src={mainImage || product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/600x600/D4AF37/FFFFFF?text=${product.name}`;
                    setImageLoaded(true);
                  }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-lg z-10"
                  >
                    <FaChevronLeft className="text-gray-600" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-lg z-10"
                  >
                    <FaChevronRight className="text-gray-600" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
                    {images.indexOf(mainImage) + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMainImage(img);
                      setImageLoaded(false);
                    }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition ${
                      mainImage === img || (mainImage === '' && i === 0)
                        ? 'border-[#D4AF37] shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges */}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                -{discountPercent}% OFF
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 left-24 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                NEW
              </span>
            )}
            {product.isFeatured && (
              <span className="absolute top-4 right-4 bg-[#D4AF37] text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                ★ Featured
              </span>
            )}
            <button className="absolute bottom-4 right-4 bg-white/90 rounded-full p-3 hover:bg-[#D4AF37] transition shadow-lg z-10">
              <FaHeart className="text-gray-600 hover:text-white" />
            </button>
          </div>

          {/* ============================================================
          PRODUCT INFO
          ============================================================ */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium capitalize">
                {product.subCategory || product.category || 'Cake'}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                ))}
                <span className="text-gray-400 text-xs ml-1">({product.rating})</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827]">{product.name}</h1>

            {/* Product ID */}
            {product.productId && (
              <p className="text-xs text-gray-400 font-mono">ID: {product.productId}</p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
                PKR {currentPrice.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > currentPrice && (
                <span className="text-gray-400 line-through text-lg">
                  PKR {product.oldPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-green-100 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description || 'No description available.'}</p>

            {/* Category Specific Info */}
            {product.flavor && (
              <div className="text-sm text-gray-600"><span className="font-medium">Flavor:</span> {product.flavor}</div>
            )}
            {product.weight && (
              <div className="text-sm text-gray-600"><span className="font-medium">Weight:</span> {product.weight}</div>
            )}
            {product.calories && product.calories > 0 && (
              <div className="text-sm text-gray-600"><span className="font-medium">Calories:</span> {product.calories} kcal</div>
            )}
            {product.preparationTime && (
              <div className="text-sm text-gray-600"><span className="font-medium">Prep Time:</span> {product.preparationTime}</div>
            )}
            {(product.isVegetarian || product.isGlutenFree) && (
              <div className="flex flex-wrap gap-2">
                {product.isVegetarian && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🌱 Vegetarian</span>}
                {product.isGlutenFree && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">🌾 Gluten Free</span>}
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Size <span className="text-red-500">*</span></label>
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

            {/* Flavor Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Flavor <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(flavor => (
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
            )}

            {/* Material & Care */}
            {product.material && <div className="text-sm text-gray-600"><span className="font-medium">Material:</span> {product.material}</div>}
            {product.careInstructions && <div className="text-sm text-gray-600"><span className="font-medium">Care:</span> {product.careInstructions}</div>}

            {/* Karachi Only */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-amber-600 text-xl mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">📍 Karachi Only</p>
                  <p className="text-xs text-amber-600 mt-0.5">Available for delivery in Karachi only. We will expand soon!</p>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="mt-1">
              {isInStock() ? (
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
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#E5E7EB] transition flex items-center justify-center">-</button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#E5E7EB] transition flex items-center justify-center">+</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 mt-2">
              <button
                onClick={() => {
                  if (!selectedFlavor) { alert('Please select a flavor'); return; }
                  if (!selectedSize) { alert('Please select a size'); return; }
                  addToCart({ ...product, price: currentPrice, size: selectedSize, flavor: selectedFlavor, quantity, totalPrice });
                  alert('✅ Added to Cart!');
                }}
                disabled={!isInStock()}
                className={`flex-1 px-6 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isInStock() ? 'bg-[#0F766E] text-white hover:bg-[#065F46]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart /> {isInStock() ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => {
                  if (!selectedFlavor) { alert('Please select a flavor'); return; }
                  if (!selectedSize) { alert('Please select a size'); return; }
                  addToCart({ ...product, price: currentPrice, size: selectedSize, flavor: selectedFlavor, quantity, totalPrice });
                  window.location.href = '/checkout';
                }}
                disabled={!isInStock()}
                className={`px-6 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl text-sm sm:text-base ${
                  isInStock() ? 'bg-[#D4AF37] text-white hover:bg-[#b8941f]' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2">
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaTruck className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Fresh Delivery</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaShieldAlt className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Premium Quality</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaLeaf className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Homemade</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakesDetailPage;