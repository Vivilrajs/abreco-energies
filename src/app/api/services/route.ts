import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Service from "@/lib/models/Service";
import { isAuthed } from "@/lib/auth";

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
  await connectDB();
  const admin = await isAuthed();
  const query = admin ? {} : { published: true };
  const services = await Service.find(query).sort({ order: 1 }).lean();
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const created = await Service.create(parsed.data);
  return NextResponse.json({ service: created }, { status: 201 });
}
