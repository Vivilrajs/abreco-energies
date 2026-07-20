// One-off: set the site contact email. Run: node scripts/update-email.mjs
import mongoose from "mongoose";
import { readFileSync } from "node:fs";

try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const NEW_EMAIL = process.argv[2] || "admin@abracoenergies.com";

await mongoose.connect(process.env.MONGODB_URI);
const res = await mongoose.connection
  .collection("sitesettings")
  .updateOne({ key: "default" }, { $set: { email: NEW_EMAIL } });
console.log("Updated email ->", NEW_EMAIL, "matched:", res.matchedCount);
await mongoose.disconnect();
