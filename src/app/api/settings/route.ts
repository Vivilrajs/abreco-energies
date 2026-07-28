import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/lib/models/SiteSettings";
import { isAuthed } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/data";
import { getLocalSettings, saveLocalSettings } from "@/lib/local-db";

const settingsSchema = z.object({
  heroTitle: z.string().max(120).optional(),
  heroSubtitle: z.string().max(200).optional(),
  heroBody: z.string().max(1000).optional(),
  videoUrl: z.string().max(500).optional(),
  imageUrl: z.string().max(500).optional(),
  audioUrl: z.string().max(500).optional(),
  phone: z.string().max(60).optional(),
  email: z.string().max(120).optional(),
  address: z.string().max(200).optional(),
});

async function getOrCreate() {
  let settings = await SiteSettings.findOne({ key: "default" });
  if (!settings) {
    settings = await SiteSettings.create({ key: "default" });
  }
  return settings;
}

export async function GET() {
  const localSettings = getLocalSettings(DEFAULT_SETTINGS);
  try {
    await connectDB();
    const settings = await getOrCreate();
    // Return merged settings, preferring DB if online, falling back to local
    const merged = { ...DEFAULT_SETTINGS, ...localSettings, ...settings.toObject() };
    return NextResponse.json({ settings: merged });
  } catch (error) {
    console.warn("⚠️ Could not load settings from MongoDB, using local fallback:", error);
    return NextResponse.json({ settings: localSettings });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    return NextResponse.json({ error: `Invalid input - ${errorMsg}` }, { status: 400 });
  }

  // Save to local file as backup first
  const currentLocal = getLocalSettings(DEFAULT_SETTINGS);
  const updatedLocal = saveLocalSettings({ ...currentLocal, ...parsed.data });

  try {
    await connectDB();
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "default" },
      { $set: parsed.data },
      { new: true, upsert: true }
    ).lean();
    return NextResponse.json({ settings });
  } catch (error) {
    console.warn("⚠️ MongoDB settings save failed, saved locally:", error);
    return NextResponse.json({ settings: updatedLocal });
  }
}
