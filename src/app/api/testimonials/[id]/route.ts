import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import { isAuthed } from "@/lib/auth";
import { updateLocalItem, deleteLocalItem } from "@/lib/local-db";

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.string().max(160).optional(),
  quote: z.string().min(1).max(2000).optional(),
  avatar: z.string().max(500).optional(),
  rating: z.number().int().min(1).max(5).optional(),
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

  if (id.startsWith("local-")) {
    const updatedLocal = updateLocalItem("testimonials", id, parsed.data);
    if (!updatedLocal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ testimonial: updatedLocal });
  }

  try {
    await connectDB();
    const updated = await Testimonial.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ testimonial: updated });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (id.startsWith("local-")) {
    const deleted = deleteLocalItem("testimonials", id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  try {
    await connectDB();
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
