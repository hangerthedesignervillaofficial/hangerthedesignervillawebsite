import SignUpForm from "./SignUpForm";

export default function SignUp() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen flex items-center justify-center p-4">
      {/* Double gold-bordered boutique card */}
      <div className="w-full max-w-md">
        <div className="border border-[#D4AF37]/25 p-6 md:p-8 bg-[#FDFBF7]">
          <div className="border border-[#D4AF37]/10 p-5 md:p-7">
            {/* Brand logo */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="/images/logo-icon.png"
                alt="HANGER"
                className="h-12 w-auto object-contain mb-3"
              />
              <h1
                className="font-serif text-xl font-bold tracking-[0.22em] text-[#2C1810] uppercase"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                HANGER
              </h1>
              <span className="font-sans text-[6px] uppercase tracking-[0.32em] text-[#7A6B5D] mt-1 font-bold">
                THE DESIGNER VILLA
              </span>
            </div>

            <div className="text-center mb-6">
              <h2
                className="font-serif text-lg text-[#2C1810] tracking-wide"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Create Account
              </h2>
              <p className="font-sans text-[10px] text-[#7A6B5D] mt-1">
                Join our exclusive boutique experience
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
