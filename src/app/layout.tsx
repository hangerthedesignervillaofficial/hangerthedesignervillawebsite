import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/AppShell";
import { TanStackQueryProvider } from "@/lib/providers/query-provider";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { PhoneNumberModal } from "@/components/PhoneNumberModal";
import { PresenceTracker } from "@/components/PresenceTracker";
import { ReactPolyfill } from "@/components/ReactPolyfill";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', weight: ['400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: "Hanger – The Designer Villa | Luxury Designer Wear",
  description: "Discover curated luxury designer wear from India's finest designers. Premium clothing, accessories & exclusive collections at Hanger – The Designer Villa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable, playfair.variable)}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body className="bg-background min-h-screen" suppressHydrationWarning>
        <ReactPolyfill />
        <ErrorBoundary>
          <TanStackQueryProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <PresenceTracker />
                    <AppShell>{children}</AppShell>
                    <PhoneNumberModal />
                  </ThemeProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </TanStackQueryProvider>
        </ErrorBoundary>
        <Toaster
          position="bottom-center"
          visibleToasts={1}
          theme="dark"
          closeButton
          className="toaster-wrapper"
          toastOptions={{
            classNames: {
              toast: "custom-luxury-toast",
              title: "custom-luxury-title",
              description: "custom-luxury-description",
              actionButton: "custom-luxury-action",
              cancelButton: "custom-luxury-cancel",
            },
          }}
        />
        
      </body>
    </html>
  );
}
