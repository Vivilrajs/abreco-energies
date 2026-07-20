import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import { isAuthed } from "@/lib/auth";

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
  try {
    await connectDB();
    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    const testimonials = await Testimonial.find(query).sort({ order: 1 }).lean();
    return NextResponse.json({ testimonials });
  } catch {
    return NextResponse.json({ testimonials: [] });
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
  const created = await Testimonial.create(parsed.data);
  return NextResponse.json({ testimonial: created }, { status: 201 });
}
