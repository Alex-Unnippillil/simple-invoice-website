'use client';

import { useEffect, useState } from 'react';
import Captcha from '../components/Captcha';

export default function Home() {
  const [captchaRequired, setCaptchaRequired] = useState(false);

  useEffect(() => {
    fetch('/api/rate-limit').then((res) => res.json()).then((data) => {
      if (!data.success) {
        setCaptchaRequired(true);
      }
    });
  }, []);

  return (
    <main>
      <h1>Simple Form</h1>
      <form>
        <input type="text" name="name" placeholder="Name" />
        {captchaRequired && <Captcha />}
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
