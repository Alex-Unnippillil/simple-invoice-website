import format from 'address-formatter';

export interface Address {
  house?: string;
  road?: string;
  suburb?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

/**
 * Formats an address object into a human-readable multi-line string.
 */
export function formatAddress(address: Address): string {
  const formatted = format(address, { output: 'array' }) as string[];
  return formatted.join('\n');
}
