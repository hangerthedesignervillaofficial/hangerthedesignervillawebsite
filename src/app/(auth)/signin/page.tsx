import { SignInForm } from "./SignInForm";
import Link from "next/link";
 
type SignInProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
 
export default async function SignIn({ searchParams }: SignInProps) {
  const params = await searchParams;
  const message = params.message ? String(params.message) : null;
  const errorParam = params.error ? String(params.error) : null;
 
  return (
    <div className="bg-[#FDFBF7] flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFDFC] border border-[#D4AF37]/20 p-8 md:p-10 shadow-md relative overflow-hidden">
        {/* Decorative inner gold border */}
        <div className="absolute inset-2 border border-[#D4AF37]/10 pointer-events-none" />
        
        {/* Logo Stack at top of Sign In */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <Link href="/" className="flex items-center gap-2.5 mb-4 group">
            <img 
              src="/images/logo-icon.png" 
              alt="HANGER" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <span className="font-serif text-base font-bold tracking-[0.2em] text-[#2C1810] uppercase" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
                HANGER
              </span>
              <span className="font-sans text-[6px] uppercase tracking-[0.3em] text-[#7A6B5D] font-bold">
                THE DESIGNER VILLA
              </span>
            </div>
          </Link>
          <div className="w-1 h-1 bg-[#D4AF37] rotate-45 mb-4" />
          <h2 className="font-serif text-xl tracking-[0.15em] text-[#4A0E17] uppercase mb-1.5" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
            SIGN IN
          </h2>
          <p className="font-sans text-[10px] text-[#7A6B5D] tracking-wide text-center">
            Welcome back to Hanger. Please enter your credentials to access your luxury closet.
          </p>
        </div>
        
        <div className="relative z-10">
          <SignInForm message={message} initialError={errorParam} />
        </div>
      </div>
    </div>
  );
}
