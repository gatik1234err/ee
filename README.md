# GrapheneLabs

Landing page and storefront for the GrapheneLabs Smart Electrolarynx.

## Tech Stack

- **Frontend:** React 18 + Vite 6 + Tailwind CSS 3 + shadcn/ui
- **Auth:** Firebase Auth (Google + email/password)
- **Backend:** Supabase (orders database)

## Prerequisites

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with Firebase + Supabase credentials (see `authAPI.md`)

## Run Locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Auth Setup

See [`authAPI.md`](./authAPI.md) for full Firebase + Supabase setup instructions.
