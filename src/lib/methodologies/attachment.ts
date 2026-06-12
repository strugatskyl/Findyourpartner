import type { MethodologySpec } from "./types";
import { makeAnalyzeTool, makeCompareTool, type AxisDef } from "./shared-schema";

export const ATTACHMENT_AXES: AxisDef[] = [
  { key: "secure", ru: "Надёжный", en: "Secure", hint: "комфорт с близостью и автономией" },
  { key: "anxious", ru: "Тревожный", en: "Anxious", hint: "страх отвержения, поглощение партнёром" },
  { key: "avoidant", ru: "Избегающий", en: "Avoidant", hint: "дистанция, недоверие к близости" },
  { key: "disorganized", ru: "Дезорганизованный", en: "Disorganized", hint: "хочу — боюсь близости" },
];

const ANALYZE = `Ты — психолог, специалист по теории привязанности (Боулби, Эйнсворт, Шейвер).

Оцени долю каждого стиля привязанности 0–100 (это не вероятность, а интенсивность проявлений):
- secure: открыт к близости, доверяет, спокойно переносит разлуку и расхождения.
- anxious (тревожный): постоянная проверка отношений, страх отвержения, желание полного слияния.
- avoidant (избегающий): держит дистанцию, сворачивает разговор о чувствах, ценит независимость избыточно.
- disorganized: хочет близости и боится её одновременно; противоречивые сигналы; следы травмы.

Маркеры: реакции на разлуку и конфликт, метафоры близости, степень самораскрытия, отношение к зависимости от другого, тон при упоминании прошлых отношений.

Цитаты дословные. Если данных мало — отрази в summary, но оценки дай.

Отвечай ТОЛЬКО через инструмент record_attachment_profile.`;

const COMPARE = `Ты оцениваешь совместимость пары через призму стилей привязанности.

Ключевые динамики:
- Anxious + Avoidant — самый разрушительный паттерн: «тревожный преследует, избегающий отстраняется».
- Secure + Anyone — стабилизирующий эффект.
- Disorganized с любым стилем — требует терапевтической поддержки.
- Близкие профили облегчают понимание, но не гарантируют здоровья.

Сформулируй конкретные strengths, risks (опиши сценарии, не общие слова), conversation_starters. Verdict 2–3 предложения.

Отвечай ТОЛЬКО через инструмент record_attachment_compatibility.`;

export const attachment: MethodologySpec = {
  id: "attachment",
  name: "Attachment Styles",
  ru: "Стили привязанности",
  en: "Attachment Styles",
  category: "psychology",
  blurb:
    "Как человек ведёт себя в близости: надёжно, тревожно, избегающе или дезорганизованно. Лучшая призма для динамики отношений.",
  blurbEn:
    "How a person behaves in intimacy: secure, anxious, avoidant, or disorganized. The best prism for relationship dynamics.",
  analyzeSystemPrompt: ANALYZE,
  analyzeTool: makeAnalyzeTool(
    ATTACHMENT_AXES,
    "record_attachment_profile",
    "Записать профиль стилей привязанности",
  ),
  compareSystemPrompt: COMPARE,
  compareTool: makeCompareTool(
    ATTACHMENT_AXES,
    "record_attachment_compatibility",
    "Записать отчёт о совместимости через привязанность",
  ),
};
