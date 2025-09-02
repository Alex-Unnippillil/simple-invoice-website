import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

import './globals.css';

export const metadata = {
  title: 'Simple Invoice',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="layout">
          <Sidebar />
          <main>{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
