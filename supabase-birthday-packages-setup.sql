-- Create birthday_packages table
CREATE TABLE IF NOT EXISTS birthday_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up RLS (Row Level Security)
ALTER TABLE birthday_packages ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read the packages
CREATE POLICY "Allow public read access" ON birthday_packages
    FOR SELECT USING (true);

-- Policy to allow authenticated users (admins) to manage the packages
CREATE POLICY "Allow authenticated users to manage packages" ON birthday_packages
    FOR ALL USING (auth.role() = 'authenticated');
