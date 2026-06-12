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
  questions: {
    ru: [
      "Как выглядят ваши идеальные выходные? Что новое вы попробовали за последний год?",
      "Опишите ваш типичный план на день. Что происходит внутри вас, когда план срывается?",
      "После шумной вечеринки вы чувствуете прилив сил или опустошение? Опишите подробнее.",
      "Вспомните последний конфликт с близким человеком. Как вы себя вели и что чувствовали?",
      "Что вас тревожит по ночам? Как часто это случается и как вы с этим справляетесь?",
      "Что друзья сказали бы о вас за глаза — и хорошее, и то, что их раздражает?",
      "Чем вы занимаетесь, когда никто не видит и ничего не надо делать?",
    ],
    en: [
      "What does your ideal weekend look like? What new thing have you tried in the past year?",
      "Describe your typical daily plan. What happens inside you when the plan falls apart?",
      "After a loud party, do you feel energized or drained? Describe it in detail.",
      "Recall your last conflict with someone close. How did you behave and what did you feel?",
      "What keeps you up at night? How often does it happen and how do you cope?",
      "What would your friends say about you behind your back — both the good and what annoys them?",
      "What do you do when no one is watching and nothing needs to be done?",
    ],
  },
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
