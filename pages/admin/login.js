import { signIn } from "next-auth/react";

export default function AdminLogin() {
  return (
    <div>
      <h1>Admin Login</h1>
      <button onClick={() => signIn('azure-ad')}>Sign in with Microsoft</button>
    </div>
  );
}
