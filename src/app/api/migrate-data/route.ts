import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/migrate-data
 * Migrates local JSON data files into Supabase.
 * Run once after switching from local storage to Supabase.
 */
export async function POST(req: NextRequest) {
  // Auth check
  const token = req.cookies.get("admin-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const results: Record<string, { imported: number; skipped: number; errors: string[] }> = {};

  try {
    // Import teams
    const { data: existingTeams } = await supabase
      .from("teams")
      .select("name");
    const existingTeamNames = new Set(
      (existingTeams || []).map((t: any) => t.name?.toLowerCase())
    );

    let teamsImported = 0;
    let teamsSkipped = 0;
    const teamsErrors: string[] = [];

    try {
      const fs = await import("fs");
      const path = await import("path");
      const teamsPath = path.join(process.cwd(), "data", "teams.json");
      if (fs.existsSync(teamsPath)) {
        const teams = JSON.parse(fs.readFileSync(teamsPath, "utf-8"));
        for (const team of teams) {
          if (existingTeamNames.has(team.name?.toLowerCase())) {
            teamsSkipped++;
            continue;
          }
          const { error } = await supabase.from("teams").insert({
            name: team.name,
            slug: `${team.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
            description: team.bio || "",
            metadata: { role: team.role, bio: team.bio, image: team.image },
          });
          if (error) teamsErrors.push(`${team.name}: ${error.message}`);
          else teamsImported++;
        }
      }
    } catch (e: any) {
      teamsErrors.push(e.message);
    }
    results.teams = { imported: teamsImported, skipped: teamsSkipped, errors: teamsErrors };

    // Import blogs
    const { data: existingBlogs } = await supabase
      .from("blogs")
      .select("title");
    const existingBlogTitles = new Set(
      (existingBlogs || []).map((b: any) => b.title?.toLowerCase())
    );

    let blogsImported = 0;
    let blogsSkipped = 0;
    const blogsErrors: string[] = [];

    try {
      const fs = await import("fs");
      const path = await import("path");
      const blogsPath = path.join(process.cwd(), "data", "blogs.json");
      if (fs.existsSync(blogsPath)) {
        const blogs = JSON.parse(fs.readFileSync(blogsPath, "utf-8"));
        for (const blog of blogs) {
          if (existingBlogTitles.has(blog.title?.toLowerCase())) {
            blogsSkipped++;
            continue;
          }
          const readTime = Math.max(
            1,
            Math.ceil(
              (blog.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length / 200
            )
          );
          const { error } = await supabase.from("blogs").insert({
            title: blog.title,
            slug: `${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
            excerpt: blog.excerpt || "",
            content: JSON.stringify(blog.content || ""),
            cover_image_url: blog.coverImage || "",
            status: "published",
            metadata: {
              type: blog.type || "blog",
              author: blog.author || "ASRT Team",
              pdfUrl: blog.pdfUrl || "",
              readTime,
            },
          });
          if (error) blogsErrors.push(`${blog.title}: ${error.message}`);
          else blogsImported++;
        }
      }
    } catch (e: any) {
      blogsErrors.push(e.message);
    }
    results.blogs = { imported: blogsImported, skipped: blogsSkipped, errors: blogsErrors };

    // Import communications
    const { data: existingComms } = await supabase
      .from("communications")
      .select("email,created_at");
    const existingCommsKeys = new Set(
      (existingComms || []).map(
        (c: any) => `${c.email?.toLowerCase()}:${c.created_at}`
      )
    );

    let commsImported = 0;
    let commsSkipped = 0;
    const commsErrors: string[] = [];

    try {
      const fs = await import("fs");
      const path = await import("path");
      const commsPath = path.join(process.cwd(), "data", "communications.json");
      if (fs.existsSync(commsPath)) {
        const comms = JSON.parse(fs.readFileSync(commsPath, "utf-8"));
        for (const comm of comms) {
          const key = `${comm.email?.toLowerCase()}:${comm.createdAt}`;
          if (existingCommsKeys.has(key)) {
            commsSkipped++;
            continue;
          }
          const { error } = await supabase.from("communications").insert({
            name: comm.name || "",
            email: comm.email || "",
            phone: comm.phone || "",
            company: comm.company || "",
            city: comm.city || "",
            interest: comm.interest || "",
            message: comm.message || "",
            read: comm.read || false,
            created_at: comm.createdAt || new Date().toISOString(),
            metadata: {
              subscribeNewsletters: comm.subscribeNewsletters || false,
              subscribeArticles: comm.subscribeArticles || false,
              subscribeBlogs: comm.subscribeBlogs || false,
            },
          });
          if (error) commsErrors.push(`${comm.email}: ${error.message}`);
          else commsImported++;
        }
      }
    } catch (e: any) {
      commsErrors.push(e.message);
    }
    results.communications = {
      imported: commsImported,
      skipped: commsSkipped,
      errors: commsErrors,
    };

    // Import replies
    const { data: existingReplies } = await supabase
      .from("replies")
      .select("metadata");
    const existingRepliesKeys = new Set(
      (existingReplies || []).map(
        (r: any) => `${r.metadata?.toEmail}:${r.metadata?.subject}:${r.metadata?.createdAt || ""}`
      )
    );

    let repliesImported = 0;
    let repliesSkipped = 0;
    const repliesErrors: string[] = [];

    try {
      const fs = await import("fs");
      const path = await import("path");
      const repliesPath = path.join(process.cwd(), "data", "replies.json");
      if (fs.existsSync(repliesPath)) {
        const replies = JSON.parse(fs.readFileSync(repliesPath, "utf-8"));
        for (const reply of replies) {
          const key = `${reply.toEmail}:${reply.subject}:${reply.createdAt || ""}`;
          if (existingRepliesKeys.has(key)) {
            repliesSkipped++;
            continue;
          }
          const { error } = await supabase.from("replies").insert({
            metadata: {
              toEmail: reply.toEmail,
              toName: reply.toName,
              subject: reply.subject,
              message: reply.message,
            },
          });
          if (error) repliesErrors.push(`${reply.toEmail}: ${error.message}`);
          else repliesImported++;
        }
      }
    } catch (e: any) {
      repliesErrors.push(e.message);
    }
    results.replies = {
      imported: repliesImported,
      skipped: repliesSkipped,
      errors: repliesErrors,
    };

    // Import products
    const { data: existingProducts } = await supabase
      .from("products")
      .select("slug");
    const existingSlugs = new Set(
      (existingProducts || []).map((p: any) => p.slug)
    );

    let productsImported = 0;
    let productsSkipped = 0;
    const productsErrors: string[] = [];

    try {
      const fs = await import("fs");
      const path = await import("path");
      const productsPath = path.join(process.cwd(), "data", "products.json");
      if (fs.existsSync(productsPath)) {
        const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
        for (const product of products) {
          if (existingSlugs.has(product.slug)) {
            productsSkipped++;
            continue;
          }
          const { error } = await supabase.from("products").insert({
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            metadata: product,
          });
          if (error) productsErrors.push(`${product.name}: ${error.message}`);
          else productsImported++;
        }
      }
    } catch (e: any) {
      productsErrors.push(e.message);
    }
    results.products = {
      imported: productsImported,
      skipped: productsSkipped,
      errors: productsErrors,
    };

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Migration failed: " + error.message, results },
      { status: 500 }
    );
  }
}
