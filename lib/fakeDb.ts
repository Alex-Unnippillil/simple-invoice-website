export interface Invoice {
  invoiceId: string;
  amount: number;
  dueDate: string;
}

export class FakeDB {
  private data: Invoice[] = [];
  private transaction: Invoice[] | null = null;

  begin() {
    this.transaction = [...this.data];
  }

  insert(row: Invoice) {
    if (!this.transaction) throw new Error('No transaction started');
    this.transaction.push(row);
  }

  commit() {
    if (!this.transaction) throw new Error('No transaction started');
    this.data = this.transaction;
    this.transaction = null;
  }

  rollback() {
    this.transaction = null;
  }

  getAll() {
    return this.data;
  }
}

export const db = new FakeDB();
