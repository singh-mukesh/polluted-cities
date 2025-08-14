import axios from 'axios';
import config from '../config/env.js';
import { loginAndGetToken } from './authApi.js';

// Example lookup map — you can expand as needed
const COUNTRY_NAME_MAP = {
  pl: 'Poland',
  de: 'Germany',
  es: 'Spain',
  fr: 'France',
  in: 'India',
  us: 'United States',
  cn: 'China',
  jp: 'Japan',
};

export async function fetchPollutedCities(data) {
  const { API_URL } = config;
  const token = await loginAndGetToken();

  try {
    const countries = data?.country
      ? data.country
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    if (countries.length === 0) {
      throw new Error('No country provided');
    }

    // Prepare promises with per-country mapping
    const promises = countries.map(async (countryCode) => {
      const countryName =
        COUNTRY_NAME_MAP[countryCode.toLowerCase()] || countryCode;
      try {
        const res = await axios.get(
          `${API_URL}/pollution?country=${encodeURIComponent(countryCode)}&page=${data.page}&limit=${data.limit}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Ensure each record has the country name
        return (res.data?.results || []).map((item) => ({
          ...item,
          country: countryName,
        }));
      } catch (err) {
        console.error(
          `Error fetching data for country ${countryCode}:`,
          err.response?.status,
          err.response?.data
        );
        return []; // continue even if this one fails
      }
    });

    // Wait for all to finish
    const allResults = await Promise.all(promises);

    // Flatten into one array
    const mergedResults = allResults.flat();

    return { results: mergedResults };
  } catch (err) {
    console.error('Error fetching polluted cities:', err.message);
    throw err;
  }
}
