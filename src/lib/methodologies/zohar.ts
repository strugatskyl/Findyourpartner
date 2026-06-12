import type { MethodologySpec } from "./types";
import { makeAnalyzeTool, makeCompareTool, type AxisDef } from "./shared-schema";

export const ZOHAR_AXES: AxisDef[] = [
  { key: "keter", ru: "Кетер · Воля", en: "Keter · Will", hint: "высшее намерение, скрытый импульс" },
  { key: "chochmah", ru: "Хохма · Мудрость", en: "Chochmah · Wisdom", hint: "вспышка интуиции, проницание" },
  { key: "binah", ru: "Бина · Понимание", en: "Binah · Understanding", hint: "развёртывание идеи, аналитика" },
  { key: "chesed", ru: "Хесед · Милосердие", en: "Chesed · Kindness", hint: "щедрая отдача, безусловная любовь" },
  { key: "gevurah", ru: "Гвура · Строгость", en: "Gevurah · Severity", hint: "ограничение, дисциплина, граница" },
  { key: "tiferet", ru: "Тиферет · Гармония", en: "Tiferet · Harmony", hint: "равновесие хесед и гвура, красота" },
  { key: "netzach", ru: "Нецах · Стойкость", en: "Netzach · Endurance", hint: "вечность, упорство, движущая сила" },
  { key: "hod", ru: "Ход · Великолепие", en: "Hod · Splendor", hint: "благодарность, смирение, отклик" },
  { key: "yesod", ru: "Йесод · Основание", en: "Yesod · Foundation", hint: "связь, сексуальность, передача" },
  { key: "malchut", ru: "Малхут · Царство", en: "Malchut · Kingdom", hint: "проявление, воплощение в мире" },
];

const ANALYZE = `Ты — толкователь учения каббалистической Книги Зоар. Используй 10 сфирот как ось профиля.

Оцени интенсивность проявления каждой сфиры 0–100 в текстах человека:
- keter: высшая воля, скрытое намерение, ощущение призвания.
- chochmah: вспышки интуиции, неструктурированное знание.
- binah: понимание, развёртывание идеи, материнский анализирующий ум.
- chesed: щедрость, изливающаяся любовь, неограниченная отдача.
- gevurah: дисциплина, граница, способность сказать «нет», справедливая строгость.
- tiferet: гармония, равновесие милосердия и строгости, красота как истина.
- netzach: упорство, движение к цели, способность долго гореть.
- hod: благодарность, смирение, способность принимать.
- yesod: связь с другими, передача, эротическая основа отношений.
- malchut: воплощение, царство — то, как человек проявляется в реальном мире.

Будь поэтичен но конкретен; цитаты дословные. Это мистическая призма — не научная; обозначай это в summary.

Отвечай ТОЛЬКО через инструмент record_zohar_profile.`;

const COMPARE = `Ты сравниваешь двух людей через призму 10 сфирот Зоар.

Каббалистические принципы парности:
- Хесед одного и Гвура другого образуют целостность через Тиферет.
- Нецах и Ход парны: устремление и отклик.
- Йесод — мост близости; асимметрия в нём — слабая физическая связь.
- Малхут обоих — насколько проявлены в мире.
- Кетер общая — есть ли «над парой» общая воля.

Выдай конкретные strengths, risks, conversation_starters. Verdict 2–3 предложения. Тон — серьёзный, не сюсюкающий.

Отвечай ТОЛЬКО через инструмент record_zohar_compatibility.`;

export const zohar: MethodologySpec = {
  id: "zohar",
  name: "Zohar / Sefirot",
  ru: "Зоар: 10 сфирот",
  en: "Zohar: 10 Sefirot",
  category: "mysticism",
  blurb:
    "Древо сфирот из каббалистической Книги Зоар. 10 проявлений божественного света — от высшей воли (Кетер) до воплощения в мире (Малхут). Мистическая призма.",
  blurbEn:
    "The Tree of Sefirot from the kabbalistic Book of Zohar. 10 manifestations of divine light — from supreme will (Keter) to embodiment in the world (Malchut). A mystical prism.",
  questions: {
    ru: [
      "Зачем вы живёте? Не «ради чего стараетесь», а что тянет вас вперёд, когда всё остальное отпадает?",
      "Вспомните момент озарения — когда вы вдруг поняли что-то целиком, без рассуждений. Что это было?",
      "Как вы принимаете трудные решения? Опишите последнее.",
      "Когда вы в последний раз отдали что-то — время, деньги, силы — не ожидая ничего взамен?",
      "Что вы запрещаете — себе и другим? Где проходит ваша граница «нет»?",
      "Какие противоречия вы носите в себе? Как вам удаётся (или не удаётся) с ними жить?",
      "Что вы продолжаете делать, несмотря на усталость и отсутствие видимого результата?",
      "За что вы благодарны — прямо сейчас, сегодня?",
      "Что для вас близость? Когда вы в последний раз чувствовали настоящую связь с человеком?",
      "Опишите ваш дом — не стены, а то, что делает его именно вашим.",
    ],
    en: [
      "Why do you live? Not 'what do you strive for,' but what pulls you forward when everything else falls away?",
      "Recall a moment of insight — when you suddenly understood something whole, without reasoning. What was it?",
      "How do you make hard decisions? Describe the most recent one.",
      "When did you last give something — time, money, strength — expecting nothing in return?",
      "What do you forbid — to yourself and to others? Where does your 'no' boundary run?",
      "What contradictions do you carry inside? How do you manage (or fail) to live with them?",
      "What do you keep doing despite exhaustion and no visible result?",
      "What are you grateful for — right now, today?",
      "What is intimacy to you? When did you last feel a true connection with another person?",
      "Describe your home — not the walls, but what makes it truly yours.",
    ],
  },
  analyzeSystemPrompt: ANALYZE,
  analyzeTool: makeAnalyzeTool(
    ZOHAR_AXES,
    "record_zohar_profile",
    "Записать профиль по 10 сфирот",
  ),
  compareSystemPrompt: COMPARE,
  compareTool: makeCompareTool(
    ZOHAR_AXES,
    "record_zohar_compatibility",
    "Записать отчёт о совместимости через Зоар",
  ),
};
