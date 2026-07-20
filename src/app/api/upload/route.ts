import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { isAuthed } from "@/lib/auth";
import { isS3Configured, uploadToS3 } from "@/lib/s3";

export const runtime = "nodejs";

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];
const ALLOWED = [...IMAGE_TYPES, ...VIDEO_TYPES];

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      {
        error:
          "Unsupported type. Use JPG, PNG, WebP, GIF, AVIF, or MP4/WebM video.",
      },
      { status: 400 }
    );
  }

  const isVideo = VIDEO_TYPES.includes(file.type);
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: `File too large (max ${isVideo ? "100MB" : "8MB"}).`,
      },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() || "bin")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const base =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || (isVideo ? "video" : "image");
  const filename = `${base}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Prefer S3 (persists on serverless); fall back to local disk for dev.
  if (isS3Configured()) {
    try {
      const key = `media/uploads/${filename}`;
      const url = await uploadToS3(key, buffer, file.type);
      return NextResponse.json({ url }, { status: 201 });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "S3 upload failed" },
        { status: 500 }
      );
    }
  }

  const dir = path.join(process.cwd(), "public", "media", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  const url = `/media/uploads/${filename}`;
  return NextResponse.json({ url }, { status: 201 });
}
