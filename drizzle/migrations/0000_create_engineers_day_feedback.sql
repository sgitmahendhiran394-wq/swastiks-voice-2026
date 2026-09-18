-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_year INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Admin allowlist (never readable by clients; only via security definer fn)
CREATE TABLE public.admin_allowlist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_allowlist TO service_role;
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_allowlist
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  employee_id TEXT,
  employee_name TEXT NOT NULL,
  employee_email TEXT NOT NULL,
  department TEXT,
  q1 SMALLINT NOT NULL CHECK (q1 BETWEEN 1 AND 5),
  q2 SMALLINT NOT NULL CHECK (q2 BETWEEN 1 AND 5),
  q3 SMALLINT NOT NULL CHECK (q3 BETWEEN 1 AND 5),
  q4 SMALLINT NOT NULL CHECK (q4 BETWEEN 1 AND 5),
  q5 SMALLINT NOT NULL CHECK (q5 BETWEEN 1 AND 5),
  q6 SMALLINT NOT NULL CHECK (q6 BETWEEN 1 AND 5),
  q7 SMALLINT NOT NULL CHECK (q7 BETWEEN 1 AND 5),
  q8 SMALLINT NOT NULL CHECK (q8 BETWEEN 1 AND 5),
  q9 TEXT NOT NULL CHECK (char_length(q9) <= 500),
  q10 TEXT NOT NULL CHECK (char_length(q10) <= 500),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_email, event_id),
  UNIQUE (user_id, event_id)
);
GRANT SELECT, INSERT ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated can view active events"
  ON public.events FOR SELECT TO authenticated
  USING (active = true);

CREATE POLICY "Employees insert own feedback"
  ON public.feedback FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND lower(employee_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

CREATE POLICY "Employees view own feedback, admins view all"
  ON public.feedback FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE INDEX feedback_event_submitted_idx ON public.feedback (event_id, submitted_at DESC);

-- Realtime for live admin feed
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;

-- Seed
INSERT INTO public.events (event_name, event_year, active)
VALUES ('Engineers'' Day 2026', 2026, true);

INSERT INTO public.admin_allowlist (email) VALUES ('sgitmahendhiran394@gmail.com');