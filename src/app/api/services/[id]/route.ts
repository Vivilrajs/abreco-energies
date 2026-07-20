import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Service from "@/lib/models/Service";
import { isAuthed } from "@/lib/auth";

const updateSchema = z.object({
  slug: z.string().min(1).max(80).optional(),
  eyebrow: z.string().max(60).optional(),
  title: z.string().min(1).max(140).optional(),
  description: z.string().min(1).max(600).optional(),
  body: z.string().max(4000).optional(),
  image: z.string().max(500).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await connectDB();
  const updated = await Service.findByIdAndUpdate(id, parsed.data, {
    new: true,
  }).lean();
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ service: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  await Service.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
