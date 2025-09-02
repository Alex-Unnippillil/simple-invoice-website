'use client';
import React, { useState } from 'react';
import Modal from '../components/Modal';

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <main id="main">
      <h1>Welcome</h1>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <p>Modal content</p>
        <button onClick={() => setOpen(false)}>Close</button>
      </Modal>
    </main>
  );
}
