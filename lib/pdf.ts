import type { Property } from '../db/schema/properties';
import { isFeatureEnabled } from './flags';

// Simple stub that pretends to create a PDF using property branding.
export function generateReceiptPdf(property: Property) {
  if (!isFeatureEnabled('pdf')) {
    return 'PDF generation disabled';
  }
  return `PDF with logo ${property.logo ?? 'none'} and color ${property.color ?? '#000000'}`;
}
