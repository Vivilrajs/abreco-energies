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

const updateSchema = z.object({
  slug: z.string().min(1).max(80).optional(),
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(600).optional(),
  icon: z.string().max(16).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
  tagline: z.string().max(300).optional(),
  headline: z.string().max(200).optional(),
  intro: z.string().max(3000).optional(),
  heroImage: z.string().max(500).optional(),
  ctaLabel: z.string().max(60).optional(),
  benefits: z.array(benefitSchema).optional(),
  commercial: installSchema.optional(),
  residential: installSchema.optional(),
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
  const updated = await Solution.findByIdAndUpdate(id, parsed.data, {
    new: true,
  }).lean();
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ solution: updated });
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
  await Solution.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
