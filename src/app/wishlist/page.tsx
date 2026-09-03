"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 min-h-[70vh]">
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-[#2C1810] tracking-wider mb-2">My Wishlist</h1>
        <div className="w-16 h-px bg-[#D4AF37] mb-4" />
        <p className="font-sans text-sm text-[#7A6B5D] tracking-wide">Your curated collection of timeless elegance</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-sm">
          <HeartIconEmpty />
          <p className="font-sans text-lg text-[#2C1810] mb-2 tracking-wide">Your wishlist is empty</p>
          <p className="font-sans text-sm text-[#7A6B5D] mb-8 tracking-wide text-center max-w-md">
            Looks like you haven't added any luxury pieces to your wishlist yet.
          </p>
          <Link 
            href="/products" 
            className="bg-[#2C1810] text-[#FDFBF7] font-sans text-xs uppercase tracking-[0.2em] font-bold py-4 px-10 hover:bg-[#D4AF37] transition-colors duration-300"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {wishlistItems.map((item) => (
            <div key={item.product_id} className="group flex flex-col relative border border-[#D4AF37]/5 bg-[#FDFBF7] p-3 transition-all duration-300 hover:shadow-xl hover:border-[#D4AF37]/30">
              <Link href={`/products/${item.product_id}`} className="relative aspect-[3/4] overflow-hidden bg-[#F0E6D8]/30 mb-4 block">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              
              <div className="flex flex-col flex-1">
                <Link href={`/products/${item.product_id}`}>
                  <h3 className="font-sans text-xs font-bold text-[#2C1810] tracking-wider mb-1 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                </Link>
                <p className="font-sans text-[11px] text-[#7A6B5D] mb-3">₹{item.price.toLocaleString("en-IN")}</p>
                
                <div className="mt-auto flex flex-col gap-2">
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full flex items-center justify-center gap-2 bg-[#2C1810] text-[#D4AF37] px-4 py-2.5 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#4A0E17] transition-all"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    Move to Bag
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="w-full flex items-center justify-center gap-2 border border-[#2C1810]/20 text-[#2C1810] py-2.5 font-sans text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HeartIconEmpty() {
  return (
    <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6">
      <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
  );
}
