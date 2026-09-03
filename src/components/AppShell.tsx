"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DemoBanner } from "@/components/DemoBanner";
import { Footer } from "@/components/Footer";
import { MainLayout } from "@/components/MainLayout";
import { MobileBottomNav } from "@/components/MobileBottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  
  // If we are in the admin section, DO NOT render the website header/footer.
  // Just render the children (which includes the AdminSidebar from admin/layout.tsx)
  const isAdmin = pathname?.toLowerCase().startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  // Public website layout
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar />
      <SidebarInset>
        <DemoBanner />
        <Navbar />
        <MainLayout>{children}</MainLayout>
        <Footer />
        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
