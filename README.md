# Abraco Energies

Premium renewable-energy marketing site + admin panel. Next.js 16 (App Router),
TypeScript, Tailwind v4, shadcn/ui, MongoDB (Mongoose).

## Features

**Public site** (`/`) — dark, premium, single-page:
- Hero with background **video + ambient audio** (sound toggle; muted autoplay,
  audio starts on user interaction per browser policy). Falls back to an animated
  gradient when no video is set.
- Lead capture form → saved to MongoDB.
- "Our renewable energy solutions" cards (editable in admin).
- Why-choose section, contact footer.

**Admin panel** (`/admin`) — password-gated:
- Dashboard with lead stats.
- Submissions: filter by status, mark new/contacted/closed, delete, export CSV.
- Solutions: full CRUD, publish/hide, reorder, live on the homepage.
- Settings: edit hero copy, video/audio URLs, and contact details.

## Setup

1. Copy env and fill in values:
   ```bash
   cp .env.example .env.local
   ```
   - `MONGODB_URI` — your MongoDB Atlas connection string.
   - `ADMIN_PASSWORD` — the admin login password.
   - `ADMIN_SESSION_TOKEN` — any long random string (session cookie value).

2. Install and seed:
   ```bash
   npm install
   npm run seed     # inserts the 5 default solutions + default settings
   ```

3. Run:
   ```bash
   npm run dev      # http://localhost:3000
   ```

## Media

Put `hero.mp4` and `ambient.mp3` in `public/media/`, or paste any URL in
**Admin → Settings**. Missing video → animated gradient fallback.

## Auth

Simple env-password auth: `POST /api/auth/login` checks `ADMIN_PASSWORD`, sets an
httpOnly cookie holding `ADMIN_SESSION_TOKEN`. Middleware guards `/admin/*`.
To harden later, swap in NextAuth or a hashed multi-user store.

## Notes

- Next 16 flags the `middleware` convention as deprecated in favor of `proxy`;
  it still works. Rename `src/middleware.ts` → `src/proxy.ts` when convenient.
