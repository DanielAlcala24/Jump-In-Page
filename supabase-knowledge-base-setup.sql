-- Create knowledge_base table (preguntas y respuestas internas)
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow public to read (por si se consume en el sitio)
CREATE POLICY "Allow public read knowledge_base" ON public.knowledge_base
FOR SELECT USING (true);

-- Allow authenticated users (admin) to manage entries
CREATE POLICY "Allow authenticated manage knowledge_base" ON public.knowledge_base
FOR ALL TO authenticated USING (true) WITH CHECK (true);
