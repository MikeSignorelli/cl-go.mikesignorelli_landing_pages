-- Adds the livemode column to an already-deployed orders table (the
-- original migration.sql in this directory already has it for fresh runs).
-- Run against project gprrntuvxyzyjbwgqwce.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS livemode boolean;
