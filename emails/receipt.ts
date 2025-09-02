import type { Property } from '@/db/schema/properties';

// Stub email template that pulls in property branding.
export function renderReceiptEmail(property: Property) {
  return `Email with logo ${property.logo ?? 'none'} and color ${property.color ?? '#000000'}`;
}
