"use client";

import Link from "next/link";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";

export function SignInForm({
  message,
  initialError,
}: {
  message: string | null;
  initialError?: string | null;
}) {
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

  const displayError = error || initialError;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Notification */}
        {displayError && (
          <div className="bg-[#FDF5F5] border border-[#F0D5D8] text-[#8B2635] p-3 text-[11px] font-sans tracking-wide flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#8B2635]" strokeWidth={1.25} />
            <span>{displayError}</span>
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="bg-[#F4F8F5] border border-[#D1E7D7] text-[#1B4D2E] p-3 text-[11px] font-sans tracking-wide flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1B4D2E]" strokeWidth={1.25} />
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-sans text-[8.5px] sm:text-[9px] font-semibold tracking-[0.22em] text-[#82756D] uppercase"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 bg-white/70 hover:bg-white focus:bg-white border border-[#E7DDC9] focus:border-[#B99A45] text-[#281713] placeholder:text-[#82756D]/40 font-sans text-xs sm:text-[13px] px-3.5 rounded-none transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block font-sans text-[8.5px] sm:text-[9px] font-semibold tracking-[0.22em] text-[#82756D] uppercase"
              >
                Password
              </label>

              <Link
                href="/reset-password"
                className="font-sans text-[9px] font-medium tracking-[0.14em] uppercase text-[#82756D] hover:text-[#281713] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-12 bg-white/70 hover:bg-white focus:bg-white border border-[#E7DDC9] focus:border-[#B99A45] text-[#281713] placeholder:text-[#82756D]/40 font-sans text-xs sm:text-[13px] px-3.5 pr-11 rounded-none transition-all duration-200 outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-[#82756D]/60 hover:text-[#281713] transition-colors cursor-pointer"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.25} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.25} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Primary Sign In Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#281713] hover:bg-[#1a0f0d] active:scale-[0.99] text-[#FBF9F4] font-sans text-[10px] sm:text-[10.5px] font-semibold tracking-[0.24em] uppercase transition-all duration-300 border border-[#281713] hover:border-[#B99A45] shadow-xs cursor-pointer rounded-none flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#E7DDC9]" />
        </div>
        <div className="relative flex justify-center text-[8.5px] uppercase tracking-[0.24em] font-semibold">
          <span className="bg-[#FDFBF7] px-4 text-[#82756D]">Or continue with</span>
        </div>
      </div>

      {/* Google Authentication */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full h-12 rounded-none border border-[#E7DDC9] hover:border-[#B99A45]/60 hover:bg-white bg-white/70 font-sans text-[9.5px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 text-[#281713] cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-50"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
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
        <span>Continue with Google</span>
      </button>

      {/* Sign Up Navigation */}
      <div className="text-center font-sans text-xs text-[#82756D] tracking-wide pt-1">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#281713] hover:text-[#B99A45] font-semibold uppercase tracking-[0.16em] text-[10.5px] underline underline-offset-4 decoration-[#E7DDC9] hover:decoration-[#B99A45] transition-colors ml-1"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
