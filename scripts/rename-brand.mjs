// One-off: rename brand strings in the DB settings doc. Run: node scripts/rename-brand.mjs
import mongoose from "mongoose";
import { readFileSync } from "node:fs";

try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.collection("sitesettings");
const doc = await col.findOne({ key: "default" });

if (!doc) {
  console.log("No settings doc found.");
} else {
  const swap = (s) =>
    typeof s === "string" ? s.replace(/Abraco/g, "Abreco").replace(/abraco/g, "abreco") : s;
  const next = {
    heroTitle: swap(doc.heroTitle),
    heroSubtitle: swap(doc.heroSubtitle),
    heroBody: swap(doc.heroBody),
    email: swap(doc.email),
  };
  await col.updateOne({ key: "default" }, { $set: next });
  console.log("Renamed ->", next);
}

await mongoose.disconnect();
