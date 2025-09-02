export default function Home() {
  const handleClick = () => {
    throw new Error('Test Sentry error on client');
  };

  return (
    <div>
      <h1>Simple Invoice App</h1>
      <button onClick={handleClick}>Trigger Client Error</button>
    </div>
  );
}
