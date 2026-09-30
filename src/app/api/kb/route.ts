import { NextRequest, NextResponse } from "next/server";
import { defaultKnowledgeBase } from "@/lib/kb/knowledge-base";
import { defaultUpsellEngine } from "@/lib/kb/upsell-rules";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";

  const articles = query ? defaultKnowledgeBase.search(query, 10) : defaultKnowledgeBase.getAll();
  const rules = defaultUpsellEngine.getAllRules();

  return NextResponse.json({
    success: true,
    data: {
      articles: type === "rules" ? [] : articles,
      upsellRules: type === "articles" ? [] : rules,
      totalArticles: articles.length,
      totalRules: rules.length,
    },
  });
}
