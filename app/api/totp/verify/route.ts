import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const secret = req.cookies.get('mfa-secret')?.value;
  if (!secret) {
    return NextResponse.json({ error: 'No secret' }, { status: 400 });
  }
  const valid = authenticator.verify({ token, secret });
  if (!valid) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
  const recoveryCodes = Array.from({ length: 10 }, () => randomBytes(5).toString('hex'));
  const res = NextResponse.json({ valid: true, recoveryCodes });
  res.cookies.set('mfa', 'true', { httpOnly: true, path: '/' });
  return res;
}
