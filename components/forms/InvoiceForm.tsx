'use client';

import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive')
});

const invoiceSchema = z.object({
  client: z.string().min(1, 'Client is required'),
  taxRate: z.number().min(0, 'Tax rate must be positive'),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required')
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export default function InvoiceForm() {
  const [serverTotals, setServerTotals] = useState<{subTotal: number; tax: number; total: number} | null>(null);
  const { control, register, handleSubmit } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client: '',
      taxRate: 0,
      lineItems: [{ description: '', quantity: 1, price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  });

  const lineItems = useWatch({ control, name: 'lineItems' });
  const taxRate = useWatch({ control, name: 'taxRate' });

  const subTotal = lineItems?.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0) || 0;
  const tax = subTotal * (Number(taxRate) || 0) / 100;
  const total = subTotal + tax;

  const onSubmit = async (data: InvoiceFormValues) => {
    const res = await fetch('/api/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    setServerTotals(json);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Client</label>
        <input className="border p-2" {...register('client')} />
      </div>
      <div>
        <label className="block font-medium">Tax Rate (%)</label>
        <input type="number" step="0.01" className="border p-2" {...register('taxRate', { valueAsNumber: true })} />
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 items-end">
            <input
              className="border p-2 flex-1"
              placeholder="Description"
              {...register(`lineItems.${index}.description` as const)}
            />
            <input
              type="number"
              className="border p-2 w-24"
              placeholder="Qty"
              {...register(`lineItems.${index}.quantity` as const, { valueAsNumber: true })}
            />
            <input
              type="number"
              className="border p-2 w-32"
              placeholder="Price"
              step="0.01"
              {...register(`lineItems.${index}.price` as const, { valueAsNumber: true })}
            />
            <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ description: '', quantity: 1, price: 0 })} className="text-blue-500">Add Line Item</button>
      </div>

      <div className="pt-4">
        <p>Subtotal: {subTotal.toFixed(2)}</p>
        <p>Tax: {tax.toFixed(2)}</p>
        <p>Total: {total.toFixed(2)}</p>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Submit</button>

      {serverTotals && (
        <div className="pt-4">
          <h2 className="font-medium">Server Totals</h2>
          <p>Subtotal: {serverTotals.subTotal.toFixed(2)}</p>
          <p>Tax: {serverTotals.tax.toFixed(2)}</p>
          <p>Total: {serverTotals.total.toFixed(2)}</p>
        </div>
      )}
    </form>
  );
}
