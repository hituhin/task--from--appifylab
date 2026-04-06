# BuddyScript — Social Feed Application

A full-stack social media feed application built with Next.js, Prisma, and PostgreSQL. Converted from three static HTML/CSS pages (Login, Register, Feed) into a fully functional web application with real authentication, database persistence, and interactive features.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19 |
| Styling | Original CSS preserved + Tailwind CSS v4 |
| Backend | Next.js API Routes |
| Auth | NextAuth.js v4 — JWT + Credentials |
| Database | PostgreSQL + Prisma ORM v5 |
| Validation | Zod v4 |
| Deployment | Vercel / Netlify |

## Features

### Authentication
- Register with first name, last name, email, and password
- Passwords hashed with bcrypt (cost factor 12)
- JWT session — feed page protected, unauthenticated users redirected to `/login`

### Feed
- Create posts with text and optional image upload
- Public posts visible to all users; Private posts visible only to the author
- Posts ordered newest first with **cursor-based pagination** (scales to millions of records)
- **Emoji reactions** on posts — click Reaction button to open picker (Like, Love, Haha, Wow, Sad, Angry)
- Comments with nested replies
- Like / unlike on posts, comments, and replies
- View who liked — modal shows all users who reacted
- Delete own posts, comments, and replies
- Dark mode toggle

### Security & Performance
- All API routes require valid session (401 if unauthenticated)
- User input sanitized (HTML stripped) before DB write
- Rate limiting on all create endpoints
- Zod schema validation on all API inputs
- Prisma parameterized queries — no SQL injection risk
- DB indexes on `createdAt DESC`, `authorId`, `postId`, `visibility + createdAt`

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/buddyscript"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a strong secret:
```bash
openssl rand -base64 32
```

### 3. Push schema to database
```bash
npx prisma db push
npx prisma generate
```

### 4. Seed with demo data
```bash
npm run seed
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test Accounts

After seeding, use any of these accounts (password: `password123`):

| Email | Name |
|---|---|
| steve@example.com | Steve Jobs |
| ryan@example.com | Ryan Roslansky |
| karim@example.com | Karim Saif |
| emma@example.com | Emma Wilson |


## Deployment

### Vercel (recommended)
1. Push repository to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
4. Deploy — zero additional config needed

### Netlify
1. Push repository to GitHub
2. Import in Netlify — `netlify.toml` is already configured
3. Add the same three environment variables
4. Deploy

## Key Technical Decisions

- **Cursor-based pagination** — offset pagination degrades at scale; cursor approach stays O(log n) with the index regardless of dataset size
- **`proxy.ts` not `middleware.ts`** — Next.js 16 changed the middleware export name
- **CSS Modules with `composes: from global`** — preserves all original `_` prefixed class names without touching the provided CSS files
- **Base64 image upload** — no external storage service required for the demo; easily swapped for S3/Cloudinary in production by changing the API handler
- **Zod v4** — uses `.issues` (breaking change from v3's `.errors`)
- **`reactionType` on PostLike** — single record per user per post, updated in-place when switching reactions, toggled off when same reaction clicked again
