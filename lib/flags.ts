function isEnabled(name: string): boolean {
  return process.env[name] === 'true';
}

export const features = {
  autopay: isEnabled('NEXT_PUBLIC_FLAG_AUTOPAY'),
  ach: isEnabled('NEXT_PUBLIC_FLAG_ACH'),
  experimentalSearch: isEnabled('NEXT_PUBLIC_FLAG_SEARCH'),
};

export const autopayEnabled = features.autopay;
export const achEnabled = features.ach;
export const experimentalSearchEnabled = features.experimentalSearch;
