# BCP Generator

AI-powered Business Continuity Plan generator for UK small and medium businesses.

Live at: **https://bcp.govassure.uk**

## Features

- 9-step guided wizard covering all areas of business continuity
- AI narrative generation via Claude (Anthropic)
- Vercel Postgres storage — save and return via unique link, no account needed
- Word document (.docx) download
- Aligned to UK Cabinet Office BCP Toolkit, NCSC and BSI BS 65000

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Anthropic Claude API](https://anthropic.com)
- [docx](https://docx.js.org/) for Word generation
- Tailwind CSS

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/jontever/bcp-generator
cd bcp-generator
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in:
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)
- `POSTGRES_*` — from your Vercel Postgres database (see step 3)

### 3. Create Vercel Postgres database

```bash
npx vercel link        # link to your Vercel project
npx vercel env pull    # pulls POSTGRES_* vars into .env.local
npm run db:migrate     # creates the bcps table
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com/new)
3. Add a Vercel Postgres database in the Storage tab
4. Add `ANTHROPIC_API_KEY` in Project Settings → Environment Variables
5. Set your custom domain to `bcp.govassure.uk` in Domains settings
6. Run the DB migration: `npm run db:migrate` (using Vercel env vars)

## Custom domain

In Vercel → your project → Domains, add `bcp.govassure.uk` and follow the DNS instructions.

## License

MIT — free to use, modify and deploy.
