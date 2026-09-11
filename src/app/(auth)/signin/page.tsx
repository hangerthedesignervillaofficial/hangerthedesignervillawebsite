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
    <div className="bg-[#FDFBF7] flex min-h-screen items-stretch">
      {/* Left side: Editorial Image (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#E3DAC9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-[#2C1810]/20" />
        <div className="absolute inset-0 p-12 flex flex-col justify-end">
          <h2 className="font-serif text-white text-4xl leading-tight max-w-md" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            Curating the finest in luxury fashion.
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37] mt-6" />
        </div>
      </div>

      {/* Right side: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Decorative background element for subtle luxury feel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="w-full max-w-[420px] bg-transparent relative z-10">
          
          {/* Logo Stack at top of Sign In */}
          <div className="flex flex-col mb-12 relative z-10">
            <Link href="/" className="flex items-center gap-3 mb-8 group inline-block">
              <HangerLogo className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
              <div className="flex flex-col text-left">
                <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#2C1810] uppercase" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                  HANGER
                </span>
                <span className="font-sans text-[7px] uppercase tracking-[0.3em] text-[#7A6B5D] font-bold">
                  THE DESIGNER VILLA
                </span>
              </div>
            </Link>
            
            <h2 className="font-serif text-2xl md:text-3xl tracking-[0.05em] text-[#2C1810] mb-2" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              Welcome back
            </h2>
            <p className="font-sans text-[11px] md:text-xs text-[#7A6B5D] tracking-wide">
              Please enter your details to access your luxury closet.
            </p>
          </div>
          
          <div className="relative z-10">
            <SignInForm message={message} initialError={errorParam} />
          </div>
        </div>
      </div>
    </div>
  );
}
