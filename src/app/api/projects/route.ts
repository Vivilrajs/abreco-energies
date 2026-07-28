import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { isAuthed } from "@/lib/auth";
import { PROJECTS_CONTENT } from "@/lib/project-content";
import { getLocalItems, saveLocalItem } from "@/lib/local-db";

const projectSchema = z.object({
  title: z.string().max(160).optional(),
  category: z.string().max(80).optional(),
  image: z.string().min(1).max(500),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

// Public GET returns published; admin GET returns all.
export async function GET() {
  const localItems = getLocalItems("projects").map(p => ({
    ...p,
    slug: p.slug || p._id || `project-${p.order}`,
  }));
  let dbItems: any[] = [];

  try {
    await connectDB();

    // Auto-seed if collection is empty
    const count = await Project.countDocuments();
    if (count === 0) {
      const dataToInsert = PROJECTS_CONTENT.map(({ _id, ...rest }) => rest);
      await Project.insertMany(dataToInsert);
    }

    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    dbItems = await Project.find(query).sort({ order: 1 }).lean();
  } catch (error) {
    console.warn("⚠️ Could not load projects from MongoDB, using local fallback:", error);
  }

  // Merge (prefer local modifications if title/slug/image match)
  const merged = [...localItems];
  dbItems.forEach((dbItem) => {
    if (!merged.some((item) => item.image === dbItem.image || (item.title && item.title === dbItem.title))) {
      merged.push(dbItem);
    }
  });

  return NextResponse.json({ projects: merged.sort((a, b) => (a.order || 0) - (b.order || 0)) });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    return NextResponse.json(
      { error: `Invalid input - ${errorMsg}` },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const created = await Project.create(parsed.data);
    return NextResponse.json({ project: created }, { status: 201 });
  } catch (dbError) {
    console.warn("⚠️ MongoDB save failed, saving project locally:", dbError);
    const createdLocal = saveLocalItem("projects", parsed.data);
    return NextResponse.json({ project: createdLocal }, { status: 201 });
  }
}
