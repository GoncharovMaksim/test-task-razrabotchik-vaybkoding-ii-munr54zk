import { NextResponse } from "next/server";
import { defaultKnowledgeBase } from "@/lib/kb/knowledge-base";
import { defaultUpsellEngine } from "@/lib/kb/upsell-rules";

export const dynamic = "force-dynamic";

export async function GET() {
  const articlesCount = defaultKnowledgeBase.getAll().length;
  const rulesCount = defaultUpsellEngine.getAllRules().length;

  return NextResponse.json(
    {
      status: "healthy",
      service: "ocomplex-amocrm-ai-copilot",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      knowledgeBase: {
        articlesLoaded: articlesCount,
        upsellRulesLoaded: rulesCount,
      },
      providers: {
        groqConfigured: Boolean(process.env.GROQ_API_KEY),
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
        deterministicReady: true,
      },
    },
    { status: 200 }
  );
}
