export type Flags = Record<string, unknown>;

/**
 * Retrieve feature flags from either Unleash or Edge Config.
 *
 * When `UNLEASH_API_URL` and `UNLEASH_API_TOKEN` are set, flags are fetched from
 * the Unleash client API. Otherwise, when `EDGE_CONFIG_URL` is set, flags are
 * fetched from a Vercel Edge Config endpoint. If neither is configured an empty
 * object is returned.
 */
export async function getFlags(): Promise<Flags> {
  if (process.env.UNLEASH_API_URL && process.env.UNLEASH_API_TOKEN) {
    try {
      const res = await fetch(`${process.env.UNLEASH_API_URL}/client/features`, {
        headers: {
          Authorization: process.env.UNLEASH_API_TOKEN,
        },
        cache: 'no-store',
      });
      if (!res.ok) {
        return {};
      }
      const data = await res.json();
      const flags: Flags = {};
      if (Array.isArray(data.features)) {
        for (const feature of data.features) {
          flags[feature.name] = feature.enabled;
        }
      }
      return flags;
    } catch (err) {
      return {};
    }
  }

  if (process.env.EDGE_CONFIG_URL) {
    try {
      const res = await fetch(process.env.EDGE_CONFIG_URL, {
        cache: 'no-store',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // ignore
    }
  }

  return {};
}
