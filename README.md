# Polluted Cities Service (Serverless)

A Serverless Node.js service to fetch the **most polluted city** for each given country using a pollution API, enrich results with Wikipedia descriptions, and return clean JSON.

---

## 🚀 Features

- **Most Polluted City per Country**: Returns only the top polluted city from each provided country.
- **Country Filtering**: Pass multiple countries as a query param (e.g., `PL,DE,ES`).
- **Wikipedia Enrichment**: Adds a short description for each city.
- **Local Development without Stage Prefix**: Run locally without `/dev` in your endpoint path.
- **Caching**: Simple in-memory cache to avoid redundant calls.

## Run locally

1. Install
   ```
   npm install
   ```
2. Start offline
   ```
   npm run dev
   ```
   Then call: `GET http://localhost:3000/cities?country=PL,DE,ES,FR`

## Deploy

```
npm run deploy
```

## Notes

- Uses in-memory cache (node-cache) for Wikipedia summaries (24h TTL).
- Validation rules in `src/models/cityModel.js`.
- If Wikipedia has no summary for a city, the record is skipped.
- For persistent caching across Lambda cold starts, use Redis or DynamoDB.
