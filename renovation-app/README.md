# RenovatePro - House Renovation Planner

A collaborative renovation planning app with shared password access.

## Setup Instructions

### 1. Create a Supabase Project (Free)

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click **New Project**
3. Choose a name and password, then click **Create new project**
4. Wait ~2 minutes for it to set up

### 2. Create the Database Table

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste this SQL and click **Run**:

```sql
CREATE TABLE renovation_projects (
  id SERIAL PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL,
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public access (since we're using password as project ID)
ALTER TABLE renovation_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON renovation_projects
  FOR ALL USING (true) WITH CHECK (true);
```

### 3. Get Your API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

### 4. Add to Vercel

1. Go to your project on [vercel.com](https://vercel.com)
2. Go to **Settings** → **Environment Variables**
3. Add these two variables:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
4. Click **Save**
5. Go to **Deployments** and click **Redeploy** on the latest deployment

### 5. Done!

Now you and anyone with the shared password can:
- Access the same project data
- See each other's changes in real-time (after refresh)
- Collaborate on renovation planning

## Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

## How the Password Works

- The password you enter becomes the project identifier
- Anyone who enters the same password sees the same data
- Different passwords = different projects
- No account needed, just share the password with your collaborator
