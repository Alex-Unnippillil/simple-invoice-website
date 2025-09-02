export interface Property {
  id: string;
  name: string;
  address: string;
  // URL to the property's logo. Optional because not every property will have branding.
  logo?: string;
  // Primary brand color for emails/PDFs. Stored as a hex string.
  color?: string;
}

export const defaultBranding: Pick<Property, 'logo' | 'color'> = {
  logo: undefined,
  color: '#000000'
};
