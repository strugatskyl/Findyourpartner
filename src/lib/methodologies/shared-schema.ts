import type Anthropic from "@anthropic-ai/sdk";

/**
 * Все методологии возвращают анализ в одной общей форме:
 *   - axes: список измерений с оценками 0–100
 *   - summary: связное описание
 *   - quotes: цитаты-обоснования из исходного текста (опционально)
 *
 * Сравнение возвращает:
 *   - overall_score: 0–100
 *   - axis_alignment: расхождения по тем же осям
 *   - strengths / risks / conversation_starters
 *   - verdict
 *
 * Это позволяет иметь общие UI-компоненты и универсальный API,
 * но дозвольно каждой методологии задавать свой набор осей через enum.
 */

export interface AxisDef {
  key: string;
  ru: string;
  hint?: string;
}

export interface ProfileData {
  axes: { key: string; score: number }[];
  summary: string;
  quotes: { axis: string; excerpt: string }[];
}

export interface ReportData {
  overall_score: number;
  axis_alignment: {
    axis: string;
    delta: number;
    interpretation: string;
  }[];
  strengths: string[];
  risks: string[];
  conversation_starters: string[];
  verdict: string;
}

export function makeAnalyzeTool(
  axes: AxisDef[],
  name: string,
  description: string,
): Anthropic.Messages.Tool {
  const axisEnum = axes.map((a) => a.key);
  return {
    name,
    description,
    input_schema: {
      type: "object" as const,
      properties: {
        axes: {
          type: "array",
          description:
            "Оценки 0–100 по каждой оси. Должны присутствовать все оси из enum.",
          items: {
            type: "object",
            properties: {
              key: { type: "string", enum: axisEnum },
              score: { type: "number", minimum: 0, maximum: 100 },
            },
            required: ["key", "score"],
          },
        },
        summary: {
          type: "string",
          description:
            "Связное описание профиля в 3–5 предложениях. По-русски.",
        },
        quotes: {
          type: "array",
          description:
            "Дословные цитаты из текста, обосновывающие оценки. По 1–3 на ось, где есть материал.",
          items: {
            type: "object",
            properties: {
              axis: { type: "string", enum: axisEnum },
              excerpt: { type: "string" },
            },
            required: ["axis", "excerpt"],
          },
        },
      },
      required: ["axes", "summary", "quotes"],
    },
  };
}

export function makeCompareTool(
  axes: AxisDef[],
  name: string,
  description: string,
): Anthropic.Messages.Tool {
  const axisEnum = axes.map((a) => a.key);
  return {
    name,
    description,
    input_schema: {
      type: "object" as const,
      properties: {
        overall_score: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "Общая совместимость 0–100",
        },
        axis_alignment: {
          type: "array",
          items: {
            type: "object",
            properties: {
              axis: { type: "string", enum: axisEnum },
              delta: {
                type: "number",
                description:
                  "value_partner - value_self, от -100 до +100",
              },
              interpretation: { type: "string" },
            },
            required: ["axis", "delta", "interpretation"],
          },
        },
        strengths: {
          type: "array",
          items: { type: "string" },
        },
        risks: {
          type: "array",
          items: { type: "string" },
        },
        conversation_starters: {
          type: "array",
          items: { type: "string" },
        },
        verdict: { type: "string" },
      },
      required: [
        "overall_score",
        "axis_alignment",
        "strengths",
        "risks",
        "conversation_starters",
        "verdict",
      ],
    },
  };
}
