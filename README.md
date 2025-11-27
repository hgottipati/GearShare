# GearShare - Private Marketplace

A private web app for trading, buying, or selling gear and equipment.

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `supabase/schema.sql`
3. Go to Storage and create a bucket named `listing-images` with public access
4. Copy your project URL and anon key from Settings > API

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Initial Admin Setup

After creating your first user account, you'll need to manually set yourself as admin in Supabase:

1. Go to Supabase Dashboard > Table Editor > profiles
2. Find your user record
3. Set `is_admin` to `true` and `is_approved` to `true`

## Features

- **Private Access**: Email-based authentication with admin approval
- **Marketplace**: Create and browse listings with photos
- **Trading**: Support for trade-only listings and trade requests
- **Messaging**: In-app messaging between buyers and sellers
- **Admin Panel**: Approve users, manage listings, and post announcements

## Deployment

### Deploy to Vercel

The easiest way to deploy GearShare is using [Vercel](https://vercel.com):

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (optional, for email notifications)
4. Deploy!

See [docs/VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)

