-- Add page_path column to leads table to track where the lead came from
ALTER TABLE public.leads ADD COLUMN page_path text;