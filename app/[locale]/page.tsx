import {useTranslations} from 'next-intl';

export default function IndexPage() {
  const t = useTranslations('Index');
  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}
