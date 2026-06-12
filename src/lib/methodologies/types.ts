import type Anthropic from "@anthropic-ai/sdk";

export type Category = "science" | "psychology" | "mysticism";

export interface MethodologySpec {
  id: string;
  name: string;
  ru: string;
  en: string;
  category: Category;
  blurb: string;
  blurbEn: string;
  analyzeSystemPrompt: string;
  analyzeTool: Anthropic.Messages.Tool;
  compareSystemPrompt: string;
  compareTool: Anthropic.Messages.Tool;
}

export interface StoredProfile {
  methodology_id: string;
  data: unknown;
  created_at: string;
  label?: string;
}

export interface StoredReport {
  methodology_id: string;
  data: unknown;
  created_at: string;
}
