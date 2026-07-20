import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Faq from "@/lib/models/Faq";
import { isAuthed } from "@/lib/auth";

const schema = z.object({
  question: z.string().min(1).max(400),
  answer: z.string().min(1).max(4000),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    const faqs = await Faq.find(query).sort({ order: 1 }).lean();
    return NextResponse.json({ faqs });
  } catch {
    return NextResponse.json({ faqs: [] });
  }
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
  await connectDB();
  const created = await Faq.create(parsed.data);
  return NextResponse.json({ faq: created }, { status: 201 });
}
