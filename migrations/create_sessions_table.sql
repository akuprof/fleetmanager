-- Create sessions table for PostgreSQL session storage
-- This table is used by connect-pg-simple for session management

CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE sessions ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS IDX_sessions_expire ON sessions (expire);

-- Add RLS (Row Level Security) if needed
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON sessions TO postgres;
GRANT ALL ON sessions TO authenticated;
GRANT ALL ON sessions TO anon;
