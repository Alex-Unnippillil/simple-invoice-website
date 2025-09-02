const LINK_USAGE_KEY = 'link-usage-email';
const memoryStore: Record<string, string> = {};

export function recordLinkUsage(email: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LINK_USAGE_KEY, email);
    } catch {
      /* ignore storage errors */
    }
  } else {
    memoryStore[LINK_USAGE_KEY] = email;
  }
}

export function getLastLinkEmail(): string | null {
  if (typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(LINK_USAGE_KEY);
    } catch {
      return null;
    }
  }
  return memoryStore[LINK_USAGE_KEY] || null;
}
