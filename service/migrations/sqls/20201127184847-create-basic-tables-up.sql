BEGIN;

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE IF NOT EXISTS user_account (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role user_role NOT NULL,
  is_verified BOOL NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS verification_token (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  FOREIGN KEY (user_id)
  REFERENCES user_account(id)
  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feature (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,

  FOREIGN KEY (user_id)
  REFERENCES user_account(id)
  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flag (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  enabled BOOL NOT NULL DEFAULT FALSE,
  predicates JSONB NOT NULL DEFAULT '[]'::jsonb,

  FOREIGN KEY (feature_id)
  REFERENCES feature(id)
  ON DELETE CASCADE
);

COMMIT;