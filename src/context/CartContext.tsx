import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ============================================================
// CART ITEM TYPE
// ============================================================
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// ============================================================
// CART CONTEXT TYPE
// ============================================================
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
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
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Add to Cart
  const addToCart = (product: any) => {
    console.log("🛒 Adding to cart:", product);
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        console.log("✅ Product already exists, increasing quantity");
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        console.log("✅ New product added");
        return [...prevCart, { 
          id: product.id, 
          name: product.name, 
          price: product.price, 
          image: product.image, 
          quantity: 1 
        }];
      }
    });
  };

  // ✅ Remove from Cart
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // ✅ Update Quantity
  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // ✅ Get Cart Count
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // ✅ Get Cart Total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // ✅ Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
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