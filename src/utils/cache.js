const cache = {};
const TTL = 60 * 1000; // 1 minute

export function get(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < TTL) {
    return entry.value;
  }
  return null;
}

export function set(key, value) {
  cache[key] = { value, timestamp: Date.now() };
}
