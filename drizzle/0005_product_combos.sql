DO $$ BEGIN
  CREATE TYPE "product_type" AS ENUM ('single', 'combo');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "product_type" "product_type" DEFAULT 'single' NOT NULL;

CREATE TABLE IF NOT EXISTS "product_combo_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "combo_product_id" integer NOT NULL,
  "product_id" integer NOT NULL,
  "quantity" integer DEFAULT 1 NOT NULL,
  CONSTRAINT "product_combo_items_combo_product_fk"
    FOREIGN KEY ("combo_product_id") REFERENCES "products"("id") ON DELETE CASCADE,
  CONSTRAINT "product_combo_items_product_fk"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_combo_items_combo_product_unique"
  ON "product_combo_items" ("combo_product_id", "product_id");

ALTER TABLE "product_combo_items"
  DROP CONSTRAINT IF EXISTS "product_combo_items_quantity_check";

ALTER TABLE "product_combo_items"
  ADD CONSTRAINT "product_combo_items_quantity_check"
  CHECK ("quantity" BETWEEN 1 AND 20);

ALTER TABLE "product_combo_items"
  DROP CONSTRAINT IF EXISTS "product_combo_items_distinct_products_check";

ALTER TABLE "product_combo_items"
  ADD CONSTRAINT "product_combo_items_distinct_products_check"
  CHECK ("combo_product_id" <> "product_id");
