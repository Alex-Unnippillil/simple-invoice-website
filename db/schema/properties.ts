export interface InvoiceProperties {
  /** Unique identifier for the invoice */
  id: string;

  /** Total amount for the invoice in the specified currency */
  amount: number;

  /** ISO 4217 currency code for the invoice */
  currency: string;
}
