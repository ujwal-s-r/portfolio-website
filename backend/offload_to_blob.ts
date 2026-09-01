import "dotenv/config";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { db, projects, linkedInPosts } from "./db";
import { seedDatabase } from "./db/seed";

const token = process.env.BLOB_READ_WRITE_TOKEN;

async function getAllImageFiles(dir: string, baseDir: string): Promise<string[]> {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(await getAllImageFiles(filePath, baseDir));
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(ext)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

export async function offloadImagesToBlob() {
  if (!token) {
    console.error("❌ Error: BLOB_READ_WRITE_TOKEN is not set in .env!");
    console.error("Please add BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... to your .env file.");
    process.exit(1);
  }

  console.log("🚀 Starting image offload to Vercel Blob...");

  const publicDir = path.join(process.cwd(), "public");
  const infoDir = path.join(publicDir, "info");

  const imageFiles = await getAllImageFiles(infoDir, publicDir);
  console.log(`Found ${imageFiles.length} images to upload.`);

  const urlMapping: Record<string, string> = {};

  for (const filePath of imageFiles) {
    const relPath = path.relative(publicDir, filePath).replace(/\\/g, "/");
    const localWebPath = `/${relPath}`;
    const fileBuffer = fs.readFileSync(filePath);

    console.log(`Uploading ${relPath} to Vercel Blob...`);
    try {
      const blob = await put(relPath, fileBuffer, {
        access: "public",
        token: token,
      });

      urlMapping[localWebPath] = blob.url;
      console.log(`  ✓ ${localWebPath} -> ${blob.url}`);
    } catch (err) {
      console.error(`  ✗ Failed to upload ${relPath}:`, err);
    }
  }

  console.log("\n📝 Updating markdown files in public/info with Vercel Blob CDN URLs...");

  // Update markdown files in public/info
  function replaceInMarkdownFiles(dir: string) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        replaceInMarkdownFiles(fullPath);
      } else if (item.endsWith(".md")) {
        let content = fs.readFileSync(fullPath, "utf-8");
        let changed = false;

        for (const [localUrl, blobUrl] of Object.entries(urlMapping)) {
          if (content.includes(localUrl)) {
            content = content.replaceAll(localUrl, blobUrl);
            changed = true;
          }
        }

        if (changed) {
          fs.writeFileSync(fullPath, content, "utf-8");
          console.log(`  ✓ Updated ${path.relative(process.cwd(), fullPath)}`);
        }
      }
    }
  }

  replaceInMarkdownFiles(infoDir);

  console.log("\n🔄 Re-seeding database with updated Vercel Blob URLs...");
  await seedDatabase();

  console.log("\n✨ All images have been successfully offloaded to Vercel Blob and referenced in your project!");
}

if (require.main === module || !module.parent) {
  offloadImagesToBlob()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Offload error:", err);
      process.exit(1);
    });
}
