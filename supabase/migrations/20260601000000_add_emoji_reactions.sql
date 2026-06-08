-- Add emoji reaction count columns
ALTER TABLE public.menfess
ADD COLUMN laugh integer DEFAULT 0,
ADD COLUMN love integer DEFAULT 0,
ADD COLUMN sad integer DEFAULT 0,
ADD COLUMN angry integer DEFAULT 0;

-- Update RLS policies to include new columns
ALTER POLICY "Public can read menfess"
ON public.menfess
USING (true);

-- Grant select access to new columns for anon/authenticated
GRANT SELECT (id, message, "from", "to", created_at, laugh, love, sad, angry) ON TABLE public.menfess TO anon;
GRANT SELECT (id, message, "from", "to", created_at, laugh, love, sad, angry) ON TABLE public.menfess TO authenticated;

notify pgrst, 'reload schema';
