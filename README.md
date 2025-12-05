# Order of Worship by Dan&Dav

A Progressive Web App (PWA) for church worship, schedules, and notifications.

## Features

- **Ongoing Worship**: Live stream integration and today's order of worship.
- **Reader**: Bible passages and hymns in English and Telugu with adjustable font settings.
- **Schedule**: Weekly calendar with history and upcoming events.
- **Notifications**: Church announcements.
- **Admin Panel**: Manage content, schedules, and live stream config.
- **PWA**: Installable on mobile, offline support.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (SQLite)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open App**:
   - User View: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Admin Credentials

- **Email**: `admin@example.com`
- **Password**: `password`

## PWA Testing

- Open in Chrome.
- Open DevTools -> Application -> Service Workers to see registration.
- "Add to Home Screen" to install.

## Fonts

Includes:
- English: Inter, Playfair Display
- Telugu: Noto Sans Telugu, Noto Serif Telugu, Sree Krushnadevaraya
