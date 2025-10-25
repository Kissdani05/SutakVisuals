import fs from "fs";
import path from "path";
import sharp from "sharp";

// Config (can be overridden with env vars)
const SRC_DIR = path.resolve(process.cwd(), "public/images");
const OUT_DIR = SRC_DIR; // write optimized variants next to sources
const THUMB_WIDTH = Number(process.env.THUMB_WIDTH || 900);
const THUMB_QUALITY = Number(process.env.THUMB_QUALITY || 90);
const THUMB_NEAR_LOSSLESS = process.env.THUMB_NEAR_LOSSLESS !== "0"; // default true
const LARGE_WIDTH = Number(process.env.LARGE_WIDTH || 1600);
const LARGE_QUALITY = Number(process.env.LARGE_QUALITY || 86);

async function ensureDir(p: string) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function processImage(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  // Only process original source formats to avoid reading/writing same files
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  const input = sharp(filePath);
  const meta = await input.metadata();

  // Thumbnail WEBP (high quality, near-lossless for crisp previews)
  const thumbOut = path.join(dir, `${base}.thumb.webp`);
  await input
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY, nearLossless: THUMB_NEAR_LOSSLESS })
    .toFile(thumbOut);

  // Large WEBP for lightbox
  const largeOut = path.join(dir, `${base}.webp`);
  await sharp(filePath)
    .resize({ width: LARGE_WIDTH, withoutEnlargement: true })
    .webp({ quality: LARGE_QUALITY })
    .toFile(largeOut);

  // Optional: keep original untouched.
  console.log(`Optimized: ${path.basename(filePath)} -> [${path.basename(thumbOut)}, ${path.basename(largeOut)}] (${meta.width}x${meta.height})`);
}

async function walk(dir: string) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else await processImage(full);
  }
}

async function main() {
  await ensureDir(OUT_DIR);
  await walk(SRC_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
