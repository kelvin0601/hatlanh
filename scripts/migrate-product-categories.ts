import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Thiếu DIRECT_DATABASE_URL hoặc DATABASE_URL.");

  const migrationUrl = new URL("../drizzle/0001_product_categories.sql", import.meta.url);
  const migration = await readFile(migrationUrl, "utf8");
  await neon(databaseUrl).query(migration);
  console.log("Đã tạo bảng product_categories.");
}

void main();
