-- Create leads table for promotions
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  birthday_month TEXT NOT NULL,
  branch_id UUID REFERENCES public.branches(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public to insert leads (for the form)
CREATE POLICY "Allow public insert leads" ON public.leads
FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to view/delete leads
CREATE POLICY "Allow authenticated view leads" ON public.leads
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated manage leads" ON public.leads
FOR ALL TO authenticated USING (true);
