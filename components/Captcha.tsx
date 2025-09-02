'use client';

import dynamic from 'next/dynamic';

const Turnstile = dynamic(() => import('react-turnstile'), { ssr: false });
const HCaptcha = dynamic(() => import('@hcaptcha/react-hcaptcha'), { ssr: false });

export default function Captcha() {
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const hCaptchaKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  if (turnstileKey) {
    return <Turnstile sitekey={turnstileKey} />;
  }

  if (hCaptchaKey) {
    return <HCaptcha sitekey={hCaptchaKey} />;
  }

  return null;
}
