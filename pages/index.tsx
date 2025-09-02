import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/organization')
      .then((res) => {
        if (res.status === 404) {
          router.replace('/setup');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          router.replace('/dashboard');
        }
      })
      .catch(() => router.replace('/setup'));
  }, [router]);

  return <p>Loading...</p>;
}
