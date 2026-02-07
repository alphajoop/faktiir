'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DatePickerFormField } from '@/components/ui/date-picker-form-field';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateInvoice } from '@/hooks/use-create-invoice';
import { cn } from '@/lib/utils';
import { InvoiceLimitDialog } from './invoice-limit-dialog';

const itemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().min(1, 'La quantité doit être au moins 1'),
  price: z.number().min(0.01, 'Le prix doit être supérieur à 0'),
});

const invoiceFormSchema = z.object({
  clientName: z.string().min(2, 'Le nom du client est requis'),
  clientEmail: z.string().email('Email invalide'),
  items: z.array(itemSchema).min(1, 'Au moins un article est requis'),
  tax: z.number().min(0, 'La TVA ne peut pas être négative'),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export function InvoiceForm() {
  const {
    mutate: createInvoice,
    isPending,
    limitDialogOpen,
    setLimitDialogOpen,
    limitInfo,
  } = useCreateInvoice();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      items: [
        {
          description: '',
          quantity: 1,
          price: 0,
        },
      ],
      tax: 20,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const onSubmit = (data: InvoiceFormValues) => {
    createInvoice({
      ...data,
      subtotal: data.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      ),
      total: data.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      ),
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du client</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email du client</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@exemple.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TVA (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DatePickerFormField
              control={form.control}
              name="dueDate"
              label="Date d'échéance"
            />
            <FormMessage />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Articles</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ description: '', quantity: 1, price: 0 })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un article
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-12 sm:gap-4"
              >
                <div className="sm:col-span-5">
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index > 0 && 'sr-only')}>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Description de l'article"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index > 0 && 'sr-only')}>
                          Quantité
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index > 0 && 'sr-only')}>
                          Prix unitaire (FCFA)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-end sm:col-span-1 sm:justify-center sm:pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive"
                    disabled={isPending || fields.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Création...' : 'Créer la facture'}
            </Button>
          </div>
        </form>
      </Form>

      <InvoiceLimitDialog
        open={limitDialogOpen}
        onOpenChange={setLimitDialogOpen}
        isSubscribed={limitInfo.isSubscribed}
        monthlyUsed={limitInfo.monthlyUsed}
        monthlyQuota={limitInfo.monthlyQuota}
      />
    </>
  );
}
