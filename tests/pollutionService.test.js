import { expect } from 'chai';
import { fetchPollutedCities } from '../src/services/pollutionService.js';

describe('fetchPollutedCities', function () {
  // Increase timeout for async calls
  this.timeout(30000);

  it('should return an array of cities', async function () {
    let data = {
      page: 1,
      limit: 100,
      country: 'DE,PL',
    };
    const cities = await fetchPollutedCities(data);
    expect(cities).to.be.an('array');
  });
});
