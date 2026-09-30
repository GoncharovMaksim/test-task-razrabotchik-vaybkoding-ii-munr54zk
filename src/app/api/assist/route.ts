import { NextRequest, NextResponse } from "next/server";
import { AssistRequestSchema } from "@/lib/validation/schemas";
import { defaultAiService } from "@/lib/ai/ai-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Неверный формат JSON в теле запроса",
        },
        { status: 400 }
      );
    }

    const validation = AssistRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Ошибка валидации входных данных",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const result = await defaultAiService.processRequest(validation.data);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Непредвиденная внутренняя ошибка";
    return NextResponse.json(
      {
        success: false,
        error: "Внутренняя ошибка сервиса ассистента",
        message,
      },
      { status: 500 }
    );
  }
}
