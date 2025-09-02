// Service to run health checks on application components with timeouts.
// Exports the `runChecks` function and a mutable `checks` object so tests can
// override behaviour.

const checks = {
  // Each check should resolve if the component is healthy. Placeholder checks
  // simply resolve immediately.
  database: async () => Promise.resolve(),
  cache: async () => Promise.resolve(),
};

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    promise
      .then((v) => {
        clearTimeout(id);
        resolve(v);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

async function runChecks(timeoutMs = 1000, customChecks = checks) {
  const entries = await Promise.all(
    Object.entries(customChecks).map(async ([name, fn]) => {
      try {
        await withTimeout(fn(), timeoutMs);
        return [name, { ok: true }];
      } catch (err) {
        return [name, { ok: false, error: err.message }];
      }
    })
  );
  const components = Object.fromEntries(entries);
  const ok = Object.values(components).every((c) => c.ok);
  return { ok, components };
}

module.exports = { runChecks, checks };
