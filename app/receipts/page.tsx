import ClientReceiptsPage from './client-page';
import { requireAuth } from '../../lib/auth/requireAuth';

export default async function ReceiptsPage() {
  await requireAuth();
  return <ClientReceiptsPage />;
}
