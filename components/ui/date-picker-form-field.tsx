'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { type Control, Controller, type FieldValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: keyof TFieldValues & string;
  label: string;
};

export function DatePickerFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
}: Props<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => (
        <div className="space-y-1">
          <Label>{label}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left"
              >
                {field.value
                  ? format(new Date(field.value), 'dd/MM/yyyy', { locale: fr })
                  : 'Sélectionner une date'}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date?.toISOString().split('T')[0]);
                }}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    />
  );
}
