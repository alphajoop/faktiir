'use client';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { LayoutDashboard } from 'lucide-react';
import { routeNameMapping } from '@/data/navigation';

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <div className="flex items-center">
                <LayoutDashboard className="mr-1 h-3.5 w-3.5" />
                Tableau de bord
              </div>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Special case for dashboard root
  if (pathname === '/dashboard') {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="overflow-x-auto whitespace-nowrap">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 sm:gap-2"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.slice(1).map((segment, index) => {
          const isLastSegment = index === segments.length - 2;
          const href = `/${segments.slice(0, index + 2).join('/')}`;
          const segmentName =
            routeNameMapping[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator className="mx-0 sm:mx-2" />
              <BreadcrumbItem className="max-w-[120px] overflow-hidden text-ellipsis">
                {isLastSegment ? (
                  <BreadcrumbPage className="truncate">
                    {segmentName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="truncate">
                      {segmentName}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
