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
