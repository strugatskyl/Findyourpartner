"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ru" | "en";

const STORAGE_KEY = "fyp_lang";

const DICT = {
  ru: {
    // landing
    tagline: "Совместимость пары через {n} методологий — от научной психологии до Каббалы.",
    howItWorks: "Как это работает",
    step1: "Загружаете свои тексты, переписки, скриншоты сообщений — ИИ строит ваш профиль.",
    step2: "Выбираете «линзу»: Moral Foundations, Big Five, стили привязанности, 10 сфирот Зоар или астро-вайб.",
    step3: "Загружаете тексты партнёра — получаете оценку совместимости с конкретными зонами риска и темами для обсуждения.",
    step4: "Хотите сменить призму? Перестройте профиль через другую методологию на тех же текстах.",
    start: "Начать →",
    privacyTitle: "Что с приватностью",
    privacyText:
      "Ваши тексты и переписки уходят только в Anthropic Claude API для анализа и не сохраняются на наших серверах. Профиль живёт только в вашем браузере (IndexedDB) — кнопка «Очистить» на странице профиля удаляет его.",
    // common
    backHome: "← На главную",
    toMyProfile: "← К моему профилю",
    // profile page
    myProfile: "Мой профиль",
    changeMethodology: "← Сменить методологию ({m})",
    pickLensText:
      "Выберите «линзу», через которую ИИ будет смотреть на ваши тексты. Можно построить несколько профилей в разных методологиях.",
    uploadHint:
      "Загрузите ваши собственные тексты или сообщения. Чем больше материала — тем точнее анализ. Минимум ~300 слов или несколько скриншотов.",
    buildProfile: "Построить мой профиль",
    selfPlaceholder: "Вставьте свои сообщения, эссе, посты, переписки…",
    yourProfile: "Ваш профиль",
    checkCompat: "Проверить совместимость →",
    clearData: "Очистить мои данные",
    confirmClear: "Удалить ВСЕ ваши профили из браузера?",
    recreateProfile: "Пересоздать профиль на новых текстах",
    reanalyze: "Проанализировать заново",
    // compare page
    compatTitle: "Совместимость",
    whichLens: "Через какую призму смотрим?",
    lensOnlyBuilt:
      "Сравнение работает только в методологиях, через которые вы уже построили свой профиль.",
    firstProfileTitle: "Сначала ваш профиль",
    firstProfileText:
      "Чтобы сравнить кого-то с вами, сначала постройте хотя бы один собственный профиль.",
    createProfile: "Создать мой профиль →",
    partnerHint:
      "Загрузите тексты или скриншоты переписок партнёра. ИИ построит его профиль через ту же призму и сравнит с вашим.",
    analyzeCompare: "Проанализировать и сравнить",
    partnerPlaceholder: "Вставьте сюда тексты партнёра…",
    checkAnother: "Проверить другого человека",
    you: "Вы",
    partner: "Партнёр",
    // upload
    defaultPlaceholder: "Вставьте сюда тексты, переписки, сообщения…",
    fileBtn: "📎 Файл (.txt / фото)",
    cameraBtn: "📷 Снять переписку",
    analyzing: "Анализирую…",
    analyze: "Анализировать",
    remove: "Удалить",
    // profile card
    quotes: "Цитаты-обоснования ({n})",
    // report
    compatibility: "Совместимость",
    via: "через {m}",
    byAxes: "По осям",
    strengths: "Сильные стороны",
    risks: "Зоны риска",
    talkAbout: "О чём поговорить",
    // methodology picker
    catScience: "Научно",
    catPsychology: "Психология",
    catMysticism: "Мистика",
    needFirstProfile: "Сначала постройте свой профиль через эту методологию",
    // errors
    unknownError: "Неизвестная ошибка",
    errorGeneric: "Ошибка",
    compareError: "Ошибка сравнения",
  },
  en: {
    // landing
    tagline: "Couple compatibility through {n} methodologies — from scientific psychology to Kabbalah.",
    howItWorks: "How it works",
    step1: "Upload your own texts, chats, message screenshots — the AI builds your profile.",
    step2: "Pick a lens: Moral Foundations, Big Five, attachment styles, the 10 sefirot of the Zohar, or astro-vibe.",
    step3: "Upload your partner's texts — get a compatibility score with concrete risk zones and topics to discuss.",
    step4: "Want a different prism? Rebuild your profile through another methodology on the same texts.",
    start: "Get started →",
    privacyTitle: "What about privacy",
    privacyText:
      "Your texts and chats go only to the Anthropic Claude API for analysis and are never stored on our servers. The profile lives only in your browser (IndexedDB) — the Clear button on the profile page deletes it.",
    // common
    backHome: "← Home",
    toMyProfile: "← To my profile",
    // profile page
    myProfile: "My profile",
    changeMethodology: "← Change methodology ({m})",
    pickLensText:
      "Choose the lens the AI will use to read your texts. You can build several profiles in different methodologies.",
    uploadHint:
      "Upload your own texts or messages. The more material, the more accurate the analysis. Minimum ~300 words or a few screenshots.",
    buildProfile: "Build my profile",
    selfPlaceholder: "Paste your messages, essays, posts, chats…",
    yourProfile: "Your profile",
    checkCompat: "Check compatibility →",
    clearData: "Clear my data",
    confirmClear: "Delete ALL your profiles from this browser?",
    recreateProfile: "Rebuild profile on new texts",
    reanalyze: "Re-analyze",
    // compare page
    compatTitle: "Compatibility",
    whichLens: "Which prism are we looking through?",
    lensOnlyBuilt:
      "Comparison only works in methodologies where you have already built your own profile.",
    firstProfileTitle: "Your profile first",
    firstProfileText:
      "To compare someone with you, first build at least one profile of your own.",
    createProfile: "Create my profile →",
    partnerHint:
      "Upload your partner's texts or chat screenshots. The AI will build their profile through the same prism and compare it with yours.",
    analyzeCompare: "Analyze and compare",
    partnerPlaceholder: "Paste your partner's texts here…",
    checkAnother: "Check another person",
    you: "You",
    partner: "Partner",
    // upload
    defaultPlaceholder: "Paste texts, chats, messages here…",
    fileBtn: "📎 File (.txt / photo)",
    cameraBtn: "📷 Snap a chat",
    analyzing: "Analyzing…",
    analyze: "Analyze",
    remove: "Remove",
    // profile card
    quotes: "Supporting quotes ({n})",
    // report
    compatibility: "Compatibility",
    via: "via {m}",
    byAxes: "By axes",
    strengths: "Strengths",
    risks: "Risk zones",
    talkAbout: "Things to talk about",
    // methodology picker
    catScience: "Science",
    catPsychology: "Psychology",
    catMysticism: "Mysticism",
    needFirstProfile: "Build your own profile through this methodology first",
    // errors
    unknownError: "Unknown error",
    errorGeneric: "Error",
    compareError: "Comparison error",
  },
} as const;

export type DictKey = keyof (typeof DICT)["ru"];

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ru" || saved === "en") {
      setLangState(saved);
    } else if (navigator.language && !navigator.language.startsWith("ru")) {
      setLangState("en");
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  function t(key: DictKey, vars?: Record<string, string | number>): string {
    let s: string = DICT[lang][key] ?? DICT.ru[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replaceAll(`{${k}}`, String(v));
      }
    }
    return s;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
