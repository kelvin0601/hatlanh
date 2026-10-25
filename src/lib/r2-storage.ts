import "server-only";

import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 2560;
const MAX_IMAGE_PIXELS = 40_000_000;

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];
type MediaFolder = "products" | "articles" | "categories" | "ingredients" | "pages";

export interface OptimizedImage {
  bytes: Uint8Array;
  contentType: "image/webp";
  width: number;
  height: number;
  originalSize: number;
}

const EXTENSIONS: Record<SupportedImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: URL;
  prefix: string;
}

let cachedClient: S3Client | undefined;
let cachedConfig: R2Config | undefined;

function normalizePrefix(value: string | undefined) {
  return (value ?? "images").trim().replace(/^\/+|\/+$/g, "") || "images";
}

function readConfig(): R2Config {
  if (cachedConfig) return cachedConfig;

  const accountId = process.env.R2_ACCOUNT_ID?.trim() ?? "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() ?? "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() ?? "";
  const bucket = process.env.R2_BUCKET_NAME?.trim() ?? "";
  const publicUrlValue = process.env.R2_PUBLIC_URL?.trim() ?? "";

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrlValue) {
    throw new Error("R2_CONFIGURATION_MISSING");
  }

  let publicUrl: URL;
  try {
    publicUrl = new URL(publicUrlValue);
  } catch {
    throw new Error("R2_PUBLIC_URL_INVALID");
  }
  if (publicUrl.protocol !== "https:" || publicUrl.username || publicUrl.password || publicUrl.search || publicUrl.hash) {
    throw new Error("R2_PUBLIC_URL_INVALID");
  }

  cachedConfig = {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicUrl,
    prefix: normalizePrefix(process.env.R2_UPLOAD_PREFIX),
  };
  return cachedConfig;
}

function getClient(config: R2Config) {
  cachedClient ??= new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return cachedClient;
}

export function getR2ConfigurationStatus() {
  try {
    const config = readConfig();
    return { configured: true as const, publicOrigin: config.publicUrl.origin };
  } catch {
    return { configured: false as const, publicOrigin: null };
  }
}

function startsWith(bytes: Uint8Array, signature: readonly number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

export function detectImageType(bytes: Uint8Array): SupportedImageType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (bytes.length >= 12 && startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes.slice(8), [0x57, 0x45, 0x42, 0x50])) return "image/webp";
  if (bytes.length >= 12 && startsWith(bytes.slice(4), [0x66, 0x74, 0x79, 0x70])) {
    const brand = String.fromCharCode(...bytes.slice(8, 12));
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  return null;
}

export async function optimizeImageForUpload(bytes: Uint8Array): Promise<OptimizedImage> {
  const source = sharp(bytes, { failOn: "error", limitInputPixels: MAX_IMAGE_PIXELS });
  const metadata = await source.metadata();
  if (!metadata.width || !metadata.height) throw new Error("IMAGE_DIMENSIONS_INVALID");

  const output = await source
    .rotate()
    .resize({ width: MAX_IMAGE_DIMENSION, height: MAX_IMAGE_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 92, effort: 5, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });

  return {
    bytes: new Uint8Array(output.data),
    contentType: "image/webp",
    width: output.info.width,
    height: output.info.height,
    originalSize: bytes.byteLength,
  };
}

function safeStem(filename: string) {
  const stem = filename.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return stem.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "image";
}

function encodeKey(key: string) {
  return key.split("/").map(encodeURIComponent).join("/");
}

function publicUrlForKey(config: R2Config, key: string) {
  const basePath = config.publicUrl.pathname.replace(/\/$/, "");
  const url = new URL(config.publicUrl.origin);
  url.pathname = `${basePath}/${encodeKey(key)}`;
  return url.toString();
}

export async function uploadImageToR2(input: {
  bytes: Uint8Array;
  filename: string;
  contentType: SupportedImageType;
  folder: MediaFolder;
}) {
  const config = readConfig();
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `${config.prefix}/${input.folder}/${year}/${month}/${randomUUID()}-${safeStem(input.filename)}.${EXTENSIONS[input.contentType]}`;

  await getClient(config).send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: input.bytes,
    ContentLength: input.bytes.byteLength,
    ContentType: input.contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  return { key, url: publicUrlForKey(config, key), contentType: input.contentType, size: input.bytes.byteLength };
}

export async function listImagesFromR2(input: { folder?: MediaFolder; cursor?: string; limit?: number }) {
  const config = readConfig();
  const prefix = `${config.prefix}/${input.folder ? `${input.folder}/` : ""}`;
  const response = await getClient(config).send(new ListObjectsV2Command({
    Bucket: config.bucket,
    Prefix: prefix,
    ContinuationToken: input.cursor || undefined,
    MaxKeys: Math.min(Math.max(input.limit ?? 48, 1), 100),
  }));

  const images = (response.Contents ?? [])
    .filter((item): item is typeof item & { Key: string } => Boolean(item.Key) && /\.(?:jpe?g|png|webp|avif)$/i.test(item.Key!))
    .map((item) => {
      const relative = item.Key.slice(`${config.prefix}/`.length);
      const [folder = "", ...parts] = relative.split("/");
      const filename = parts.at(-1) ?? item.Key;
      return {
        key: item.Key,
        url: publicUrlForKey(config, item.Key),
        folder,
        filename: filename.replace(/^[0-9a-f]{8}-[0-9a-f-]{27}-/i, ""),
        size: item.Size ?? 0,
        lastModified: item.LastModified?.toISOString() ?? null,
      };
    })
    .sort((first, second) => (second.lastModified ?? "").localeCompare(first.lastModified ?? ""));

  return { images, cursor: response.NextContinuationToken ?? null, hasMore: Boolean(response.IsTruncated) };
}

export function getManagedR2Key(value: string) {
  const config = readConfig();
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.origin !== config.publicUrl.origin || url.search || url.hash) return null;

  const basePath = config.publicUrl.pathname.replace(/\/$/, "");
  const expectedPrefix = `${basePath}/${config.prefix}/`;
  if (!url.pathname.startsWith(expectedPrefix)) return null;

  try {
    const key = decodeURIComponent(url.pathname.slice(basePath.length + 1));
    return key.startsWith(`${config.prefix}/`) && !key.includes("..") ? key : null;
  } catch {
    return null;
  }
}

export function isAllowedImageUrl(value: string) {
  if (value.startsWith("/images/") && !value.includes("\\")) return true;
  try {
    return Boolean(getManagedR2Key(value));
  } catch {
    return false;
  }
}

export async function deleteImageFromR2(url: string) {
  const config = readConfig();
  const key = getManagedR2Key(url);
  if (!key) throw new Error("R2_IMAGE_NOT_MANAGED");
  await getClient(config).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
  return key;
}
