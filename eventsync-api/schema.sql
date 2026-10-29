-- =============================================================================
-- EventSync Database Schema (Supabase / PostgreSQL)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Events Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- e.g. 'wedding', 'birthday', 'community', 'conference'
    date TIMESTAMPTZ NOT NULL,
    total_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    sustainability_score INT NOT NULL DEFAULT 85 CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
    guest_count INT DEFAULT 50,
    location VARCHAR(255) DEFAULT 'TBD',
    constraints TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 2. Vendors Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. 'Catering', 'Photography', 'Decor', 'Music', 'Venue'
    estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    actual_cost NUMERIC(12, 2) DEFAULT 0.00,
    is_eco_friendly BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'contracted', 'paid', 'declined')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 3. Budget Allocations Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    allocated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    actual_spent NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- Indexes for High Performance Queries
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_vendors_event_id ON public.vendors(event_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category);
CREATE INDEX IF NOT EXISTS idx_budgets_event_id ON public.budgets(event_id);

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- -----------------------------------------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for application operations (adjust with auth if needed)
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Public delete events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Public read vendors" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Public insert vendors" ON public.vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update vendors" ON public.vendors FOR UPDATE USING (true);
CREATE POLICY "Public delete vendors" ON public.vendors FOR DELETE USING (true);

CREATE POLICY "Public read budgets" ON public.budgets FOR SELECT USING (true);
CREATE POLICY "Public insert budgets" ON public.budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update budgets" ON public.budgets FOR UPDATE USING (true);
CREATE POLICY "Public delete budgets" ON public.budgets FOR DELETE USING (true);

-- -----------------------------------------------------------------------------
-- Sample Seed Data for Demonstration & Testing
-- -----------------------------------------------------------------------------
INSERT INTO public.events (id, title, event_type, date, total_budget, sustainability_score, guest_count, location, constraints)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Eco-Chic Garden Wedding', 'wedding', now() + interval '30 days', 18500.00, 92, 120, 'Botanical Solarium', 'Zero-single-use plastics, local seasonal flora'),
    ('00000000-0000-0000-0000-000000000002', 'Neon Solar 30th Birthday', 'birthday', now() + interval '14 days', 4500.00, 88, 45, 'Solaris Rooftop Garden', 'Plant-based catering, energy-efficient lighting'),
    ('00000000-0000-0000-0000-000000000003', 'GreenTech Community Fair', 'community', now() + interval '45 days', 8000.00, 96, 350, 'Civic Central Park', 'Composting stations, solar mobile audio setup')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.vendors (event_id, name, category, estimated_cost, actual_cost, is_eco_friendly, status, notes)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Harvest Table Farm-to-Fork', 'Catering', 6200.00, 6100.00, true, 'contracted', '100% locally sourced organic menu'),
    ('00000000-0000-0000-0000-000000000001', 'Botanica Native Blooms', 'Decor', 2800.00, 2750.00, true, 'contracted', 'Potted live plants & seed paper stationery'),
    ('00000000-0000-0000-0000-000000000001', 'SolarPulse Acoustic Collective', 'Music', 1800.00, 1800.00, true, 'paid', 'Battery storage charged via solar rig'),
    ('00000000-0000-0000-0000-000000000001', 'Lumina Documentary Lens', 'Photography', 2400.00, 0.00, true, 'contacted', 'Digital-only zero carbon footprint kit')
ON CONFLICT DO NOTHING;

INSERT INTO public.budgets (event_id, category, allocated_amount, actual_spent)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Catering', 6500.00, 6100.00),
    ('00000000-0000-0000-0000-000000000001', 'Decor', 3000.00, 2750.00),
    ('00000000-0000-0000-0000-000000000001', 'Music', 2000.00, 1800.00),
    ('00000000-0000-0000-0000-000000000001', 'Photography', 2500.00, 0.00),
    ('00000000-0000-0000-0000-000000000001', 'Venue & Permits', 4500.00, 4500.00)
ON CONFLICT DO NOTHING;
