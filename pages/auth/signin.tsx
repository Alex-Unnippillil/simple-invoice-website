import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('Sending link...');
    const res = await signIn('email', { email, redirect: false });
    if (res?.error) setMessage(res.error);
    else setMessage('Check your email for the login link.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send magic link</button>
      {message && <p>{message}</p>}
    </form>
  );
}
