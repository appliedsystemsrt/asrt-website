import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

function parseJsonObject(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    if (start < 0) return null;

    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < cleaned.length; index += 1) {
      const character = cleaned[index];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === "\\" && inString) {
        escaped = true;
        continue;
      }
      if (character === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (character === "{") depth += 1;
      if (character === "}") depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(cleaned.slice(start, index + 1));
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}

async function callOpenRouter(prompt: string) {
  if (!OPENROUTER_API_KEY) {
    return { success: false, error: "OPENROUTER_API_KEY not set in .env.local" };
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://appliedaiml.com",
        "X-Title": "ASRT Admin",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 6000,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error?.message || `OpenRouter request failed (${res.status})`,
      };
    }
    if (data.error) {
      return { success: false, error: data.error.message || "OpenRouter error" };
    }
    const content = data.choices?.[0]?.message?.content || "";
    return { success: true, content };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, documentText, title, type } = body;

  if (action === "generate-blog") {
    const prompt = `You are a professional content writer for "Applied Systems Research & Technology (OPC) Private Limited" — an applied AI research company.

Based on the following document content, generate a professional ${type || "blog"} post.

Title suggestion: ${title || "Auto-generated from document"}

Document content:
---
${documentText}
---

Generate the output in this EXACT JSON format (no markdown, just raw JSON):
{
  "title": "The blog post title",
  "excerpt": "A 2-3 sentence summary",
  "content": "The full blog post content in HTML format with proper paragraphs, headings (h2, h3), bullet points where appropriate. Make it professional, engaging, and technically accurate."
}

Rules:
- Content must be well-structured with clear sections
- Use professional but accessible language
- Include relevant technical details from the document
- Make it suitable for a tech company blog
- Do not use markdown, output raw HTML inside the content field
- Keep the content between 500-1500 words`;

    const result = await callOpenRouter(prompt);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error });
    }

    // Try to parse JSON from the response
    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, data: parsed });
      }
      // If no JSON found, return raw content
      return NextResponse.json({
        success: true,
        data: {
          title: title || "Generated Blog Post",
          excerpt: result.content.slice(0, 200) + "...",
          content: result.content,
        },
      });
    } catch {
      return NextResponse.json({
        success: true,
        data: {
          title: title || "Generated Blog Post",
          excerpt: result.content.slice(0, 200) + "...",
          content: result.content,
        },
      });
    }
  }

  if (action === "extract-text") {
    const prompt = `Extract and organize the text content from this document. Return clean, well-structured text that captures all key information:

---
${documentText}
---

Return the extracted text in a clean format with proper paragraphs.`;

    const result = await callOpenRouter(prompt);
    return NextResponse.json(result);
  }

  if (action === "generate-product") {
    const prompt = `You are a technical product writer for Applied Systems Research & Technology (OPC) Private Limited.

Based only on the document below, create a complete product page. Return ONLY valid JSON, with no markdown fences, using this exact shape:
{
  "name": "Product name",
  "slug": "url-friendly-slug",
  "tagline": "Short product tagline",
  "description": "Clear 2-3 sentence product description",
  "overview": "Product overview",
  "problem": "Problem statement",
  "intelligence": "AI or intelligence capabilities",
  "modules": "Major modules and features",
  "architecture": "System architecture",
  "technology": "Technology stack",
  "security": "Security considerations",
  "performance": "Performance characteristics",
  "testing": "Testing and validation approach",
  "roadmap": "Future roadmap",
  "screens": "Product screens, dashboards, or user interfaces",
  "research": "Applied research foundation and research directions",
  "workflow": "End-to-end product workflow as ordered steps",
  "differentiation": "What makes this product distinct",
  "tags": ["tag1", "tag2", "tag3"]
}

Use specific facts from the document. If a section is not present, write a concise, honest description based on the available information; never use placeholder text or say that content should be edited.

Document:
---
${documentText}
---`;

    const result = await callOpenRouter(prompt);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error });
    }

    try {
      const parsed = parseJsonObject(result.content);
      if (!parsed) throw new Error("AI returned no valid product JSON");
      return NextResponse.json({ success: true, data: parsed });
    } catch (error) {
      console.error("[AI] Product response parsing failed:", error instanceof Error ? error.message : error);
      return NextResponse.json(
        { success: false, error: "The AI response was incomplete or invalid. Please try again with a shorter document." },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
