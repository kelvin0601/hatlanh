import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Thiếu DIRECT_DATABASE_URL hoặc DATABASE_URL.");

  const sql = neon(databaseUrl);
  const source = await readFile(new URL("../drizzle/0004_site_pages.sql", import.meta.url), "utf8");
  for (const statement of source.split(";").map((item) => item.trim()).filter(Boolean)) await sql.query(statement);
  console.log("Đã tạo dữ liệu nội dung cho các trang.");
}

void main();
