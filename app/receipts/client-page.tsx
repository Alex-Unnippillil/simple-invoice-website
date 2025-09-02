'use client';

export default function ClientReceiptsPage() {
  const downloadAll = async () => {
    const res = await fetch('/api/receipts/export');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'receipts.zip';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Receipts</h1>
      <button onClick={downloadAll}>Download all receipts</button>
    </div>
  );
}
