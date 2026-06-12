import { NextRequest, NextResponse } from "next/server";
import { getClient, MODEL } from "@/lib/anthropic";
import { getMethodology } from "@/lib/methodologies";
import type {
  ProfileData,
  ReportData,
} from "@/lib/methodologies/shared-schema";
import type Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

interface CompareRequestBody {
  methodology_id: string;
  self: ProfileData;
  partner: ProfileData;
  lang?: "ru" | "en";
}

function isProfile(p: unknown): p is ProfileData {
  if (!p || typeof p !== "object") return false;
  const obj = p as Record<string, unknown>;
  return Array.isArray(obj.axes) && typeof obj.summary === "string";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CompareRequestBody>;
    const methodology = body.methodology_id
      ? getMethodology(body.methodology_id)
      : undefined;

    if (!methodology) {
      return NextResponse.json(
        { error: "Неизвестная или отсутствующая методология" },
        { status: 400 },
      );
    }

    if (!isProfile(body.self) || !isProfile(body.partner)) {
      return NextResponse.json(
        { error: "Нужно передать оба профиля (self и partner)" },
        { status: 400 },
      );
    }

    const client = getClient();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: methodology.compareSystemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [methodology.compareTool],
      tool_choice: { type: "tool", name: methodology.compareTool.name },
      messages: [
        {
          role: "user",
          content: `Профиль self (мой):\n${JSON.stringify(body.self.axes)}\nКраткое описание: ${body.self.summary}\n\nПрофиль partner (партнёр):\n${JSON.stringify(body.partner.axes)}\nКраткое описание: ${body.partner.summary}\n\nСоставь отчёт через инструмент ${methodology.compareTool.name}. ${
            body.lang === "en"
              ? "Write all free-text fields (interpretations, strengths, risks, conversation starters, verdict) in English."
              : "Пиши все свободные текстовые поля по-русски."
          }`,
        },
      ],
    });

    const toolUse = response.content.find(
      (b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use",
    );

    if (!toolUse) {
      return NextResponse.json(
        { error: "Модель не вернула отчёт" },
        { status: 502 },
      );
    }

    const data = toolUse.input as ReportData;
    return NextResponse.json(
      {
        report: {
          methodology_id: methodology.id,
          data,
          created_at: new Date().toISOString(),
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Ошибка сравнения: ${message}` },
      { status: 500 },
    );
  }
}
