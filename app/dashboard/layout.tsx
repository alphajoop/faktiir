import type { Metadata } from 'next';
import type * as React from 'react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { SidebarComponent } from '@/components/dashboard/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Faktiir - Tableau de bord',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarComponent />
      <SidebarInset>
        <DashboardNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
