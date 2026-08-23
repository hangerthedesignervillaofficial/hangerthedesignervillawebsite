"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  ShoppingBag,
  LogOut,
  Crown,
  Package,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function MockProfilePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin?returnTo=/profile");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    setIsSigning(true);
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin stroke-[1.2]" />
      </div>
    );
  }

  const displayName = user.email?.split("@")[0] || "Guest";
  const isAdmin = user.email === "admin@gmail.com";
  const memberSince = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Page header */}
      <div className="border-b border-[#D4AF37]/10">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/"
              className="text-[9px] font-sans tracking-[0.15em] uppercase text-[#7A6B5D] hover:text-[#D4AF37] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#D4AF37]/40 text-[8px]">●</span>
            <span className="text-[9px] font-sans tracking-[0.15em] uppercase text-[#2C1810] font-semibold">
              My Account
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-[1px] bg-[#D4AF37]" />
            <span className="text-[8px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Account
            </span>
          </div>
          <h1
            className="font-serif text-2xl md:text-3xl font-normal tracking-wide text-[#2C1810]"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            My Profile
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left — Profile identity card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4"
          >
            <div className="border border-[#D4AF37]/25 bg-white/80 shadow-lg shadow-[#D4AF37]/5 relative overflow-hidden">
              <div className="absolute inset-2 border border-[#D4AF37]/8 pointer-events-none" />

              {/* Avatar area */}
              <div className="bg-gradient-to-br from-[#2C1810] to-[#4A0E17] p-8 text-center relative">
                <div className="w-20 h-20 mx-auto border-2 border-[#D4AF37]/40 bg-[#D4AF37]/10 rounded-none flex items-center justify-center mb-4 relative">
                  <User className="w-9 h-9 text-[#D4AF37] stroke-[1.2]" />
                  {isAdmin && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D4AF37] flex items-center justify-center">
                      <Crown className="w-3.5 h-3.5 text-[#2C1810] stroke-[2]" />
                    </div>
                  )}
                </div>
                <h2
                  className="font-serif text-white text-lg tracking-[0.15em] capitalize"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  {displayName}
                </h2>
                <p className="font-sans text-[9px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase mt-1">
                  {isAdmin ? "Admin · The Designer Villa" : "Atelier Member"}
                </p>
              </div>

              {/* Profile details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 py-3 border-b border-[#D4AF37]/10">
                  <div className="w-8 h-8 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37] stroke-[1.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-[8px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">
                      Email
                    </p>
                    <p className="font-sans text-[12px] text-[#2C1810] truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b border-[#D4AF37]/10">
                  <div className="w-8 h-8 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <Package className="w-3.5 h-3.5 text-[#D4AF37] stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="font-sans text-[8px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">
                      Member Since
                    </p>
                    <p className="font-sans text-[12px] text-[#2C1810] mt-0.5">
                      {memberSince}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b border-[#D4AF37]/10">
                  <div className="w-8 h-8 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37] stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="font-sans text-[8px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase">
                      Phone
                    </p>
                    <p className="font-sans text-[12px] text-[#7A6B5D]/50 mt-0.5 italic">
                      Not added
                    </p>
                  </div>
                </div>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  disabled={isSigning}
                  className="w-full mt-2 py-3 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 font-sans text-[9px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <LogOut className="w-3 h-3 stroke-[1.5]" />
                  {isSigning ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right — Orders / Activity */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[#D4AF37]/20 bg-white p-5 hover:border-[#D4AF37]/50 transition-all group cursor-pointer" onClick={() => router.push("/")}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-[8px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">
                      Continue Shopping
                    </p>
                    <p className="font-serif text-[#2C1810] text-sm" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                      Browse Atelier Collection
                    </p>
                  </div>
                  <div className="w-10 h-10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/60 transition-all">
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37] stroke-[1.5]" />
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="border border-[#D4AF37]/20 bg-gradient-to-br from-[#2C1810]/5 to-[#D4AF37]/5 p-5 hover:border-[#D4AF37]/50 transition-all group cursor-pointer" onClick={() => router.push("/admin")}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-sans text-[8px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">
                        Admin Panel
                      </p>
                      <p className="font-serif text-[#2C1810] text-sm" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                        Manage Store
                      </p>
                    </div>
                    <div className="w-10 h-10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/60 transition-all">
                      <Crown className="w-4 h-4 text-[#D4AF37] stroke-[1.5]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Orders section */}
            <div className="border border-[#D4AF37]/20 bg-white">
              <div className="p-5 border-b border-[#D4AF37]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-[1px] bg-[#D4AF37]" />
                  <h2
                    className="font-serif text-lg text-[#2C1810] tracking-wide"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    My Orders
                  </h2>
                </div>
              </div>

              {/* Empty orders for mock users */}
              <div className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-5 border border-[#D4AF37]/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#D4AF37]/40 stroke-[1.5]" />
                </div>
                <p
                  className="font-serif text-lg text-[#2C1810] tracking-wide mb-2"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  No Orders Yet
                </p>
                <p className="font-sans text-[11px] text-[#7A6B5D] leading-relaxed mb-6 max-w-xs mx-auto">
                  Your curated order history will appear here after your first purchase from The Designer Villa.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#2C1810] to-[#4A0E17] text-[#D4AF37] font-sans text-[9px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all hover:from-[#4A0E17] hover:to-[#6B1A24]"
                >
                  Explore Collection
                  <ArrowRight className="w-3 h-3 stroke-[2]" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
