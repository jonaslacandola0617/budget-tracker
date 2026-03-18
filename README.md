# 💰 Ledger — Budget & Expense Tracker

A full-stack budget and expense tracking app built with **Next.js 14**, **Prisma 7**, **PostgreSQL**, deployed on **Vercel**.

## Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling  | Tailwind CSS                                  |
| Charts   | Recharts                                      |
| Backend  | Next.js API Routes                            |
| ORM      | Prisma 7 (pg driver adapter)                  |
| Database | PostgreSQL (Prisma Postgres / Vercel Postgres) |
| Deploy   | Vercel                                        |

## Prisma 7 Key Changes vs v5/v6

1. **`prisma.config.ts`** — Database URL now lives here, NOT in `schema.prisma`
2. **`schema.prisma`** — datasource block has NO `url` field anymore
3. **Driver adapter** — `@prisma/adapter-pg` required for PrismaClient
4. **Generated client** — outputs to `src/generated/prisma/`

## Quick Setup

### 1. Install
```bash
npm install
```

### 2. Create `.env.local`
```bash
cp .env.example .env.local
# Add your DATABASE_URL (single URL — no DIRECT_URL needed in Prisma 7)
```

### 3. Push schema
```bash
npm run db:push
```

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
vercel
# Add DATABASE_URL in Vercel → Settings → Environment Variables
```

## DB Commands

```bash
npm run db:push       # sync schema (dev)
npm run db:migrate    # deploy migrations (prod)
npm run db:generate   # regenerate Prisma client
npm run db:studio     # open Prisma Studio
```

## Environment Variables

| Variable       | Description                   |
|----------------|-------------------------------|
| `DATABASE_URL` | PostgreSQL connection string  |
