CREATE TYPE public.app_role AS ENUM ('admin', 'client');
CREATE TYPE public.inquiry_status AS ENUM ('new', 'reviewing', 'qualified', 'closed');
CREATE TYPE public.project_status AS ENUM ('planned', 'active', 'paused', 'completed');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'void');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  job_title text NOT NULL DEFAULT '',
  avatar_url text,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'client',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin')) WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN INSERT INTO public.profiles (id, display_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', '')); INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client'); RETURN NEW; END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  company text NOT NULL DEFAULT '' CHECK (char_length(company) <= 120),
  service text NOT NULL CHECK (char_length(service) <= 80),
  budget text NOT NULL DEFAULT '' CHECK (char_length(budget) <= 80),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  status public.inquiry_status NOT NULL DEFAULT 'new',
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_submit_inquiries" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'new' AND assigned_to IS NULL);
CREATE POLICY "admins_manage_inquiries" ON public.inquiries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  company_name text NOT NULL DEFAULT '',
  primary_contact text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_self_read" ON public.clients FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins_manage_clients" ON public.clients FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  summary text NOT NULL DEFAULT '',
  service text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT 'Discovery',
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status public.project_status NOT NULL DEFAULT 'planned',
  start_date date,
  target_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project_access" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.user_id = auth.uid()));
CREATE POLICY "admins_manage_projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL, due_date date, completed boolean NOT NULL DEFAULT false, position integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.milestones TO authenticated; GRANT ALL ON public.milestones TO service_role; ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestone_access" ON public.milestones FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.clients c ON c.id=p.client_id WHERE p.id=project_id AND (c.user_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "admins_manage_milestones" ON public.milestones FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL, description text NOT NULL DEFAULT '', file_path text, version text NOT NULL DEFAULT '1.0', status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deliverables TO authenticated; GRANT ALL ON public.deliverables TO service_role; ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deliverable_access" ON public.deliverables FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.clients c ON c.id=p.client_id WHERE p.id=project_id AND (c.user_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "admins_manage_deliverables" ON public.deliverables FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER deliverables_updated_at BEFORE UPDATE ON public.deliverables FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  subject text NOT NULL, description text NOT NULL, priority text NOT NULL DEFAULT 'normal', status public.ticket_status NOT NULL DEFAULT 'open', created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tickets TO authenticated; GRANT ALL ON public.tickets TO service_role; ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket_access" ON public.tickets FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.clients c WHERE c.id=client_id AND c.user_id=auth.uid()));
CREATE POLICY "clients_create_tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK (created_by=auth.uid() AND EXISTS (SELECT 1 FROM public.clients c WHERE c.id=client_id AND c.user_id=auth.uid()) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins_manage_tickets" ON public.tickets FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE, author_id uuid NOT NULL, body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000), created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_messages TO authenticated; GRANT ALL ON public.ticket_messages TO service_role; ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "message_access" ON public.ticket_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.tickets t JOIN public.clients c ON c.id=t.client_id WHERE t.id=ticket_id AND (c.user_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "message_create" ON public.ticket_messages FOR INSERT TO authenticated WITH CHECK (author_id=auth.uid() AND EXISTS (SELECT 1 FROM public.tickets t JOIN public.clients c ON c.id=t.client_id WHERE t.id=ticket_id AND (c.user_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  invoice_number text NOT NULL UNIQUE, amount_cents integer NOT NULL CHECK (amount_cents >= 0), currency text NOT NULL DEFAULT 'USD', status public.invoice_status NOT NULL DEFAULT 'draft', due_date date, file_path text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated; GRANT ALL ON public.invoices TO service_role; ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoice_access" ON public.invoices FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.clients c WHERE c.id=client_id AND c.user_id=auth.uid()));
CREATE POLICY "admins_manage_invoices" ON public.invoices FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX projects_client_id_idx ON public.projects(client_id);
CREATE INDEX milestones_project_id_idx ON public.milestones(project_id);
CREATE INDEX deliverables_project_id_idx ON public.deliverables(project_id);
CREATE INDEX tickets_client_id_idx ON public.tickets(client_id);
CREATE INDEX ticket_messages_ticket_id_idx ON public.ticket_messages(ticket_id);
CREATE INDEX invoices_client_id_idx ON public.invoices(client_id);