import fs from 'fs';

const file = 'src/app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove imports for Navbar, Sidebar, SidebarProvider, SidebarInset, DemoBanner, Footer, MainLayout
content = content.replace(/import { Navbar } from "@\/components\/Navbar";\n/, "");
content = content.replace(/import Sidebar  from "@\/components\/Sidebar";\n/, "");
content = content.replace(/import { SidebarProvider, SidebarInset } from "@\/components\/ui\/sidebar";\n/, "");
content = content.replace(/import { DemoBanner } from "@\/components\/DemoBanner";\n/, "");
content = content.replace(/import { Footer } from "@\/components\/Footer";\n/, "");
content = content.replace(/import { MainLayout } from "@\/components\/MainLayout";\n/, "");

// Add import for AppShell
content = content.replace(
  'import { ThemeProvider } from "@/components/theme-provider";',
  'import { ThemeProvider } from "@/components/theme-provider";\nimport { AppShell } from "@/components/AppShell";'
);

// Replace the SidebarProvider block with AppShell
content = content.replace(
  /<SidebarProvider defaultOpen={false}>[\s\S]*?<\/SidebarProvider>/,
  '<AppShell>{children}</AppShell>'
);

fs.writeFileSync(file, content);
console.log("Updated layout.tsx");
