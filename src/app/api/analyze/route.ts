import { NextRequest, NextResponse } from "next/server";
import { getClient, MODEL } from "@/lib/anthropic";
import { getMethodology } from "@/lib/methodologies";
import type { ProfileData } from "@/lib/methodologies/shared-schema";
import type Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TEXT_LENGTH = 200_000;
const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const methodologyId = (formData.get("methodology_id") as string | null) ?? "";
    const text = (formData.get("text") as string | null) ?? "";
    const imageFiles = formData.getAll("images") as File[];

    const methodology = getMethodology(methodologyId);
    if (!methodology) {
      return NextResponse.json(
        { error: `Неизвестная методология: ${methodologyId}` },
        { status: 400 },
      );
    }

    if (!text.trim() && imageFiles.length === 0) {
      return NextResponse.json(
        { error: "Нужен текст или хотя бы одно изображение" },
        { status: 400 },
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Текст слишком длинный (макс ${MAX_TEXT_LENGTH} символов)` },
        { status: 400 },
      );
    }

    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Максимум ${MAX_IMAGES} изображений за раз` },
        { status: 400 },
      );
    }

    const userContent: Anthropic.Messages.ContentBlockParam[] = [];

    for (const file of imageFiles) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `Формат ${file.type} не поддерживается` },
          { status: 400 },
        );
      }
      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: `Изображение слишком большое (макс 5 МБ)` },
          { status: 400 },
        );
      }
      const buf = Buffer.from(await file.arrayBuffer());
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: file.type as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp",
          data: buf.toString("base64"),
        },
      });
    }

    if (text.trim()) {
      userContent.push({
        type: "text",
        text: text.trim(),
      });
    }

    userContent.push({
      type: "text",
      text: `Проанализируй приведённые материалы и запиши профиль через инструмент ${methodology.analyzeTool.name}.`,
    });

    const client = getClient();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: methodology.analyzeSystemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [methodology.analyzeTool],
      tool_choice: { type: "tool", name: methodology.analyzeTool.name },
      messages: [{ role: "user", content: userContent }],
    });

    const toolUse = response.content.find(
      (b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use",
    );

    if (!toolUse) {
      return NextResponse.json(
        { error: "Модель не вернула профиль" },
        { status: 502 },
      );
    }

    const data = toolUse.input as ProfileData;

    return NextResponse.json(
      {
        profile: {
          methodology_id: methodologyId,
          data,
          created_at: new Date().toISOString(),
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Ошибка анализа: ${message}` },
      { status: 500 },
    );
  }
}
