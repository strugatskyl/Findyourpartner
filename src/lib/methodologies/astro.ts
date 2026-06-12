import type { MethodologySpec } from "./types";
import { makeAnalyzeTool, makeCompareTool, type AxisDef } from "./shared-schema";

export const ASTRO_AXES: AxisDef[] = [
  { key: "fire", ru: "Огонь · Овен/Лев/Стрелец", en: "Fire · Aries/Leo/Sagittarius", hint: "инициатива, страсть, действие" },
  { key: "earth", ru: "Земля · Телец/Дева/Козерог", en: "Earth · Taurus/Virgo/Capricorn", hint: "практичность, тело, ресурс" },
  { key: "air", ru: "Воздух · Близнецы/Весы/Водолей", en: "Air · Gemini/Libra/Aquarius", hint: "идеи, общение, концепции" },
  { key: "water", ru: "Вода · Рак/Скорпион/Рыбы", en: "Water · Cancer/Scorpio/Pisces", hint: "чувства, интуиция, глубина" },
  { key: "cardinal", ru: "Кардинальная · начало", en: "Cardinal · initiation", hint: "запуск, инициация цикла" },
  { key: "fixed", ru: "Фиксированная · удержание", en: "Fixed · holding", hint: "стабильность, упорство" },
  { key: "mutable", ru: "Мутабельная · изменение", en: "Mutable · change", hint: "адаптация, трансформация" },
];

const ANALYZE = `Ты — астролог-консультант. По текстам человека определи интенсивность стихий и качеств (без даты рождения — только по стилистике и темам).

Оцени 0–100:
- fire: инициатива, страсть, желание действовать.
- earth: практичность, фокус на теле и материи, ресурсность.
- air: интерес к идеям, общению, концепциям.
- water: эмоциональность, интуиция, глубина переживания.
- cardinal: способность начинать новое, инициировать.
- fixed: способность удерживать, стабильность, упорство.
- mutable: гибкость, адаптация, трансформация.

Это вайбовая, не натальная астрология — без точных знаков. В summary упомяни 1–2 знака зодиака, которые ярче всего «звучат» в текстах. Цитаты дословные.

Отвечай ТОЛЬКО через инструмент record_astro_profile.`;

const COMPARE = `Ты оцениваешь совместимость пары через стихии и качества.

Принципы:
- Огонь + Воздух — питают друг друга (страсть + идеи).
- Земля + Вода — питают (тело + чувства).
- Огонь + Вода — пар: страсть и слёзы вперемешку.
- Земля + Воздух — расхождение скоростей: один медленный, второй быстрый.
- Кардинальная + Фиксированная — двигатель и якорь.
- Две Мутабельных — пара без формы; нужен внешний якорь.

Выдай strengths, risks, conversation_starters. Verdict — поэтичный, но конкретный (2–3 предложения).

Отвечай ТОЛЬКО через инструмент record_astro_compatibility.`;

export const astro: MethodologySpec = {
  id: "astro",
  name: "Astrological Vibe",
  ru: "Астро-вайб",
  en: "Astro Vibe",
  category: "mysticism",
  blurb:
    "Стихии (огонь, земля, воздух, вода) и качества (кардинальная, фиксированная, мутабельная) — без даты рождения, по стилю и темам ваших текстов.",
  blurbEn:
    "Elements (fire, earth, air, water) and modalities (cardinal, fixed, mutable) — no birth date needed, inferred from the style and themes of your texts.",
  questions: {
    ru: [
      "Что вас зажигает? После чего вы не можете уснуть от возбуждения?",
      "Как вы относитесь к деньгам, телу, еде? Что из этого удовольствие, а что — обязанность?",
      "О чём вы можете говорить часами? С кем и когда это было в последний раз?",
      "Когда вы в последний раз плакали и почему?",
      "Вспомните, что вы начинали с нуля. Как это было и что вас толкнуло?",
      "Что вы делаете дольше всего в жизни, не бросая? Почему именно это?",
      "Как вы переносите внезапные перемены планов? Опишите последний случай.",
    ],
    en: [
      "What sets you on fire? After what can't you fall asleep from excitement?",
      "How do you relate to money, body, food? Which of these is pleasure, and which is duty?",
      "What can you talk about for hours? With whom, and when was the last time?",
      "When did you last cry, and why?",
      "Recall something you started from scratch. How was it, and what pushed you?",
      "What have you been doing the longest in your life without quitting? Why that?",
      "How do you handle sudden changes of plans? Describe the most recent case.",
    ],
  },
  analyzeSystemPrompt: ANALYZE,
  analyzeTool: makeAnalyzeTool(
    ASTRO_AXES,
    "record_astro_profile",
    "Записать астро-профиль по стихиям",
  ),
  compareSystemPrompt: COMPARE,
  compareTool: makeCompareTool(
    ASTRO_AXES,
    "record_astro_compatibility",
    "Записать астрологический отчёт о совместимости",
  ),
};
