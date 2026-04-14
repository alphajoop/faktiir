import type * as React from 'react';

import { cn } from '@/lib/utils';

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  allowDecimal?: boolean;
}

/**
 * Input numérique sans les défauts de type="number" :
 * - Pas de flèches natives
 * - Pas de comportement bizarre sur valeur vide
 * - inputMode="decimal" ouvre le bon clavier sur mobile
 * - N'accepte que les chiffres (et point/virgule si allowDecimal)
 */
export function NumericInput({
  value,
  onChange,
  min = 0,
  placeholder = '0',
  className,
  allowDecimal = false,
}: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Permettre champ vide pendant la saisie
    if (raw === '' || raw === '-') {
      onChange(0);
      return;
    }

    // Filtrer les caractères non numériques
    const pattern = allowDecimal ? /[^0-9.,]/ : /[^0-9]/;
    if (pattern.test(raw)) return;

    // Remplacer virgule par point pour parseFloat
    const normalized = raw.replace(',', '.');
    const num = parseFloat(normalized);

    if (Number.isNaN(num)) return;
    if (min !== undefined && num < min) return;

    onChange(num);
  };

  // Afficher valeur vide si 0 et pas en focus (meilleure UX)
  const displayValue = value === 0 ? '' : String(value).replace('.', ',');

  return (
    <input
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      pattern={allowDecimal ? '[0-9]*[.,]?[0-9]*' : '[0-9]*'}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
        'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'md:text-sm dark:bg-input/30',
        'text-right tabular-nums',
        'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className,
      )}
    />
  );
}
