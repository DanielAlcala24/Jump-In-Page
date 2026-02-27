-- Add updated_at column to birthday_packages table
ALTER TABLE birthday_packages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add updated_at column to birthday_gallery table just in case
ALTER TABLE birthday_gallery ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
