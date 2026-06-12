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
  questions: {
    ru: [
      "Партнёр не отвечает на сообщения полдня. Что происходит у вас в голове и что вы делаете?",
      "Как заканчивались ваши прошлые значимые отношения — кто уходил и почему?",
      "Что вы чувствуете, когда партнёр говорит: «Нам нужно серьёзно поговорить об отношениях»?",
      "Насколько вам легко просить близкого человека о помощи? Вспомните конкретный случай.",
      "Бывало ли, что партнёр «душил» вас вниманием — или наоборот, был слишком далёким? Где для вас «слишком близко»?",
      "Как вы ведёте себя после сильной ссоры: ищете контакт, ждёте шага от другого, уходите в себя?",
      "Опишите ваши отношения с родителями в детстве — двумя-тремя предложениями, первое, что приходит.",
    ],
    en: [
      "Your partner hasn't replied to messages for half a day. What goes through your head and what do you do?",
      "How did your past significant relationships end — who left and why?",
      "What do you feel when a partner says: 'We need to have a serious talk about us'?",
      "How easy is it for you to ask someone close for help? Recall a specific moment.",
      "Has a partner ever smothered you with attention — or felt too distant? Where is 'too close' for you?",
      "How do you behave after a big fight: seek contact, wait for the other to make a move, withdraw?",
      "Describe your childhood relationship with your parents — two or three sentences, whatever comes first.",
    ],
  },
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
