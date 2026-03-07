-- 1. TABELA USŁUG (Services)
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  content JSONB, -- Struktura blokowa dla elastyczności
  image_url TEXT,
  icon_name TEXT, -- Nazwa ikony z biblioteki Lucide
  seo_title TEXT,
  seo_description TEXT,
  is_published BOOLEAN DEFAULT false
);

-- 2. TABELA BLOGA (Blog Posts)
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content JSONB,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  seo_title TEXT,
  seo_description TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT false
);

-- 3. TABELA FAQ
CREATE TABLE public.faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE, -- Powiązanie z konkretną usługą
  is_published BOOLEAN DEFAULT true
);

-- 4. TABELA OPINII (Testimonials)
CREATE TABLE public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  author_name TEXT NOT NULL,
  author_role TEXT, -- np. "Właściciel firmy X"
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT false
);

-- Włączenie RLS (Row Level Security)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Polityka: Każdy może czytać opublikowane treści
CREATE POLICY "Allow public read-only" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read-only" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read-only" ON public.faq FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read-only" ON public.testimonials FOR SELECT USING (true);