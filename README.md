# Buddy Script

A social media platform built with Next.js 14 App Router, NextAuth.js, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Auth:** NextAuth.js v4 with JWT + Credentials provider
- **ORM:** Prisma v5 + PostgreSQL (Neon-compatible)
- **Validation:** Zod
- **Styling:** Original CSS (Bootstrap + custom) + Tailwind CSS utilities
- **Deployment:** Vercel and Netlify compatible

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd buddy-script
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXTAUTH_SECRET="generate-a-strong-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

For `NEXTAUTH_SECRET`, generate a random value:
```bash
openssl rand -base64 32
```

### 3. Set up the database

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

Or for production:

```bash
npx prisma migrate deploy
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
4. Deploy

### Netlify

1. Push to GitHub
2. Import the repository in Netlify
3. Build settings are configured in `netlify.toml`
4. Add environment variables in Netlify dashboard
5. Deploy

## Project Structure

```
buddy-script/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Auth layout (loads CSS files)
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts   # NextAuth handler
│   │       └── register/route.ts       # Registration API
│   ├── feed/page.tsx           # Feed page (protected)
│   ├── layout.tsx              # Root layout with SessionProvider
│   └── page.tsx                # Root redirect to /login
├── components/
│   └── providers/
│       └── SessionProvider.tsx # Client-side session provider
├── lib/
│   ├── auth.ts                 # NextAuth options
│   ├── prisma.ts               # Prisma client singleton
│   └── validators.ts           # Zod schemas
├── prisma/
│   └── schema.prisma           # Database schema
├── public/
│   └── assets/                 # CSS, images, fonts, JS
├── types/
│   └── next-auth.d.ts          # NextAuth type extensions
├── middleware.ts               # Route protection middleware
└── netlify.toml                # Netlify deployment config
```

## Features (Phase 1 and Phase 2)

- User registration with first name, last name, email, and password
- Secure password hashing with bcryptjs (cost factor 12)
- JWT-based authentication with NextAuth.js
- Protected routes (feed requires authentication via middleware)
- Pixel-perfect replication of the original HTML/CSS design
- Inline form validation with error messages
- Loading states on submit buttons
- Redirect to login after registration with success message
- Redirect to feed after successful login
# task--from--appifylab
