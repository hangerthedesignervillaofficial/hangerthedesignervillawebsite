"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";

export function SignInForm({ message, initialError }: { message: string | null; initialError?: string | null }) {
  const {
    formData,
    loading,
    error,
    showPassword,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
    handleGoogleSignIn,
  } = useAuthForm();

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || initialError) && (
          <div className="bg-[#4A0E17]/5 border border-[#4A0E17]/25 text-[#4A0E17] rounded-none p-3 text-[11px] tracking-wide text-center">
            {error || initialError}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-none p-3 text-[11px] tracking-wide text-center">
            {message}
          </div>
        )}
        
        <div className="space-y-4 pt-4">
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
              className="peer w-full bg-transparent border-b border-[#D4AF37]/30 border-t-0 border-l-0 border-r-0 rounded-none h-11 px-0 focus-visible:ring-0 focus:border-[#D4AF37] focus:bg-transparent font-sans text-sm text-[#2C1810] transition-colors"
            />
            <label 
              htmlFor="email"
              className="absolute left-0 top-0 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4AF37] pointer-events-none"
            >
              Email Address
            </label>
          </div>
 
          <div className="relative pt-6">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
              className="peer w-full bg-transparent border-b border-[#D4AF37]/30 border-t-0 border-l-0 border-r-0 rounded-none h-11 px-0 pr-8 focus-visible:ring-0 focus:border-[#D4AF37] focus:bg-transparent font-sans text-sm text-[#2C1810] transition-colors"
            />
            <label 
              htmlFor="password"
              className="absolute left-0 top-6 text-[10px] md:text-xs text-[#7A6B5D] font-sans uppercase tracking-[0.15em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-9 peer-placeholder-shown:text-[#7A6B5D]/60 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#D4AF37] pointer-events-none"
            >
              Password
            </label>
            <button
              type="button"
              className="absolute bottom-0 right-0 inline-flex h-11 cursor-pointer items-center justify-center px-1 text-[#7A6B5D] hover:text-[#4A0E17] transition-colors"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 stroke-[1.5]" />
              ) : (
                <Eye className="h-4 w-4 stroke-[1.5]" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          </div>
          <div className="flex justify-end pt-1">
            <Link
              href="/reset-password"
              className="text-[#7A6B5D] hover:text-[#4A0E17] text-[9.5px] font-sans font-semibold tracking-wide underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
 
        <div className="flex flex-col pt-2">
          <Button
            type="submit"
            className="rounded-none bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] hover:text-white h-11 px-8 font-sans text-[10px] font-bold tracking-[0.2em] uppercase w-full transition-colors duration-300 border border-[#D4AF37]/35 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#D4AF37]/15" />
        </div>
        <div className="relative flex justify-center text-[8.5px] uppercase tracking-[0.15em] font-bold">
          <span className="bg-[#FFFDFC] px-3 text-[#7A6B5D]">Or continue with</span>
        </div>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-none border border-[#D4AF37]/25 hover:bg-[#FDFBF7] hover:border-[#D4AF37]/50 bg-white font-sans text-[9px] font-bold tracking-[0.18em] uppercase transition-all duration-300 h-11 text-[#2C1810] cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg className="mr-2.5 h-3.5 w-3.5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="text-center text-xs tracking-wide text-[#7A6B5D] mt-2">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#4A0E17] hover:text-[#D4AF37] font-semibold cursor-pointer underline transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
