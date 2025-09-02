import test from 'node:test';
import assert from 'node:assert/strict';
import { middleware } from '../middleware';

function makeRequest(path: string, token?: string) {
  const url = new URL(`https://example.com${path}`);
  (url as any).clone = () => new URL(url.toString());
  return {
    nextUrl: url,
    cookies: {
      get: (_: string) => (token ? { value: token } : undefined),
    },
  } as any;
}

test('redirects unauthenticated users accessing tenant routes', () => {
  const res = middleware(makeRequest('/tenant/dashboard')) as any;
  assert.equal(res.type, 'redirect');
  assert.equal(res.url.pathname, '/login');
});

test('allows tenant role on tenant routes', () => {
  const res = middleware(makeRequest('/tenant/dashboard', 'tenant')) as any;
  assert.equal(res.type, 'next');
});

test('rejects admin role on tenant routes', () => {
  const res = middleware(makeRequest('/tenant/dashboard', 'admin')) as any;
  assert.equal(res.status, 403);
});

test('allows admin role on admin routes', () => {
  const res = middleware(makeRequest('/admin/panel', 'admin')) as any;
  assert.equal(res.type, 'next');
});

test('rejects tenant role on admin routes', () => {
  const res = middleware(makeRequest('/admin/panel', 'tenant')) as any;
  assert.equal(res.status, 403);
});

test('redirects unauthenticated users accessing admin routes', () => {
  const res = middleware(makeRequest('/admin/panel')) as any;
  assert.equal(res.type, 'redirect');
  assert.equal(res.url.pathname, '/login');
});
