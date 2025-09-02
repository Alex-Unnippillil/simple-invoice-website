"use client";

import { useState } from "react";

export default function PayPage() {
  const [saveForNextMonth, setSaveForNextMonth] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/pay/create-setup-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saveForNextMonth }),
    });
    // In a real app, handle response or errors here
    console.log(await response.json());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Placeholder for existing payment form fields */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={saveForNextMonth}
          onChange={(e) => setSaveForNextMonth(e.target.checked)}
        />
        Save for next month
      </label>
      <button type="submit" className="btn-primary">
        Pay
      </button>
    </form>
  );
}
