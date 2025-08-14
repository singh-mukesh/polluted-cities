import axios from 'axios';
import * as cache from '../utils/cache.js';

export async function getWikiDescription(cityName) {
  const cached = cache.get(cityName);
  if (cached) return cached;

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
    const res = await axios.get(url);
    const description = res.data.description || 'No description available';
    cache.set(cityName, description);
    return description;
  } catch (err) {
    return 'Description not available';
  }
}
