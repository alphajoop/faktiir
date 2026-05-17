'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SIDEBAR_COOKIE_NAME,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split('; ').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
    const savedState = cookies[SIDEBAR_COOKIE_NAME];
    if (savedState !== undefined) {
      setSidebarOpen(savedState === 'true');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh flex-col overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
