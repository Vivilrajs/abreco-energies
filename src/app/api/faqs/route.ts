import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Faq from "@/lib/models/Faq";
import { isAuthed } from "@/lib/auth";
import { FAQ_CONTENT } from "@/lib/faq-content";
import { getLocalItems, saveLocalItem } from "@/lib/local-db";

const schema = z.object({
  question: z.string().min(1).max(400),
  answer: z.string().min(1).max(4000),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const localItems = getLocalItems("faqs");
  let dbItems: any[] = [];

  try {
    await connectDB();

    // Auto-seed if collection is empty
    const count = await Faq.countDocuments();
    if (count === 0) {
      const dataToInsert = FAQ_CONTENT.map(({ _id, ...rest }) => rest);
      await Faq.insertMany(dataToInsert);
    }

    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    dbItems = await Faq.find(query).sort({ order: 1 }).lean();
  } catch (error) {
    console.warn("⚠️ Could not load FAQs from MongoDB, using local fallback:", error);
  }

  // Merge
  const merged = [...localItems];
  dbItems.forEach((dbItem) => {
    if (!merged.some((item) => item.question === dbItem.question)) {
      merged.push(dbItem);
    }
  });

  return NextResponse.json({ faqs: merged.sort((a, b) => (a.order || 0) - (b.order || 0)) });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    return NextResponse.json(
      { error: `Invalid input - ${errorMsg}` },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const created = await Faq.create(parsed.data);
    return NextResponse.json({ faq: created }, { status: 201 });
  } catch (dbError) {
    console.warn("⚠️ MongoDB save failed, saving FAQ locally:", dbError);
    const createdLocal = saveLocalItem("faqs", parsed.data);
    return NextResponse.json({ faq: createdLocal }, { status: 201 });
  }
}
