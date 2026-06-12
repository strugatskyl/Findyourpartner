import type { MethodologySpec } from "./types";
import { makeAnalyzeTool, makeCompareTool, type AxisDef } from "./shared-schema";

export const MFT_AXES: AxisDef[] = [
  { key: "care", ru: "Забота", en: "Care", hint: "эмпатия, защита уязвимых" },
  { key: "fairness", ru: "Справедливость", en: "Fairness", hint: "равенство, взаимность" },
  { key: "loyalty", ru: "Лояльность", en: "Loyalty", hint: "приверженность «своим»" },
  { key: "authority", ru: "Авторитет", en: "Authority", hint: "уважение к традиции, опыту" },
  { key: "sanctity", ru: "Чистота", en: "Sanctity", hint: "телесная/духовная чистота, святыни" },
  { key: "liberty", ru: "Свобода", en: "Liberty", hint: "автономия, неприятие принуждения" },
];

const ANALYZE = `Ты — психолог-аналитик, специализирующийся на Moral Foundations Theory (Дж. Хайдт).

Построй «моральный профиль» человека по шести основаниям:
- care: чуткость к страданию, эмпатия.
- fairness: справедливость, взаимность, нарушение договорённостей.
- loyalty: приверженность «своим» — семье, группе, друзьям.
- authority: уважение к традициям, иерархии, опыту.
- sanctity: отвращение к «грязному», святыни.
- liberty: неприятие принуждения, ценность автономии.

Опирайся на лексику, эмоциональные реакции, повторяющиеся темы, то что человек защищает и то что осуждает. Цитаты обязательно дословные. Если данных мало — отрази это в summary, но всё равно дай оценки.

Отвечай ТОЛЬКО через инструмент record_mft_profile.`;

const COMPARE = `Ты — психолог-аналитик, оценивающий совместимость пары по Moral Foundations Theory.

Сравни два профиля по шести основаниям. delta = partner - self. Большая разница по sanctity, authority, liberty часто становится источником затяжных конфликтов; близкие care и fairness — сильный позитивный фактор.

Сформулируй 3–5 strengths, 3–5 конкретных risks (сценарии, не общие слова), 3–5 conversation_starters. Verdict 2–3 предложения.

Отвечай ТОЛЬКО через инструмент record_mft_compatibility.`;

export const mft: MethodologySpec = {
  id: "mft",
  name: "Moral Foundations Theory",
  ru: "Моральные основания (Хайдт)",
  en: "Moral Foundations (Haidt)",
  category: "science",
  blurb:
    "Совместимость через 6 моральных оснований по Дж. Хайдту: забота, справедливость, лояльность, авторитет, чистота, свобода.",
  blurbEn:
    "Compatibility through J. Haidt's 6 moral foundations: care, fairness, loyalty, authority, sanctity, liberty.",
  questions: {
    ru: [
      "Вспомните случай, когда чьё-то страдание — человека или животного — сильно вас задело. Что вы почувствовали и что сделали?",
      "Что вас сильнее всего возмущает в поведении других людей? Опишите последний случай, когда вы столкнулись с несправедливостью.",
      "Кто для вас «свои»? Что вы готовы сделать ради них такого, чего не сделаете ради чужих?",
      "Как вы относитесь к правилам, которые кажутся вам бессмысленными? Приведите пример из жизни.",
      "Есть ли для вас вещи «святые» — которые нельзя осквернять, высмеивать или продавать? Какие и почему?",
      "Что для вас невыносимее: когда вами командуют — или когда до вас никому нет дела? Расскажите почему.",
      "Опишите поступок, которым гордитесь, и поступок, за который до сих пор стыдно.",
    ],
    en: [
      "Recall a time when someone's suffering — a person's or an animal's — really got to you. What did you feel and what did you do?",
      "What outrages you most in other people's behavior? Describe the last time you faced unfairness.",
      "Who counts as 'your people'? What would you do for them that you wouldn't do for strangers?",
      "How do you treat rules that seem pointless to you? Give a real-life example.",
      "Are there things you consider sacred — that must not be desecrated, mocked, or sold? Which ones, and why?",
      "Which is more unbearable: being ordered around — or nobody caring about you at all? Tell us why.",
      "Describe one act you're proud of and one you're still ashamed of.",
    ],
  },
  analyzeSystemPrompt: ANALYZE,
  analyzeTool: makeAnalyzeTool(
    MFT_AXES,
    "record_mft_profile",
    "Записать моральный профиль по MFT",
  ),
  compareSystemPrompt: COMPARE,
  compareTool: makeCompareTool(
    MFT_AXES,
    "record_mft_compatibility",
    "Записать отчёт о совместимости по MFT",
  ),
};
