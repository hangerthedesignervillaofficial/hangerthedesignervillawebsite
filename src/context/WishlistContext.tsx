"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductType } from "@/types";
import { toast } from "sonner";

interface WishlistContextType {
  wishlistItems: ProductType[];
  addToWishlist: (product: ProductType) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: ProductType) => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<ProductType[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hanger_wishlist");
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing wishlist items", e);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  const saveWishlist = (items: ProductType[]) => {
    setWishlistItems(items);
    localStorage.setItem("hanger_wishlist", JSON.stringify(items));
  };

  const addToWishlist = (product: ProductType) => {
    if (wishlistItems.some((item) => item.product_id === product.product_id)) {
      return;
    }
    const newItems = [...wishlistItems, product];
    saveWishlist(newItems);
    toast.success(`${product.title} added to Wishlist`);
  };

  const removeFromWishlist = (productId: string) => {
    const item = wishlistItems.find((i) => i.product_id === productId);
    const newItems = wishlistItems.filter((item) => item.product_id !== productId);
    saveWishlist(newItems);
    if (item) {
      toast.info(`${item.title} removed from Wishlist`);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  const toggleWishlist = (product: ProductType) => {
    if (isInWishlist(product.product_id)) {
      removeFromWishlist(product.product_id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        totalWishlistItems: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
