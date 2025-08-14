import { getCities } from '../src/handlers/getCities.js';

export async function getCitiesHandler(data) {
  return getCities(data);
}
