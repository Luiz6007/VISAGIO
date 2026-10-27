-- ProvAI backend schema: operational data used by the authenticated application.
-- Apply this migration in Supabase SQL Editor after 0000_migration.sql.

CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  phone text,
  last_visit_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  service text NOT NULL CHECK (char_length(trim(service)) BETWEEN 2 AND 120),
  status text NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Confirmado')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  image_url text,
  face_shape text NOT NULL,
  symmetry numeric(5,2) NOT NULL CHECK (symmetry BETWEEN 0 AND 100),
  recommendations jsonb NOT NULL DEFAULT '{}'::jsonb,
  analysis_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clients_owner_idx ON public.clients(owner_id);
CREATE INDEX IF NOT EXISTS appointments_owner_date_idx ON public.appointments(owner_id, appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS appointments_client_idx ON public.appointments(client_id);
CREATE INDEX IF NOT EXISTS analyses_owner_date_idx ON public.analyses(owner_id, analysis_date DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS establishments_set_updated_at ON public.establishments;
CREATE TRIGGER establishments_set_updated_at BEFORE UPDATE ON public.establishments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS clients_set_updated_at ON public.clients;
CREATE TRIGGER clients_set_updated_at BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS appointments_set_updated_at ON public.appointments;
CREATE TRIGGER appointments_set_updated_at BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients, public.appointments, public.analyses TO authenticated;
GRANT ALL ON public.clients, public.appointments, public.analyses TO service_role;

DROP POLICY IF EXISTS clients_owner ON public.clients;
CREATE POLICY clients_owner ON public.clients FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS appointments_owner ON public.appointments;
CREATE POLICY appointments_owner ON public.appointments FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS analyses_owner ON public.analyses;
CREATE POLICY analyses_owner ON public.analyses FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Prevent an appointment from referencing another owner's client.
CREATE OR REPLACE FUNCTION public.validate_appointment_client_owner()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.clients c WHERE c.id = NEW.client_id AND c.owner_id = NEW.owner_id) THEN
    RAISE EXCEPTION 'client does not belong to appointment owner';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS appointments_validate_client ON public.appointments;
CREATE TRIGGER appointments_validate_client BEFORE INSERT OR UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.validate_appointment_client_owner();
