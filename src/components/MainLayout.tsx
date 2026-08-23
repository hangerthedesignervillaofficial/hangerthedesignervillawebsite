"use client";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return <main className="flex-1 pb-20 md:pb-0">{children}</main>;
}
