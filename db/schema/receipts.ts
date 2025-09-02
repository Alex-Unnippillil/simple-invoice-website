import { z } from 'zod';

/**
 * Receipt schema storing the signed URL used to download the generated PDF.
 */
export const receiptSchema = z.object({
  id: z.string().uuid(),
  paymentId: z.string(),
  pdfKey: z.string(),
  signedUrl: z.string().url(),
});

export type Receipt = z.infer<typeof receiptSchema>;
