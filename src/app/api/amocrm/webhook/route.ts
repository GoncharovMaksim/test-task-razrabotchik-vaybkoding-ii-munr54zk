import { NextRequest, NextResponse } from "next/server";
import { handleAmoCrmWebhook } from "@/lib/amocrm/webhook-handler";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Ожидался валидный JSON в теле вебхука",
        },
        { status: 400 }
      );
    }

    const result = await handleAmoCrmWebhook(body);

    if (result.status === "invalid") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Ошибка обработки вебхука AmoCRM";
    return NextResponse.json(
      {
        status: "error",
        message: errorMsg,
      },
      { status: 500 }
    );
  }
}
