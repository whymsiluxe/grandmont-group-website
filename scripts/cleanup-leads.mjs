#!/usr/bin/env node

import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

const dryRun = process.argv.includes("--dry-run");
const storageDir = process.env.LEAD_STORAGE_DIR?.trim();

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!storageDir) fail("LEAD_STORAGE_DIR is required.");
if (!path.isAbsolute(storageDir)) fail("LEAD_STORAGE_DIR must be absolute.");
if (storageDir.includes(`${path.sep}public${path.sep}`)) fail("LEAD_STORAGE_DIR must not be public.");

let checked = 0;
let deleted = 0;
const now = Date.now();

const entries = await readdir(storageDir, { withFileTypes: true }).catch((error) => {
  if (error?.code === "ENOENT") return [];
  throw error;
});

for (const entry of entries) {
  if (!entry.isDirectory()) continue;

  const leadDir = path.join(storageDir, entry.name);
  const metadataPath = path.join(leadDir, "metadata.json");

  try {
    const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
    const deleteAfter = metadata?.retention?.deleteAfter;
    const deleteAt = typeof deleteAfter === "string" ? Date.parse(deleteAfter) : NaN;
    if (!Number.isFinite(deleteAt)) continue;

    checked += 1;
    if (deleteAt > now) continue;

    if (dryRun) {
      console.log(`would_delete ${entry.name}`);
    } else {
      await rm(leadDir, { recursive: true, force: false });
      console.log(`deleted ${entry.name}`);
    }
    deleted += 1;
  } catch (error) {
    console.warn(`skipped ${entry.name}: ${error instanceof Error ? error.message : "unknown error"}`);
  }
}

console.log(`checked=${checked} deleted=${deleted} dryRun=${dryRun}`);
