import type { NextApiRequest, NextApiResponse } from 'next';
import { loadOrganization, saveOrganization } from '../../models/organization';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const org = loadOrganization();
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    return res.status(200).json(org);
  }

  if (req.method === 'POST') {
    const { name, primaryColor, secondaryColor, logo } = req.body || {};
    if (!name || !primaryColor || !secondaryColor || !logo) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    saveOrganization({ name, primaryColor, secondaryColor, logo });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
