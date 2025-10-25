import fs from "fs";
import path from "path";
import sharp from "sharp";

// Config
const SRC_DIR = path.resolve(process.cwd(), "public/images");
const OUT_DIR = SRC_DIR; // write optimized variants next to sources
const THUMB_WIDTH = 600;
const LARGE_WIDTH = 1600;

async function ensureDir(p: string) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function processImage(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return;

  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  const input = sharp(filePath);
  const meta = await input.metadata();

  // Thumbnail WEBP
  const thumbOut = path.join(dir, `${base}.thumb.webp`);
  await input
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(thumbOut);

  // Large WEBP for lightbox
  const largeOut = path.join(dir, `${base}.webp`);
  await sharp(filePath)
    .resize({ width: LARGE_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
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
