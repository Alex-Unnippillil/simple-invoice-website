'use client';

import { useState } from 'react';

export default function ImportPage() {
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState('');

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Imported ${data.rows} rows`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`p-10 border-2 border-dashed text-center ${dragOver ? 'bg-gray-100' : ''}`}
    >
      <p>Drag and drop CSV file here</p>
      {message && <p>{message}</p>}
    </div>
  );
}
