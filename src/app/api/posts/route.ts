import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { isAuthed } from "@/lib/auth";
import { BLOG_CONTENT } from "@/lib/blog-content";
import { getLocalItems, saveLocalItem } from "@/lib/local-db";

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
  const localItems = getLocalItems("posts");
  let dbItems: any[] = [];

  try {
    await connectDB();

    // Auto-seed if collection is empty
    const count = await BlogPost.countDocuments();
    if (count === 0) {
      const dataToInsert = BLOG_CONTENT.map(({ _id, ...rest }) => ({
        ...rest,
        date: rest.date ? new Date(rest.date) : new Date(),
      }));
      await BlogPost.insertMany(dataToInsert);
    }

    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    dbItems = await BlogPost.find(query).sort({ date: -1 }).lean();
  } catch (error) {
    console.warn("⚠️ Could not load posts from MongoDB, using local fallback:", error);
  }

  // Merge
  const merged = [...localItems];
  dbItems.forEach((dbItem) => {
    if (!merged.some((item) => item.slug === dbItem.slug)) {
      merged.push(dbItem);
    }
  });

  return NextResponse.json({
    posts: merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    return NextResponse.json(
      { error: `Invalid input - ${errorMsg}` },
      { status: 400 }
    );
  }

  const data = {
    ...parsed.data,
    date: parsed.data.date ? new Date(parsed.data.date).toISOString() : new Date().toISOString(),
  };

  try {
    await connectDB();
    const created = await BlogPost.create({
      ...data,
      date: new Date(data.date),
    });
    return NextResponse.json({ post: created }, { status: 201 });
  } catch (dbError) {
    console.warn("⚠️ MongoDB save failed, saving post locally:", dbError);
    const createdLocal = saveLocalItem("posts", data);
    return NextResponse.json({ post: createdLocal }, { status: 201 });
  }
}
