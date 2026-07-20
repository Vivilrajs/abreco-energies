import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { isAuthed } from "@/lib/auth";

const projectSchema = z.object({
  title: z.string().max(160).optional(),
  category: z.string().max(80).optional(),
  image: z.string().min(1).max(500),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

// Public GET returns published; admin GET returns all.
export async function GET() {
  try {
    await connectDB();
    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    const projects = await Project.find(query).sort({ order: 1 }).lean();
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input — an image is required.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const created = await Project.create(parsed.data);
  return NextResponse.json({ project: created }, { status: 201 });
}
