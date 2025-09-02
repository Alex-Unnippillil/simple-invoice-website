import InvoiceForm from "@/components/forms/InvoiceForm";

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      <InvoiceForm />
    </main>
  );
}
