import type { MethodologySpec } from "./types";
import { makeAnalyzeTool, makeCompareTool, type AxisDef } from "./shared-schema";

export const BIGFIVE_AXES: AxisDef[] = [
  { key: "openness", ru: "Открытость", en: "Openness", hint: "интерес к новому, любознательность" },
  { key: "conscientiousness", ru: "Добросовестность", en: "Conscientiousness", hint: "организованность, ответственность" },
  { key: "extraversion", ru: "Экстраверсия", en: "Extraversion", hint: "энергия из общения с людьми" },
  { key: "agreeableness", ru: "Доброжелательность", en: "Agreeableness", hint: "склонность к сотрудничеству, доверию" },
  { key: "neuroticism", ru: "Нейротизм", en: "Neuroticism", hint: "эмоциональная нестабильность, тревожность" },
];

const ANALYZE = `Ты — психолог-аналитик, использующий модель Big Five (OCEAN).

Оцени человека по пяти чертам 0–100:
- openness: открытость новому опыту, любознательность, креативность.
- conscientiousness: организованность, дисциплина, надёжность.
- extraversion: энергия из общения, экспрессивность, инициативность.
- agreeableness: сотрудничество, эмпатия, доверие.
- neuroticism: тревожность, перепады настроения, чувствительность к стрессу.

Опирайся на стилистику текста, эмоциональные паттерны, темы. Цитаты дословные.

Отвечай ТОЛЬКО через инструмент record_bigfive_profile.`;

const COMPARE = `Ты оцениваешь совместимость пары по Big Five.

Эмпирические закономерности:
- Большая разница по conscientiousness — частый источник конфликтов о порядке/планировании.
- Высокий neuroticism у обоих усиливает конфликтную динамику.
- Близкая openness важна для долгосрочного интереса друг к другу.
- Extraversion и agreeableness — менее критичны, расхождения часто комплементарны.

Конкретные strengths, risks, conversation_starters. Verdict 2–3 предложения.

Отвечай ТОЛЬКО через инструмент record_bigfive_compatibility.`;

export const bigfive: MethodologySpec = {
  id: "bigfive",
  name: "Big Five (OCEAN)",
  ru: "Большая Пятёрка",
  en: "Big Five (OCEAN)",
  category: "science",
  blurb:
    "5 базовых черт личности: открытость, добросовестность, экстраверсия, доброжелательность, нейротизм. Самая исследованная модель в современной психологии.",
  blurbEn:
    "5 core personality traits: openness, conscientiousness, extraversion, agreeableness, neuroticism. The most researched model in modern psychology.",
  analyzeSystemPrompt: ANALYZE,
  analyzeTool: makeAnalyzeTool(
    BIGFIVE_AXES,
    "record_bigfive_profile",
    "Записать профиль личности по Big Five",
  ),
  compareSystemPrompt: COMPARE,
  compareTool: makeCompareTool(
    BIGFIVE_AXES,
    "record_bigfive_compatibility",
    "Записать отчёт о совместимости по Big Five",
  ),
};
