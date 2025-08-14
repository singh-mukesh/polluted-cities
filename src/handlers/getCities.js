import { fetchPollutedCities } from '../services/pollutionService.js';
import { getWikiDescription } from '../services/wikiService.js';
import * as cache from '../utils/cache.js';
import pLimit from 'p-limit';
import { createCityObject, isValidRecord } from '../utils/validation.js';

export async function getCities(data) {
  try {
    // Extract and normalize query params
    const input = { ...(data.queryStringParameters || {}) };
    input.page = Number(input.page) || 1;
    input.limit = Number(input.limit) || 100;

    // Build a unique cache key per query
    const cacheKey = `cities:${JSON.stringify(input)}`;

    let response = {
      page: input.page,
      limit: input.limit,
      total: 0,
      cities: [],
    };

    // Try cache
    const cached = cache.get(cacheKey);
    if (cached) {
      response.total = cached.length;
      response.cities = cached;
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }

    // Fetch data from pollution API
    const rawCities = await fetchPollutedCities(input);

    const normalized = rawCities.results
      .map(createCityObject)
      .filter(isValidRecord);

    // Pick most polluted per country
    const topCities = getMostPollutedPerCountry(normalized);

    // Enrich with wiki descriptions (limit concurrency to 5)
    const limit = pLimit(5);
    const enriched = await Promise.all(
      topCities.map((rec) =>
        limit(async () => {
          const description = await getWikiDescription(rec.name);
          return description ? { ...rec, description } : null;
        })
      )
    );

    const enrichedCities = enriched.filter(Boolean);

    // Save to cache for this exact query
    cache.set(cacheKey, enrichedCities);

    // Prepare final response
    response.total = enrichedCities.length;
    response.cities = enrichedCities;

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.error('Error in getCities handler:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}

function getMostPollutedPerCountry(cities) {
  // Group by country
  const grouped = cities.reduce((acc, city) => {
    if (!acc[city.country]) {
      acc[city.country] = [];
    }
    acc[city.country].push(city);
    return acc;
  }, {});

  // Pick the most polluted from each country
  return Object.values(grouped).map(
    (countryCities) =>
      countryCities.sort((a, b) => b.pollution - a.pollution)[0]
  );
}
