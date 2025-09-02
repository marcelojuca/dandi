# Supabase Integration Setup

This guide will help you connect your API Key Manager application to a Supabase database.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created

## Step 1: Create Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### How to get these values:

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Click "Run" to execute the SQL

This will create:
- `api_keys` table with all necessary columns
- Indexes for better performance
- Row Level Security (RLS) policies
- Sample data

## Step 3: Verify Installation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. You should see the API Key Manager with sample data from Supabase

## Step 4: Test CRUD Operations

Test the following operations to ensure everything is working:

1. **Create**: Click the "+" button to create a new API key
2. **Read**: View existing API keys in the table
3. **Update**: Click the edit icon to modify an API key
4. **Delete**: Click the delete icon to remove an API key
5. **View**: Click the eye icon to view API key details
6. **Copy**: Click the clipboard icon to copy API keys

## Database Schema

The `api_keys` table has the following structure:

```sql
CREATE TABLE api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  key VARCHAR(255) NOT NULL UNIQUE,
  permissions TEXT[] DEFAULT '{}',
  key_type VARCHAR(50) DEFAULT 'development',
  limit_usage BOOLEAN DEFAULT false,
  monthly_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);
```

## Security Features

- **Row Level Security (RLS)**: Enabled on the `api_keys` table
- **Service Role**: Used for server-side operations (bypasses RLS)
- **Anon Key**: Used for client-side operations (respects RLS)
- **Unique Constraints**: API keys are unique across the table

## Troubleshooting

### Common Issues:

1. **Environment variables not loading**:
   - Make sure `.env.local` is in the project root
   - Restart your development server after adding environment variables

2. **Database connection errors**:
   - Verify your Supabase URL and keys are correct
   - Check that your Supabase project is active

3. **Permission errors**:
   - Ensure RLS policies are set up correctly
   - Verify you're using the correct keys for client vs server operations

4. **Schema errors**:
   - Make sure you've run the `supabase-schema.sql` file
   - Check that all tables and indexes were created successfully

### Getting Help:

- Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the console logs for detailed error messages
- Ensure all environment variables are properly set

## Next Steps

Once everything is working:

1. Consider implementing user authentication
2. Add more sophisticated RLS policies
3. Implement API key usage tracking
4. Add rate limiting and monitoring
5. Set up database backups and monitoring
