export async function fetchWithMetrics(url, options = {}) {
  const start = performance.now();
  const res = await fetch(url, options);
  const duration = performance.now() - start;
  console.log(`Fetch to ${url} took ${duration.toFixed(2)}ms`);
  return res;
}
