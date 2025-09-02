const translations = {
  en: {
    subject: 'Invoice Ready',
    body: (amount: number) => `Your invoice of $${amount} is ready.`,
  },
  es: {
    subject: 'Factura Lista',
    body: (amount: number) => `Tu factura de $${amount} está lista.`,
  },
} as const;

export type Locale = keyof typeof translations;

export function renderInvoiceEmail(locale: Locale, amount: number): string {
  const t = translations[locale] ?? translations.en;
  return `<h1>${t.subject}</h1><p>${t.body(amount)}</p>`;
}

export function getInvoiceSubject(locale: Locale): string {
  return (translations[locale] ?? translations.en).subject;
}
