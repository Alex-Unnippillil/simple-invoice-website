import type { NextApiRequest, NextApiResponse } from 'next';
import { logEvent } from '../../database';

export default function analytics(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { leaseId = '', event, experimentId } = req.body || {};
  const variantId = req.cookies['experiment-variant'] || null;

  if (!event || !experimentId) {
    return res.status(400).json({ error: 'Missing event or experimentId' });
  }

  logEvent(leaseId, event, experimentId, variantId);
  return res.status(200).json({ success: true });
}
