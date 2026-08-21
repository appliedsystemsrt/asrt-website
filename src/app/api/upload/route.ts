import { NextRequest, NextResponse } from "next/server";
import { inflateRawSync } from "zlib";
import JSZip from "jszip";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";

function decodePdfString(value: string) {
  return value
    .replace(/\\([\\()])/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}

function extractPdfText(buffer: Buffer) {
  const source = buffer.toString("latin1");
  const text: string[] = [];
  const streamPattern = /<<([\s\S]*?)>>\s*stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let streamMatch: RegExpExecArray | null;

  while ((streamMatch = streamPattern.exec(source))) {
    let stream = Buffer.from(streamMatch[2], "latin1");
    if (streamMatch[1].includes("/FlateDecode")) {
      try {
        stream = inflateRawSync(stream);
      } catch {
        continue;
      }
    }

    const content = stream.toString("latin1");
    const literalPattern = /\((.*?)(?<!\\)\)\s*Tj/g;
    let literalMatch: RegExpExecArray | null;
    while ((literalMatch = literalPattern.exec(content))) {
      text.push(decodePdfString(literalMatch[1]));
    }

    const arrayPattern = /\[((?:.|\r|\n)*?)\]\s*TJ/g;
    let arrayMatch: RegExpExecArray | null;
    while ((arrayMatch = arrayPattern.exec(content))) {
      const strings = [...arrayMatch[1].matchAll(/\(((?:\\.|[^)])*)\)/g)];
      text.push(strings.map((match) => decodePdfString(match[1])).join(""));
    }
  }

  return text.join(" ").replace(/\s+/g, " ").trim();
}

async function extractDocxText(buffer: Buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const documentXml = await zip.file("word/document.xml")?.async("string");
  if (!documentXml) return "";
  return documentXml
    .replace(/<w:tab\s*\/>/g, "\t")
    .replace(/<w:br\s*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+\n/g, "\n")
    .trim();
}

async function extractDocumentText(fileName: string, buffer: Buffer) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  if (extension === "pdf") return extractPdfText(buffer);
  if (extension === "docx") return extractDocxText(buffer);
  if (extension === "txt") return buffer.toString("utf8").trim();
  return "";
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const ALLOWED_DOC_TYPES = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "bin";

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 10 MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)} MB.` },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.has(file.type) || ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext || "");
    const isDoc = ALLOWED_DOC_TYPES.has(file.type) || ["pdf", "docx", "txt", "doc"].includes(ext || "");
    if (!isImage && !isDoc) {
      return NextResponse.json(
        { error: `Unsupported file type. Accepted: JPG, PNG, WebP, GIF, SVG, PDF, DOCX, TXT. Got: ${file.type || ext}` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    let url: string;

    if (isSupabaseConfigured()) {
      // Upload to Supabase Storage
      const supabase = getSupabaseAdmin();
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filename, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("[Upload] Supabase storage error:", uploadError);
        return NextResponse.json(
          { error: "Upload failed: " + uploadError.message },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filename);
      url = urlData.publicUrl;
    } else {
      // Local dev fallback: write to public/uploads
      const fs = await import("fs");
      const path = await import("path");
      const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
      url = `/uploads/${filename}`;
    }

    let text = "";
    if (/\.(pdf|docx|txt)$/i.test(file.name)) {
      text = await extractDocumentText(file.name, buffer);
    }

    return NextResponse.json({
      success: true,
      url,
      filename,
      text,
    });
  } catch (error) {
    console.error("[Upload] Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
