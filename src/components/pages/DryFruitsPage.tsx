import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const DryFruitsPage = () => {
  const { addToCart } = useCart();

  const products = [
    { id: 1, name: 'American Almonds Premium 500gm', price: 2000, oldPrice: 2300, discount: 20, rating: 4.8, image: '/images/dry-fruits/almonds large.jpg' },
    { id: 2, name: 'American Almonds Medium 500gm', price: 1850, oldPrice: 2150, discount: 22, rating: 4.9, image: '/images/dry-fruits/almonds small.jpg' },
    { id: 3, name: 'Soft Shell Salted Pistachios 500gm', price: 2600, oldPrice: 2300, discount: 21, rating: 4.7, image: '/images/dry-fruits/pista shell.jpg' },
    { id: 4, name: 'Roasted Pistachios 500gm', price: 3900, oldPrice: 2000, discount: 20, rating: 4.6, image: '/images/dry-fruits/pista without shell.jpg' },
    { id: 5, name: 'Roasted Brown Cashews 500gm', price: 2000, oldPrice: 1000, discount: 20, rating: 4.8, image: '/images/dry-fruits/brown kaju.jpg' },
    { id: 6, name: 'Salted White Cashews 500gm', price: 1800, oldPrice: 1200, discount: 25, rating: 4.9, image: '/images/dry-fruits/white kaju.jpg' },
    { id: 7, name: 'Soft Shell Almonds 500gm', price: 1250, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/soft shell almonds.jpg' },
    { id: 8, name: 'Soft Shell Walnuts 500gm', price: 950, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/shell walnut.jpg' },
    { id: 9, name: 'Kerne Walnuts(witout shell) 500gm', price: 1550, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/without shell walnut.jpg' },
    { id: 10, name: 'Sundar Khani Raisins 500gm', price: 950, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/sundar khani raisins.jpg' },
    { id: 11, name: 'Kandhari Raisins 500gm', price: 800, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/kandhari raisins.jpg' },
    { id: 12, name: 'Black Raisins 500gm', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/black raisins.jpg' },
    { id: 13, name: 'Munakka Raisins 500gm', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/munakka raisins.jpg' },
    { id: 14, name: 'Roasted Chickpeas(without Skin) 500gm', price: 600, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/yellow channa.jpg' },
    { id: 15, name: 'Roasted Brown Chickpeas 500gm', price: 500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/brown channa.jpg' },
    { id: 16, name: 'Chia Seeds 500gm', price: 1300, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/chia seeds.jpg' },
    { id: 17, name: 'Pumpkin Seeds(Kaddu Beej) 500gm', price: 1000, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/pumpkin seeds.jpg' },
    { id: 18, name: 'Sunflower Seeds 500gm', price: 900, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/sunflower seeds.jpg' },
    { id: 19, name: 'Flax(Alsi) Seeds 500gm', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/alsi seeds.jpg' },
    { id: 20, name: 'Basil Seeds(Tukh Malanga) 500gm', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/basil seeds.jpg' },
    { id: 21, name: 'Four Seeds(Char Maghaz) 500gm', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/char magaz.jpg' },
    { id: 22, name: 'Isphagol Husk 500gm', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/isphagol.jpg' },
    { id: 23, name: 'Dry Coconut (Khopra) 500gm', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/dry coconut.jpg' },
    { id: 24, name: 'Coconut Powder 500gm', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, image: '/images/dry-fruits/coconut powder.jpg' },
  ];
  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl font-bold text-[#111827] text-center mb-8">
          🥜 Premium <span className="text-[#D4AF37]">Dry Fruits</span>
        </h1>

        {/* ✅ Products Grid - Link to /dry-product/:id */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link to={`/dry-product/${p.id}`} key={p.id}>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] hover:-translate-y-1 cursor-pointer group">
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    -{p.discount}%
                  </span>
                  <button 
                    className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-[#D4AF37] transition"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('❤️ Added to Wishlist!');
                    }}
                  >
                    <FaHeart className="text-gray-600 hover:text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex text-[#D4AF37] text-sm">
                    {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
                    <span className="text-gray-400 text-xs ml-1">({p.rating})</span>
                  </div>
                  <h3 className="font-semibold text-[#111827] text-lg">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#D4AF37] font-bold text-xl">PKR {p.price}</span>
                    <span className="text-gray-400 line-through text-sm">PKR {p.oldPrice}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(p);
                    }}
                    className="w-full mt-4 bg-[#0F766E] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#065F46] transition flex items-center justify-center gap-2"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DryFruitsPage;