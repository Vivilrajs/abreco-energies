import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/lib/models/SiteSettings";
import { isAuthed } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/data";

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
  try {
    await connectDB();
    const settings = await getOrCreate();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await connectDB();
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "default" },
      { $set: parsed.data },
      { new: true, upsert: true }
    ).lean();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
