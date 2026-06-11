-- BCP Generator database schema
-- Run once via: npm run db:migrate

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS bcps (
  id UUID PRIMARY KEY,
  access_token VARCHAR(48) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL DEFAULT '{}',
  generated_content TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'generating', 'complete')),
  current_step INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_bcps_access_token ON bcps(access_token);
CREATE INDEX IF NOT EXISTS idx_bcps_created_at ON bcps(created_at DESC);
