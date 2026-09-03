"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return (
    <main className="flex-1 pb-20 md:pb-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
