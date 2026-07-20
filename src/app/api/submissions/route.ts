import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Submission, { PRODUCTS, STATES } from "@/lib/models/Submission";
import { isAuthed } from "@/lib/auth";

const submissionSchema = z.object({
  firstName: z.string().max(120).optional(),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  state: z.enum(STATES).optional(),
  postcode: z.string().max(12).optional(),
  product: z.enum(PRODUCTS).optional(),
  message: z.string().max(2000).optional(),
});

// Public: create a lead.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const created = await Submission.create(parsed.data);
  return NextResponse.json({ ok: true, id: created._id }, { status: 201 });
}

// Admin: list leads.
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const submissions = await Submission.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ submissions });
}
