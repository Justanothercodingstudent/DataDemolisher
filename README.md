# FRC Legends Mission Control

A futuristic Next.js web experience for elite FIRST Robotics Competition teams.

## Stack
- Next.js + React + TypeScript
- Tailwind CSS
- Framer Motion
- Three.js
- Chart.js

## Run locally
```bash
npm install
npm run dev
```

## Environment variables
Create `.env.local`:

```bash
NEXT_PUBLIC_FRC_TEAM=254
TBA_API_KEY=your_blue_alliance_key
```

`/api/live` merges data from Statbotics and The Blue Alliance, with graceful fallbacks when API credentials are missing.
