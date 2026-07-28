import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { isAuthed } from "@/lib/auth";
import { updateLocalItem, deleteLocalItem } from "@/lib/local-db";

const updateSchema = z.object({
  title: z.string().max(160).optional(),
  category: z.string().max(80).optional(),
  image: z.string().min(1).max(500).optional(),
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
    const updatedLocal = updateLocalItem("projects", id, parsed.data);
    if (!updatedLocal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ project: updatedLocal });
  }

  try {
    await connectDB();
    const updated = await Project.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ project: updated });
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
    const deleted = deleteLocalItem("projects", id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  try {
    await connectDB();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
