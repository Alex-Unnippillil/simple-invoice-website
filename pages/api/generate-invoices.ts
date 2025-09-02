import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Invoice generation cron invoked');
  res.status(200).json({ ok: true });
}
