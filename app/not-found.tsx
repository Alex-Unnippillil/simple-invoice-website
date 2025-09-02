import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p>The page you are looking for could not be found.</p>
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
