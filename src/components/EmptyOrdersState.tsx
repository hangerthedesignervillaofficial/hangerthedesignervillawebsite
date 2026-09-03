import { Button } from "@/components/ui/button";

interface EmptyOrdersStateProps {
  onBrowseProducts: () => void;
}

export function EmptyOrdersState({ onBrowseProducts }: EmptyOrdersStateProps) {
  return (
    <div className="bg-[#FDFBF7] border border-[#D4AF37]/20 p-12 text-center shadow-sm">
      <div className="w-16 h-16 mx-auto mb-6 border border-[#D4AF37]/30 rounded-full flex items-center justify-center bg-[#FDFBF7] shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <h3 className="font-serif text-xl text-[#2C1810] mb-2" style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
        No Orders Yet
      </h3>
      <p className="font-sans text-sm tracking-wide text-[#7A6B5D] mb-8 max-w-md mx-auto">
        Your wardrobe is waiting to be curated. Discover our latest designer collections and make your first statement.
      </p>
      <Button 
        className="bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white cursor-pointer rounded-none h-12 px-8 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300" 
        onClick={onBrowseProducts}
      >
        DISCOVER COLLECTION
      </Button>
    </div>
  );
}
