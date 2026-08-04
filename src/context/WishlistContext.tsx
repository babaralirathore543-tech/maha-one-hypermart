import { createContext, useContext, useState, type ReactNode } from 'react';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  rating?: number;
  oldPrice?: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const addToWishlist = (product: any) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        discount: product.discount,
        rating: product.rating,
        oldPrice: product.oldPrice
      }];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((item) => item.id === id);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistCount,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};