'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import FaktiirIcon from '@/components/icons/faktiir-icon';

import { getMenuItems } from '@/data/navigation';
import { UserMenu } from '@/components/dashboard/user-menu';
import { signOut, useSession } from 'next-auth/react';
import { useSidebar } from '@/components/ui/sidebar';

export function SidebarComponent() {
  const { data: session } = useSession();
  const user = session?.user;
  const { isMobile, setOpenMobile } = useSidebar();
  const handleSignOut = () => {
    if (isMobile) setOpenMobile(false);
    signOut({ callbackUrl: '/' });
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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <FaktiirIcon className="text-background size-5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="logo-text font-semibold">Faktiir</span>
                <span className="text-xs capitalize">{user?.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Général</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      href={item.url}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user ? (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserMenu
                user={user}
                signOut={handleSignOut}
                isMobile={isMobile}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      ) : null}
      <SidebarRail />
    </Sidebar>
  );
}
