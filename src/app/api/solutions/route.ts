import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Solution from "@/lib/models/Solution";
import { isAuthed } from "@/lib/auth";
import { PRODUCTS_CONTENT } from "@/lib/product-content";
import { getLocalItems, saveLocalItem } from "@/lib/local-db";

const benefitSchema = z.object({
  icon: z.string().max(16).default("⚡"),
  text: z.string().max(1000).default(""),
});

const installSchema = z.object({
  title: z.string().max(160).default(""),
  body: z.string().max(2000).default(""),
  scenarios: z.array(z.string().max(300)).default([]),
  image: z.string().max(500).default(""),
});

const solutionSchema = z.object({
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  icon: z.string().max(16).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
  tagline: z.string().max(300).optional(),
  headline: z.string().max(200).optional(),
  intro: z.string().max(3000).optional(),
  heroImage: z.string().max(500).optional(),
  heroVideo: z.string().max(500).optional(),
  ctaLabel: z.string().max(60).optional(),
  benefits: z.array(benefitSchema).optional(),
  commercial: installSchema.optional(),
  residential: installSchema.optional(),
});

// Public GET returns only published; admin GET returns all.
export async function GET() {
  const localItems = getLocalItems("solutions");
  let dbItems: any[] = [];

  try {
    await connectDB();

    // Auto-seed if collection is empty
    const count = await Solution.countDocuments();
    if (count === 0) {
      const dataToInsert = PRODUCTS_CONTENT.map(({ _id, ...rest }) => rest);
      await Solution.insertMany(dataToInsert);
    }

    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    dbItems = await Solution.find(query).sort({ order: 1 }).lean();
  } catch (error) {
    console.warn("⚠️ Could not load solutions from MongoDB, using local fallback:", error);
  }

  // Merge
  const merged = [...localItems];
  dbItems.forEach((dbItem) => {
    if (!merged.some((item) => item.slug === dbItem.slug)) {
      merged.push(dbItem);
    }
  });

  return NextResponse.json({ solutions: merged.sort((a, b) => (a.order || 0) - (b.order || 0)) });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = solutionSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    return NextResponse.json(
      { error: `Invalid input - ${errorMsg}` },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const created = await Solution.create(parsed.data);
    return NextResponse.json({ solution: created }, { status: 201 });
  } catch (dbError) {
    console.warn("⚠️ MongoDB save failed, saving solution locally:", dbError);
    const createdLocal = saveLocalItem("solutions", parsed.data);
    return NextResponse.json({ solution: createdLocal }, { status: 201 });
  }
}
