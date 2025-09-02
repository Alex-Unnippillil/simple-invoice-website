import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div>
        <h1>Simple Invoice</h1>
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
