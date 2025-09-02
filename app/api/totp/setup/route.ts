import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri('user@example.com', 'SimpleInvoice', secret);
  const qr = await QRCode.toDataURL(otpauth);
  const res = NextResponse.json({ secret, otpauth, qr });
  res.cookies.set('mfa-secret', secret, { httpOnly: true, path: '/' });
  return res;
}
