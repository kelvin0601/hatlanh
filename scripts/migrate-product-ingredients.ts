import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Thiếu DIRECT_DATABASE_URL hoặc DATABASE_URL.");

  const migrationUrl = new URL("../drizzle/0002_product_ingredients.sql", import.meta.url);
  const migration = await readFile(migrationUrl, "utf8");
  const sql = neon(databaseUrl);
  for (const statement of migration.split(";").map((value) => value.trim()).filter(Boolean)) {
    await sql.query(statement);
  }
  console.log("Đã tạo bảng product_ingredients và nhập các nguyên liệu hiện có.");
}

void main();
