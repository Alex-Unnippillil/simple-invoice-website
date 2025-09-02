const translations = {
  en: {
    subject: 'Welcome',
    body: 'Thanks for signing up!',
  },
  es: {
    subject: 'Bienvenido',
    body: '¡Gracias por registrarte!',
  },
} as const;

export type Locale = keyof typeof translations;

export function renderWelcomeEmail(locale: Locale): string {
  const t = translations[locale] ?? translations.en;
  return `<h1>${t.subject}</h1><p>${t.body}</p>`;
}

export function getWelcomeSubject(locale: Locale): string {
  return (translations[locale] ?? translations.en).subject;
}
