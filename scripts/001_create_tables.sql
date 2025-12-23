-- Checkpoint 5: Unified Persistence Tables
-- Run this script to create the database schema

-- 1) object_types table
CREATE TABLE IF NOT EXISTS object_types (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT
);

-- 2) object_definitions table
CREATE TABLE IF NOT EXISTS object_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  object_key TEXT NOT NULL,
  label TEXT NOT NULL,
  label_plural TEXT NOT NULL,
  object_type_key TEXT NOT NULL REFERENCES object_types(key),
  enabled BOOLEAN DEFAULT true,
  properties_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, object_key)
);

-- 3) records table (unified)
CREATE TABLE IF NOT EXISTS records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  object_key TEXT NOT NULL,
  title TEXT,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for records
CREATE INDEX IF NOT EXISTS idx_records_user_object_updated 
  ON records(user_id, object_key, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_records_properties 
  ON records USING GIN(properties);

-- 4) relationship_definitions table
CREATE TABLE IF NOT EXISTS relationship_definitions (
  key TEXT PRIMARY KEY,
  from_object_key TEXT NOT NULL,
  to_object_key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT
);

-- 5) relationships table
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  relationship_key TEXT NOT NULL REFERENCES relationship_definitions(key),
  from_record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  to_record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for relationships
CREATE INDEX IF NOT EXISTS idx_relationships_user_from 
  ON relationships(user_id, from_record_id);
CREATE INDEX IF NOT EXISTS idx_relationships_user_to 
  ON relationships(user_id, to_record_id);
