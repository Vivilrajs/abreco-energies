import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Service from "@/lib/models/Service";
import { isAuthed } from "@/lib/auth";
import { SERVICES_CONTENT } from "@/lib/service-content";
import { getLocalItems, saveLocalItem } from "@/lib/local-db";

const serviceSchema = z.object({
  slug: z.string().min(1).max(80),
  eyebrow: z.string().max(60).optional(),
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(600),
  body: z.string().max(4000).optional(),
  image: z.string().max(500).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

// Public GET returns published; admin GET returns all.
export async function GET() {
  const localItems = getLocalItems("services");
  let dbItems: any[] = [];

  try {
    await connectDB();
    
    // Auto-seed if collection is empty
    const count = await Service.countDocuments();
    if (count === 0) {
      const dataToInsert = SERVICES_CONTENT.map(({ _id, ...rest }) => rest);
      await Service.insertMany(dataToInsert);
    }

    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    dbItems = await Service.find(query).sort({ order: 1 }).lean();
  } catch (error) {
    console.warn("⚠️ Could not load services from MongoDB, using local fallback:", error);
  }

  // Merge (prefer local modifications if slugs match)
  const merged = [...localItems];
  dbItems.forEach((dbItem) => {
    if (!merged.some((item) => item.slug === dbItem.slug)) {
      merged.push(dbItem);
    }
  });

  return NextResponse.json({ services: merged.sort((a, b) => (a.order || 0) - (b.order || 0)) });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
      return NextResponse.json(
        { error: `Invalid input - ${errorMsg}` },
        { status: 400 }
      );
    }

  try {
    await connectDB();
    const created = await Service.create(parsed.data);
    return NextResponse.json({ service: created }, { status: 201 });
  } catch (dbError) {
    console.warn("⚠️ MongoDB save failed, saving service locally:", dbError);
    const createdLocal = saveLocalItem("services", parsed.data);
    return NextResponse.json({ service: createdLocal }, { status: 201 });
  }
}
