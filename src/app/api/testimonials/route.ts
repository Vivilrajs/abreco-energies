import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import { isAuthed } from "@/lib/auth";
import { TESTIMONIALS_CONTENT } from "@/lib/testimonial-content";
import { getLocalItems, saveLocalItem } from "@/lib/local-db";

const schema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().max(160).optional(),
  quote: z.string().min(1).max(2000),
  avatar: z.string().max(500).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const localItems = getLocalItems("testimonials");
  let dbItems: any[] = [];

  try {
    await connectDB();
    
    // Auto-seed if collection is empty
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      const dataToInsert = TESTIMONIALS_CONTENT.map(({ _id, ...rest }) => rest);
      await Testimonial.insertMany(dataToInsert);
    }

    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    dbItems = await Testimonial.find(query).sort({ order: 1 }).lean();
  } catch (error) {
    console.warn("⚠️ Could not load testimonials from MongoDB, using local fallback:", error);
  }

  // Merge
  const merged = [...localItems];
  dbItems.forEach((dbItem) => {
    if (!merged.some((item) => item.name === dbItem.name && item.quote === dbItem.quote)) {
      merged.push(dbItem);
    }
  });

  return NextResponse.json({ testimonials: merged.sort((a, b) => (a.order || 0) - (b.order || 0)) });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await connectDB();
    const created = await Testimonial.create(parsed.data);
    return NextResponse.json({ testimonial: created }, { status: 201 });
  } catch (dbError) {
    console.warn("⚠️ MongoDB save failed, saving testimonial locally:", dbError);
    const createdLocal = saveLocalItem("testimonials", parsed.data);
    return NextResponse.json({ testimonial: createdLocal }, { status: 201 });
  }
}
