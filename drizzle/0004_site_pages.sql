CREATE TABLE IF NOT EXISTS "site_pages" (
  "key" varchar(40) PRIMARY KEY NOT NULL,
  "content" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

INSERT INTO "site_pages" ("key", "content") VALUES
  ('home', '{}'::jsonb),
  ('story', '{}'::jsonb),
  ('farm', '{}'::jsonb),
  ('contact', '{}'::jsonb)
ON CONFLICT ("key") DO NOTHING;
