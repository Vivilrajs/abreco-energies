import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { isAuthed } from "@/lib/auth";

const postSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(600).optional(),
  body: z.string().max(20000).optional(),
  image: z.string().max(500).optional(),
  author: z.string().max(120).optional(),
  date: z.string().optional(),
  readTime: z.string().max(40).optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  await connectDB();
  const admin = await isAuthed();
  const query = admin ? {} : { published: true };
  const posts = await BlogPost.find(query).sort({ date: -1 }).lean();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = {
    ...parsed.data,
    date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
  };

  await connectDB();
  const created = await BlogPost.create(data);
  return NextResponse.json({ post: created }, { status: 201 });
}
