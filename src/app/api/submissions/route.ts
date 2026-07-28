import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Submission, { PRODUCTS, STATES } from "@/lib/models/Submission";
import { isAuthed } from "@/lib/auth";
import { getLocalSubmissions, saveLocalSubmission } from "@/lib/local-db";

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
  try {
    const body = await req.json().catch(() => null);
    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      const created = await Submission.create(parsed.data);
      return NextResponse.json({ ok: true, id: created._id }, { status: 201 });
    } catch (dbError) {
      console.warn("⚠️ MongoDB connection failed, falling back to local file storage:", dbError);
      
      // Fallback: save to local JSON file
      const localId = "local-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      const createdLocal = saveLocalSubmission({
        _id: localId,
        firstName: parsed.data.firstName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        state: parsed.data.state,
        postcode: parsed.data.postcode,
        product: parsed.data.product,
        message: parsed.data.message,
        status: "new",
      });
      
      return NextResponse.json({ ok: true, id: createdLocal._id, local: true }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Submission failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// Admin: list leads.
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const localSubmissions = getLocalSubmissions();
  let dbSubmissions: any[] = [];

  try {
    await connectDB();
    dbSubmissions = await Submission.find().sort({ createdAt: -1 }).lean();
  } catch (dbError) {
    console.warn("⚠️ Could not load submissions from MongoDB, reading local files only:", dbError);
  }

  // Merge and sort by createdAt descending
  const allSubmissions = [...localSubmissions, ...dbSubmissions].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return NextResponse.json({ submissions: allSubmissions });
}
