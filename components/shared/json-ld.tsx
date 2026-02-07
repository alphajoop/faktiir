'use client';

import { useEffect, useRef } from 'react';

interface JsonLdProps {
  data: object;
}

export function JsonLd({ data }: JsonLdProps) {
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.textContent = JSON.stringify(data);
    }
  }, [data]);

  return <script ref={scriptRef} type="application/ld+json" />;
}
