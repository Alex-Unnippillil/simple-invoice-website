import type { Property } from '@/db/schema/properties';

// Simple stub that pretends to create a PDF using property branding.
export function generateReceiptPdf(property: Property) {
  return `PDF with logo ${property.logo ?? 'none'} and color ${property.color ?? '#000000'}`;
}
