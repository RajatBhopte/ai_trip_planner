# AI Travel Guide – Personalized Tour Planner

Plan personalized itineraries and explore suggested trips. Built with Next.js (App Router) and Tailwind.

## Features

- Itinerary Builder: form-driven prompt to generate an itinerary via `/api/itinerary` (OpenAI optional; local fallback included)
- Suggested Trips: curated destinations at `/suggested-trips`
- Weather Proxy: `/api/weather` to fetch OpenWeatherMap data

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with optional keys:

```bash
GEMINI_API_KEY= # optional, for richer itineraries
OPENWEATHER_API_KEY= # required for weather endpoint
```

## Develop

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build && npm run start
```

## Project Structure

- `src/app/page.tsx`: Itinerary Builder page
- `src/app/suggested-trips/page.tsx`: Suggested Trips page
- `src/app/api/itinerary/route.ts`: itinerary generation (OpenAI optional)
- `src/app/api/weather/route.ts`: weather proxy to OpenWeatherMap
- `src/components/ItineraryForm.tsx`: builder form
- `src/components/ItineraryResult.tsx`: result display

## Notes

- If no `OPENAI_API_KEY` is set, the itinerary falls back to a local 3-day template.
- Weather requires `OPENWEATHER_API_KEY`. Get a free key at `https://openweathermap.org/`.
