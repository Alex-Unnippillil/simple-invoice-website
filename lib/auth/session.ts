import { randomUUID } from 'crypto';
import type { ServerResponse } from 'http';
import { serialize } from 'cookie';

const SESSION_COOKIE = 'sid';
const SESSION_MAX_AGE = 15 * 60; // 15 minutes
const PRIVILEGED_SESSION_MAX_AGE = 5 * 60; // 5 minutes

interface SessionOptions {
  /** Flag indicating the session has elevated privileges. */
  privileged?: boolean;
}

function buildCookie(id: string, opts: SessionOptions = {}): string {
  const maxAge = opts.privileged ? PRIVILEGED_SESSION_MAX_AGE : SESSION_MAX_AGE;
  const sameSite = opts.privileged ? 'strict' : 'lax';

  return serialize(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: true,
    sameSite,
    path: '/',
    maxAge,
  });
}

/**
 * Set a session cookie on the response. The cookie is configured with
 * HttpOnly, Secure and SameSite flags to reduce exposure to CSRF and
 * XSS attacks.
 */
export function setSession(res: ServerResponse, id: string, opts: SessionOptions = {}): void {
  res.setHeader('Set-Cookie', buildCookie(id, opts));
}

/**
 * Rotate the current session by issuing a new identifier. This is useful when
 * the user's privilege level changes to prevent session fixation.
 *
 * @returns the newly generated session id.
 */
export function rotateSession(res: ServerResponse, opts: SessionOptions = {}): string {
  const newId = randomUUID();
  setSession(res, newId, opts);
  return newId;
}
