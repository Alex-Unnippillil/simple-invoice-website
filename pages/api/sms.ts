import type { NextApiRequest, NextApiResponse } from 'next';
import { handleWebhook } from '../../lib/sms';

export default async function smsWebhook(req: NextApiRequest, res: NextApiResponse) {
  await handleWebhook(req as any, res as any);
}
