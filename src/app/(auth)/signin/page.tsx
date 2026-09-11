import { SignInForm } from "./SignInForm";
import Link from "next/link";
import { HangerLogo } from "@/components/HangerLogo";

type SignInProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SignIn({ searchParams }: SignInProps) {
  const params = await searchParams;
  const message = params.message ? String(params.message) : null;
  const errorParam = params.error ? String(params.error) : null;

  return (
    <div className="bg-[#FDFBF7] flex min-h-screen items-stretch selection:bg-[#B99A45]/20 selection:text-[#281713]">
      {/* Left side: Editorial Lookbook Campaign (Desktop only) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#F5F1E8] overflow-hidden border-r border-[#E7DDC9]">
        {/* Editorial Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop"
          alt="Hanger Luxury Fashion Campaign"
          className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.92] contrast-[1.03]"
        />

        {/* Sophisticated Editorial Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#281713]/90 via-[#281713]/30 to-transparent" />

        {/* Editorial Content Overlay */}
        <div className="absolute inset-0 p-12 xl:p-16 flex flex-col justify-between z-10">
          {/* Top subtle brand mark */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B99A45]" />
            <span className="font-sans text-[8.5px] font-semibold tracking-[0.3em] uppercase text-white/80">
              The Atelier Lookbook
            </span>
          </div>

          {/* Bottom quote & couture statement */}
          <div className="space-y-4 max-w-lg">
            <span className="font-sans text-[8.5px] font-semibold tracking-[0.28em] text-[#B99A45] uppercase block">
              Curated Designer Silhouettes
            </span>
            <h2
              className="font-serif text-3xl xl:text-4xl text-white font-normal leading-[1.2] tracking-wide"
              style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
            >
              Curating India&apos;s finest handcrafted elegance for your private wardrobe.
            </h2>
            <div className="w-12 h-[1px] bg-[#B99A45]/80 mt-6" />
          </div>
        </div>
      </div>

      {/* Right side: Luxury Sign-In Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 relative bg-[#FDFBF7]">
        {/* Very subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#B99A45]/[0.03] rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />

        <div className="w-full max-w-[400px] relative z-10 py-6">
          {/* Luxury Brand Masthead */}
          <div className="mb-10 sm:mb-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-3.5 mb-8 outline-none transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="w-11 h-11 rounded-full bg-[#F5F1E8] border border-[#E7DDC9] flex items-center justify-center shrink-0 shadow-xs">
                <HangerLogo
                  color="#B99A45"
                  className="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col text-left">
                <span
                  className="font-serif text-lg sm:text-xl font-normal tracking-[0.22em] text-[#281713] uppercase leading-none"
                  style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
                >
                  Hanger
                </span>
                <span className="font-sans text-[7.5px] uppercase tracking-[0.32em] text-[#82756D] font-semibold mt-1">
                  The Designer Villa
                </span>
              </div>
            </Link>

            {/* Editorial Heading - Welcome Back as Visual Focal Point */}
            <h1
              className="font-serif text-3xl sm:text-[34px] font-normal tracking-[0.02em] text-[#281713] leading-tight"
              style={{ fontFamily: "var(--font-heading), 'Playfair Display', Georgia, serif" }}
            >
              Welcome back
            </h1>
            <p className="font-sans text-xs sm:text-[12.5px] text-[#82756D] tracking-wide mt-2 leading-relaxed">
              Please enter your details to access your luxury closet.
            </p>
          </div>

          {/* Form Component */}
          <SignInForm message={message} initialError={errorParam} />
        </div>
      </div>
    </div>
  );
}
