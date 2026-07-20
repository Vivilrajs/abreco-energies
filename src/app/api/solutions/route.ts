import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Solution from "@/lib/models/Solution";
import { isAuthed } from "@/lib/auth";

const benefitSchema = z.object({
  icon: z.string().max(16).default("⚡"),
  text: z.string().max(1000).default(""),
});

const installSchema = z.object({
  title: z.string().max(160).default(""),
  body: z.string().max(2000).default(""),
  scenarios: z.array(z.string().max(300)).default([]),
  image: z.string().max(500).default(""),
});

const solutionSchema = z.object({
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  icon: z.string().max(16).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
  tagline: z.string().max(300).optional(),
  headline: z.string().max(200).optional(),
  intro: z.string().max(3000).optional(),
  heroImage: z.string().max(500).optional(),
  heroVideo: z.string().max(500).optional(),
  ctaLabel: z.string().max(60).optional(),
  benefits: z.array(benefitSchema).optional(),
  commercial: installSchema.optional(),
  residential: installSchema.optional(),
});

// Public GET returns only published; admin GET returns all.
export async function GET() {
  try {
    await connectDB();
    const admin = await isAuthed();
    const query = admin ? {} : { published: true };
    const solutions = await Solution.find(query).sort({ order: 1 }).lean();
    return NextResponse.json({ solutions });
  } catch {
    return NextResponse.json({ solutions: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = solutionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const created = await Solution.create(parsed.data);
  return NextResponse.json({ solution: created }, { status: 201 });
}
