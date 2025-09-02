import { describe, it, expect } from 'vitest';
import { ServerResponse } from 'http';
import { setSession, rotateSession } from '../lib/auth/session';

function createResponse() {
  return new ServerResponse({} as any);
}

describe('session persistence', () => {
  it('sets a session cookie with the given id', () => {
    const res = createResponse();
    setSession(res, 'abc');
    const cookie = res.getHeader('Set-Cookie') as string;
    expect(cookie).toContain('sid=abc');
    expect(cookie).toMatch(/Max-Age=900/);
  });

  it('rotates the session id', () => {
    const res = createResponse();
    const newId = rotateSession(res);
    const cookie = res.getHeader('Set-Cookie') as string;
    expect(cookie).toContain(`sid=${newId}`);
  });
});
