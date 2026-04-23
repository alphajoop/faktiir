'use client';

import { GithubIcon } from '@/components/icons/github-icon';
import { Button } from '@/components/ui/button';

interface GithubSignInButtonProps {
  className?: string;
  label?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export function GithubSignInButton({
  className,
  label = 'Continuer avec GitHub',
}: GithubSignInButtonProps) {
  const handleClick = () => {
    // Redirige vers le backend qui lance le flow OAuth GitHub
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleClick}
    >
      <GithubIcon className="size-4" />
      {label}
    </Button>
  );
}
