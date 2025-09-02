-- Create API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  key VARCHAR(255) NOT NULL UNIQUE,
  permissions TEXT[] DEFAULT '{}',
  key_type VARCHAR(50) DEFAULT 'development' CHECK (key_type IN ('development', 'production')),
  limit_usage BOOLEAN DEFAULT false,
  monthly_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- Create an index on the key column for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You can modify this based on your authentication requirements
CREATE POLICY "Allow all operations for authenticated users" ON api_keys
  FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_api_keys_updated_at 
  BEFORE UPDATE ON api_keys 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO api_keys (name, description, key, permissions, key_type, limit_usage, monthly_limit) VALUES
  ('Development Key', 'API key for development environment', 'dev_sk_1234567890abcdef', ARRAY['create', 'read', 'edit'], 'development', false, 1000),
  ('Production Key', 'API key for production environment', 'prod_sk_abcdef1234567890', ARRAY['read'], 'production', true, 5000)
ON CONFLICT (key) DO NOTHING;
