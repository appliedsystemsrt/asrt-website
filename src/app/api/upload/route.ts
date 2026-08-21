import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { inflateRawSync } from "zlib";
import JSZip from "jszip";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

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
  const extension = path.extname(fileName).toLowerCase();
  if (extension === ".pdf") return extractPdfText(buffer);
  if (extension === ".docx") return extractDocxText(buffer);
  if (extension === ".txt") return buffer.toString("utf8").trim();
  return "";
}

export async function POST(req: NextRequest) {
  try {
    ensureDir();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, buffer);

    let text = "";
    if (/\.(pdf|docx|txt)$/i.test(file.name)) {
      text = await extractDocumentText(file.name, buffer);
    }

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
      text,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
