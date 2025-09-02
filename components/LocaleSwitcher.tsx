'use client';

import Link from 'next-intl/link';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname} from 'next-intl/client';
import {locales} from '../i18n';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <div>
      <span>{t('label')}: </span>
      {locales.map((locale) => (
        locale === currentLocale ? (
          <span key={locale}>{locale.toUpperCase()}</span>
        ) : (
          <Link key={locale} href={pathname} locale={locale}>
            {locale.toUpperCase()}
          </Link>
        )
      ))}
    </div>
  );
}
