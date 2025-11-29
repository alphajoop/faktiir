import type { Metadata } from 'next';
import * as React from 'react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarComponent } from '@/components/dashboard/sidebar';

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
