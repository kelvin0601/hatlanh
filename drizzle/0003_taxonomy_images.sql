ALTER TABLE "product_categories" ADD COLUMN IF NOT EXISTS "image" varchar(300);
ALTER TABLE "product_categories" ADD COLUMN IF NOT EXISTS "image_alt" varchar(200);
ALTER TABLE "product_ingredients" ADD COLUMN IF NOT EXISTS "image" varchar(300);
ALTER TABLE "product_ingredients" ADD COLUMN IF NOT EXISTS "image_alt" varchar(200);

INSERT INTO "product_categories" ("value", "label", "description", "image", "image_alt") VALUES
  ('bua-sang-hang-ngay', 'Bữa sáng hằng ngày', 'Ngũ cốc nguyên hạt mộc mạc, dễ ăn — khởi đầu ngày mới nhẹ nhàng và đủ đầy cho cả gia đình.', '/images/04_products/product-traditional-hd.jpg', 'Ngũ cốc dành cho bữa sáng hằng ngày'),
  ('nang-luong-van-dong', 'Năng lượng & vận động', 'Kết hợp yến mạch cùng các loại hạt giàu đạm và chất béo tốt — tiếp sức cho ngày dài năng động.', '/images/04_products/product-energy-hd.jpg', 'Ngũ cốc cung cấp năng lượng cho vận động'),
  ('dinh-duong-can-bang', 'Dinh dưỡng cân bằng', 'Công thức hài hòa từ quinoa, hạt kê, hạt lanh và đậu — bổ sung dưỡng chất toàn diện mỗi ngày.', '/images/04_products/product-nutrition-hd.jpg', 'Ngũ cốc dinh dưỡng cân bằng')
ON CONFLICT ("value") DO NOTHING;

UPDATE "product_categories" SET "image" = '/images/04_products/product-traditional-hd.jpg', "image_alt" = 'Ngũ cốc dành cho bữa sáng hằng ngày' WHERE "value" = 'bua-sang-hang-ngay' AND "image" IS NULL;
UPDATE "product_categories" SET "image" = '/images/04_products/product-energy-hd.jpg', "image_alt" = 'Ngũ cốc cung cấp năng lượng cho vận động' WHERE "value" = 'nang-luong-van-dong' AND "image" IS NULL;
UPDATE "product_categories" SET "image" = '/images/04_products/product-nutrition-hd.jpg', "image_alt" = 'Ngũ cốc dinh dưỡng cân bằng' WHERE "value" = 'dinh-duong-can-bang' AND "image" IS NULL;

UPDATE "product_ingredients" SET "image" = '/images/02_ingredients/oats.jpg', "image_alt" = 'Yến mạch tự nhiên' WHERE "name" = 'Yến mạch' AND "image" IS NULL;
UPDATE "product_ingredients" SET "image" = '/images/02_ingredients/red-beans.jpg', "image_alt" = 'Đậu đỏ tự nhiên' WHERE "name" = 'Đậu đỏ' AND "image" IS NULL;
UPDATE "product_ingredients" SET "image" = '/images/02_ingredients/chia.jpg', "image_alt" = 'Hạt chia tự nhiên' WHERE "name" = 'Hạt chia' AND "image" IS NULL;
UPDATE "product_ingredients" SET "image" = '/images/02_ingredients/almonds.jpg', "image_alt" = 'Hạnh nhân tự nhiên' WHERE "name" = 'Hạnh nhân' AND "image" IS NULL;
UPDATE "product_ingredients" SET "image" = '/images/02_ingredients/walnuts.jpg', "image_alt" = 'Óc chó tự nhiên' WHERE "name" = 'Óc chó' AND "image" IS NULL;
UPDATE "product_ingredients" SET "image" = '/images/02_ingredients/pumpkin-seeds.jpg', "image_alt" = 'Hạt bí tự nhiên' WHERE "name" = 'Hạt bí' AND "image" IS NULL;
