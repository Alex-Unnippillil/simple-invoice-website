import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/invoices">Invoices</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
