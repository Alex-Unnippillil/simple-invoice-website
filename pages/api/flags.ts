import type { NextApiRequest, NextApiResponse } from 'next';
import { getEmergencyOverride, setEmergencyOverride } from '../../lib/flags';

export default function flags(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ disabled: getEmergencyOverride() });
    return;
  }
  if (req.method === 'POST') {
    const { disabled } = req.body as { disabled?: boolean };
    setEmergencyOverride(Boolean(disabled));
    res.status(200).json({ disabled: getEmergencyOverride() });
    return;
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
