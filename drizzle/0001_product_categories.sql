CREATE TABLE IF NOT EXISTS "product_categories" (
  "value" varchar(40) PRIMARY KEY NOT NULL,
  "label" varchar(100) NOT NULL,
  "description" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "product_categories_label_unique" UNIQUE("label")
);
