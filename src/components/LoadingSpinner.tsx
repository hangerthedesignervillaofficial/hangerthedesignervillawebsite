export function LoadingSpinner() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 animate-fade-in">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer gold ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin"></div>
        {/* Inner maroon ring rotating opposite */}
        <div className="w-8 h-8 rounded-full border-2 border-[#4A0E17]/10 border-b-[#4A0E17] animate-spin [animation-direction:reverse] [animation-duration:1s]"></div>
      </div>
      <span className="font-sans text-[9px] font-bold tracking-[0.25em] text-[#7A6B5D] uppercase animate-pulse">
        Hanger is loading...
      </span>
    </div>
  );
}
