import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home({ user }: { user: string | null }) {
  return (
    <main>
      <h1>Simple Invoice</h1>
      {user ? <p>Welcome, {user}</p> : <p>Please sign in.</p>}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  return { props: { user: session?.user?.email ?? null } };
};
