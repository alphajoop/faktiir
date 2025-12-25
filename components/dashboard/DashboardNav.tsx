'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import DynamicBreadcrumb from '@/components/dashboard/breadcrumb';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useUser } from '@/hooks/use-user';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardNav() {
  const { user, isLoading } = useUser();

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 w-full border-b px-4 backdrop-blur md:px-6">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="bg-foreground text-foreground mr-2 h-4"
          />
          <DynamicBreadcrumb />
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="hidden space-y-1 md:block">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <Avatar className="border-primary/20 relative h-8 w-8 border shadow-sm">
                {user.companyLogo ? (
                  <Image
                    src={user.companyLogo}
                    alt="Logo"
                    className="h-full w-full rounded-lg object-cover"
                    fill
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary rounded-lg font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium capitalize">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
