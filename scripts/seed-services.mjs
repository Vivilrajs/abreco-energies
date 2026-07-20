// Seed default services. Run: node scripts/seed-services.mjs
import mongoose from "mongoose";
import { readFileSync } from "node:fs";

try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const services = [
  {
    slug: "solar-installation",
    eyebrow: "Solar",
    title: "Solar Installation",
    description:
      "End-to-end design and installation of high-efficiency solar PV systems for homes and businesses, sized to your roof and energy needs.",
    body: "From the first site assessment to the final switch-on, our CEC-accredited team handles system design, panel and inverter selection, and professional installation. We manage the paperwork and government rebates so you get maximum savings with minimum hassle.",
    image: "",
    order: 1,
    published: true,
  },
  {
    slug: "heat-pump-hot-water",
    eyebrow: "Hot Water",
    title: "Heat Pump Hot Water",
    description:
      "Energy-efficient heat pump hot water systems that use up to 70% less energy than traditional electric water heaters.",
    body: "We supply and install premium heat pump hot water systems for homes and businesses, replacing old gas or electric units. Fewer moving parts, long warranties, and access to federal and state rebates make the switch simple and affordable.",
    image: "",
    order: 2,
    published: true,
  },
  {
    slug: "air-conditioning-service",
    eyebrow: "Climate",
    title: "Air Conditioning",
    description:
      "Eco-friendly split, multi-split, and ducted air conditioning systems installed by qualified technicians.",
    body: "Our energy-efficient air conditioners keep your home or workspace comfortable year-round while cutting electricity bills by up to 40–50%. We handle system selection, professional installation, and rebate guidance.",
    image: "",
    order: 3,
    published: true,
  },
  {
    slug: "solar-battery-solution",
    eyebrow: "Storage",
    title: "Solar Battery Solution",
    description:
      "Smart solar batteries that store daytime energy for use at night, during outages, or peak-price periods.",
    body: "Add energy independence and backup power with a scalable battery system that integrates with new or existing solar. Real-time monitoring, durable hardware, and end-to-end service from assessment to aftercare.",
    image: "",
    order: 4,
    published: true,
  },
];

const ServiceSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    eyebrow: String,
    title: String,
    description: String,
    body: String,
    image: String,
    order: Number,
    published: Boolean,
  },
  { timestamps: true }
);

await mongoose.connect(process.env.MONGODB_URI);
const Service =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);
for (const s of services) {
  await Service.updateOne({ slug: s.slug }, { $set: s }, { upsert: true });
}
console.log("Seeded", services.length, "services.");
await mongoose.disconnect();
