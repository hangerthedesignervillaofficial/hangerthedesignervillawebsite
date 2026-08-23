import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, X } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface RazorpayModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

export function RazorpayModal({ amount, isOpen, onClose, onSuccess }: RazorpayModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate network delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Wait a moment for user to see success state before closing
      setTimeout(() => {
        onSuccess(`pay_razorpay_mock_${Date.now()}`);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 border-[#D4AF37]/30 shadow-2xl overflow-hidden rounded-xl">
        {/* Razorpay Brand Header */}
        <div className="bg-[#02042B] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Simple Razorpay logo simulation */}
            <div className="h-6 w-6 bg-[#3395FF] rounded-sm transform rotate-45 flex items-center justify-center shadow-inner">
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
            <span className="text-white font-semibold tracking-wide text-sm">Razorpay</span>
          </div>
          <button onClick={onClose} disabled={isProcessing || isSuccess} className="text-white/70 hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <CardContent className="p-6 bg-[#FDFBF7] dark:bg-[#1A0A0E]">
          <div className="text-center space-y-4">
            <div>
              <p className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#7A6B5D] uppercase mb-1">Paying to</p>
              <h3 className="font-serif text-lg font-normal text-[#2C1810] dark:text-[#F5E6D8] uppercase tracking-wider">
                Hanger - The Designer Villa
              </h3>
            </div>
            
            <div className="bg-[#FFFCF7] dark:bg-[#241215] p-5 border border-[#D4AF37]/20 rounded-none shadow-sm">
              <p className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#7A6B5D] mb-1.5 uppercase">Amount to pay</p>
              <p className="text-3xl font-bold font-serif text-[#2C1810] dark:text-[#F5E6D8] tabular-nums">
                ₹{amount.toLocaleString("en-IN")}
              </p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center gap-3 py-4 text-green-600 dark:text-green-400 animate-in fade-in zoom-in slide-in-from-bottom-2">
                <CheckCircle2 className="h-10 w-10 text-green-600 stroke-[1.5]" />
                <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase">Payment Successful</p>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center justify-center gap-4 py-6">
                <LoadingSpinner />
                <p className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase animate-pulse">Processing securely...</p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <Button 
                  onClick={handlePayment} 
                  className="w-full bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] hover:text-white rounded-none border border-[#D4AF37]/35 h-12 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Pay Securely
                </Button>
                <Button 
                  onClick={onClose} 
                  variant="ghost" 
                  className="w-full text-[#7A6B5D] hover:text-[#4A0E17] font-sans text-[9px] font-bold tracking-[0.18em] uppercase rounded-none cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          
          {/* Razorpay Footer */}
          <div className="mt-6 flex items-center justify-center gap-1.5 opacity-60">
            <span className="text-[10px] uppercase font-bold text-slate-500">Secured by</span>
            <span className="text-[11px] font-bold text-[#02042B] dark:text-white">Razorpay</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
