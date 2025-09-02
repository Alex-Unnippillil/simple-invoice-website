import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '../../authOptions';
import { redirect } from 'next/navigation';

/**
 * Retrieve the current session on the server. If no session exists,
 * the request is redirected to the login page.
 */
export async function requireAuth() {
  const session = await getServerSession(buildAuthOptions());
  if (!session) {
    redirect('/login');
  }
  return session;
}
