'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface SearchParamsProviderProps {
  children: (searchParams: URLSearchParams) => React.ReactNode;
}

export function SearchParamsProvider({ children }: SearchParamsProviderProps) {
  return (
    <Suspense fallback={null}>
      <SearchParamsWrapper>{children}</SearchParamsWrapper>
    </Suspense>
  );
}

function SearchParamsWrapper({ children }: SearchParamsProviderProps) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}
