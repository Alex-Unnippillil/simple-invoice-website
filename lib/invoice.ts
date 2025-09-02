/**
 * Generate a unique invoice number in the format "INV-YYYY-####".
 * Uses a database transaction to avoid collisions when multiple invoices
 * are created concurrently.
 */

// A very small interface describing the bits of a database client we need.
export interface Transaction {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface Database {
  beginTransaction(): Promise<Transaction>;
}

/**
 * Generate the next invoice number for the current year.
 *
 * The implementation keeps a per-year counter in an `invoice_numbers` table
 * with columns `(year INT PRIMARY KEY, last_value INT)`. The row for the
 * current year is selected/created inside a transaction so that concurrent
 * calls cannot produce duplicate invoice numbers.
 */
export async function generateInvoiceNumber(db: Database): Promise<string> {
  const year = new Date().getFullYear();
  const tx = await db.beginTransaction();

  try {
    // Lock the counter row for the current year.
    const result = await tx.query<{ last_value: number }>(
      'SELECT last_value FROM invoice_numbers WHERE year = $1 FOR UPDATE',
      [year]
    );

    let value = 1;

    if (result.rows.length > 0) {
      value = result.rows[0].last_value + 1;
      await tx.query('UPDATE invoice_numbers SET last_value = $1 WHERE year = $2', [value, year]);
    } else {
      await tx.query('INSERT INTO invoice_numbers (year, last_value) VALUES ($1, $2)', [year, value]);
    }

    await tx.commit();

    const padded = String(value).padStart(4, '0');
    return `INV-${year}-${padded}`;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

