// Set images on seeded docs that have none. Run: node scripts/set-default-images.mjs
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
const db = mongoose.connection;

// Services by slug
const svc = {
  "solar-installation": "/assets/services/svc-1.png",
  "heat-pump-hot-water": "/assets/services/svc-2.png",
  "air-conditioning-service": "/assets/services/svc-3.png",
  "solar-battery-solution": "/assets/services/svc-4.png",
};
for (const [slug, image] of Object.entries(svc)) {
  await db.collection("services").updateMany(
    { slug, $or: [{ image: "" }, { image: { $exists: false } }] },
    { $set: { image } }
  );
}

// Blog by slug
const blog = {
  "how-many-solar-panels-do-you-need": "/assets/blog/blog-1.png",
  "latest-innovations-in-solar-technology": "/assets/blog/blog-2.png",
  "understanding-solar-tax-deductions": "/assets/blog/blog-3.png",
};
for (const [slug, image] of Object.entries(blog)) {
  await db.collection("blogposts").updateMany(
    { slug, $or: [{ image: "" }, { image: { $exists: false } }] },
    { $set: { image } }
  );
}

// Projects: assign proj-1..N by order to any without an image
const projects = await db
  .collection("projects")
  .find({ $or: [{ image: "" }, { image: { $exists: false } }] })
  .sort({ order: 1 })
  .toArray();
for (let i = 0; i < projects.length; i++) {
  const n = (i % 6) + 1;
  await db
    .collection("projects")
    .updateOne({ _id: projects[i]._id }, { $set: { image: `/assets/projects/proj-${n}.png` } });
}

// Testimonials: assign avatars by order to any without one
const testi = await db
  .collection("testimonials")
  .find({ $or: [{ avatar: "" }, { avatar: { $exists: false } }] })
  .sort({ order: 1 })
  .toArray();
for (let i = 0; i < testi.length; i++) {
  const n = (i % 5) + 1;
  await db
    .collection("testimonials")
    .updateOne({ _id: testi[i]._id }, { $set: { avatar: `/assets/testimonials/testi-${n}.png` } });
}

console.log(
  `Updated images — projects:${projects.length} testimonials:${testi.length} (services/blog by slug)`
);
await mongoose.disconnect();
