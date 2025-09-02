import nextIntl from 'next-intl/plugin';

const withNextIntl = nextIntl('./i18n.ts');

const nextConfig = {
  reactStrictMode: true,
  experimental: {appDir: true}
};

export default withNextIntl(nextConfig);
