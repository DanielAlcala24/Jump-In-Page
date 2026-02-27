-- Create table for birthday celebration gallery
CREATE TABLE IF NOT EXISTS public.birthday_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.birthday_gallery ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to select (public read)
CREATE POLICY "Allow public read on birthday_gallery" ON public.birthday_gallery
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to perform all actions
CREATE POLICY "Allow all actions for authenticated users on birthday_gallery" ON public.birthday_gallery
    FOR ALL USING (auth.role() = 'authenticated');
