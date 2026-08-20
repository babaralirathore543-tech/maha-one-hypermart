import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ============================================================
// CART ITEM TYPE - Updated with size, color, totalPrice
// ============================================================
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  totalPrice?: number;  // ✅ Per item total (price * quantity)
}

// ============================================================
// CART CONTEXT TYPE
// ============================================================
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
  updateQuantityDirect: (id: number, quantity: number) => void; // ✅ New
  getCartCount: () => number;
  getCartTotal: () => number;
  clearCart: () => void;
}

// ============================================================
// CREATE CONTEXT
// ============================================================
const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================
// CART PROVIDER
// ============================================================
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Load cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ✅ Add to Cart (Updated with size, color, totalPrice)
  const addToCart = (product: any) => {
    console.log("🛒 Adding to cart:", product);
    
    setCart((prevCart) => {
      // ✅ Check if same product with same size and color exists
      const existingItem = prevCart.find(
        (item) => 
          item.id === product.id && 
          item.size === (product.size || 'One Size') &&
          item.color === (product.color || 'Default')
      );
      
      if (existingItem) {
        console.log("✅ Product with same size/color exists, increasing quantity");
        return prevCart.map((item) =>
          item.id === product.id && 
          item.size === (product.size || 'One Size') &&
          item.color === (product.color || 'Default')
            ? { 
                ...item, 
                quantity: item.quantity + (product.quantity || 1),
                totalPrice: item.price * (item.quantity + (product.quantity || 1))
              }
            : item
        );
      } else {
        console.log("✅ New product added");
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || product.images?.[0] || '',
          quantity: product.quantity || 1,
          size: product.size || 'One Size',
          color: product.color || 'Default',
          totalPrice: product.price * (product.quantity || 1)
        };
        return [...prevCart, newItem];
      }
    });
  };

  // ✅ Remove from Cart
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // ✅ Update Quantity (by change: +1 or -1)
  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { 
            ...item, 
            quantity: newQuantity,
            totalPrice: item.price * newQuantity
          };
        }
        return item;
      })
    );
  };

  // ✅ Update Quantity Direct (set specific quantity)
  const updateQuantityDirect = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, quantity);
          return { 
            ...item, 
            quantity: newQuantity,
            totalPrice: item.price * newQuantity
          };
        }
        return item;
      })
    );
  };

  // ✅ Get Cart Count
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // ✅ Get Cart Total (Fixed)
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // ✅ Use totalPrice if available, otherwise calculate
      const itemTotal = item.totalPrice || (item.price * item.quantity);
      return total + itemTotal;
    }, 0);
  };

  // ✅ Clear Cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateQuantityDirect,
        getCartCount,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ============================================================
// USE CART HOOK
// ============================================================
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};