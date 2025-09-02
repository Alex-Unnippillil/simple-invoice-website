'use client';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-bold">500 - Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()} className="underline">
        Try again
      </button>
      <nav className="flex gap-4">
        <Link href="/tenant" className="underline">
          Tenant Dashboard
        </Link>
        <Link href="/admin" className="underline">
          Admin Dashboard
        </Link>
      </nav>
    </div>
  );
}
