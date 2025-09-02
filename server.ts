import express, { Request, Response } from 'express';
import path from 'path';
import { exportQuickBooksCSV, exportXeroCSV, Invoice } from './lib/accounting/exports';

const app = express();
const PORT = process.env.PORT || 3000;

// serve admin page
app.get('/admin', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// CSV export endpoint
app.get('/exports/:type', (req: Request, res: Response) => {
  const sample: Invoice[] = [
    {
      id: 'INV-001',
      customer: 'Sample Customer',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      item: 'Service',
      quantity: 1,
      rate: 100
    }
  ];

  const type = req.params.type;
  let csv: string;
  let filename: string;

  if (type === 'quickbooks') {
    csv = exportQuickBooksCSV(sample);
    filename = 'quickbooks.csv';
  } else if (type === 'xero') {
    csv = exportXeroCSV(sample);
    filename = 'xero.csv';
  } else {
    res.status(400).send('Unknown export type');
    return;
  }

  res.header('Content-Type', 'text/csv');
  res.attachment(filename);
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/admin`);
});
