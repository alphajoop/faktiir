'use client';

import {
  LayoutDashboardIcon,
  LogOutIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import FaktiirIcon from '@/components/icons/faktiir-icon';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Text } from '@/components/ui/typography';
import { useAuth } from '@/lib/auth-context';
import { getInitials } from '@/lib/user-utils';

const navItems = [
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboardIcon },
  { label: 'Factures', href: '/dashboard/invoices', icon: ReceiptIcon },
  { label: 'Clients', href: '/dashboard/clients', icon: UsersIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-7 items-center justify-center rounded-md">
                <FaktiirIcon className="text-background size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-heading font-semibold text-sm text-foreground group-data-[collapsible=icon]:hidden">
                  FAKTIIR
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/settings'}
              tooltip="Paramètres"
            >
              <Link href="/dashboard/settings">
                <SettingsIcon />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {user && (
          <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
            <Avatar size="sm">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
              <Text size="xs" weight="medium" className="truncate">
                {user.name}
              </Text>
              <Text size="xs" variant="muted" className="truncate">
                {user.email}
              </Text>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 group-data-[collapsible=icon]:hidden">
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleLogout}
                title="Se déconnecter"
              >
                <LogOutIcon />
              </Button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
