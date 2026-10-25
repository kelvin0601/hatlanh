CREATE TABLE IF NOT EXISTS "product_ingredients" (
  "name" varchar(100) PRIMARY KEY NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

INSERT INTO "product_ingredients" ("name")
SELECT DISTINCT trim("ingredient")
FROM "products"
CROSS JOIN LATERAL unnest("ingredients") AS "ingredient"
WHERE trim("ingredient") <> ''
ON CONFLICT ("name") DO NOTHING;
