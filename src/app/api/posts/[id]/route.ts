import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { isAuthed } from "@/lib/auth";
import { updateLocalItem, deleteLocalItem } from "@/lib/local-db";

const updateSchema = z.object({
  slug: z.string().min(1).max(120).optional(),
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(600).optional(),
  body: z.string().max(20000).optional(),
  image: z.string().max(500).optional(),
  author: z.string().max(120).optional(),
  date: z.string().optional(),
  readTime: z.string().max(40).optional(),
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

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.date) data.date = new Date(parsed.data.date);

  if (id.startsWith("local-")) {
    const updatedLocal = updateLocalItem("posts", id, parsed.data);
    if (!updatedLocal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ post: updatedLocal });
  }

  try {
    await connectDB();
    const updated = await BlogPost.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ post: updated });
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
    const deleted = deleteLocalItem("posts", id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  try {
    await connectDB();
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
