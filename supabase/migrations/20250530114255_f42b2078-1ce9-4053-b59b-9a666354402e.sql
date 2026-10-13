
-- Add new columns to the leads table for the invoice count and booking preferences
ALTER TABLE public.leads
ADD COLUMN facturas_compra_mes integer,
ADD COLUMN requires_calendly boolean DEFAULT false;
