export function isValidCityName(name) {
  if (!name) return false;
  const s = name.trim();
  if (!/^[A-Za-z][A-Za-z\s\-]{1,}$/.test(s)) return false;
  // Allow Unicode letters, spaces, and hyphens — case-insensitive
  // if (!/^[\p{L}][\p{L}\s\-]{1,}$/u.test(s)) return false;
  if (s.length < 3) return false;
  const blacklist = new Set([
    'unknown',
    'n/a',
    'na',
    'none',
    'city',
    'capital',
    'test',
  ]);
  return !blacklist.has(s.toLowerCase());
}

export function isValidRecord(rec) {
  return (
    !!rec.name &&
    !!rec.country &&
    Number.isFinite(rec.pollution) &&
    rec.pollution >= 0 &&
    isValidCityName(rec.name)
  );
}

export function normalizeTitleCase(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function createCityObject(raw) {
  return {
    name: raw?.name ? normalizeTitleCase(raw.name) : null,
    country: raw?.country ? normalizeTitleCase(raw.country) : null,
    pollution: Number(raw?.pollution),
  };
}
