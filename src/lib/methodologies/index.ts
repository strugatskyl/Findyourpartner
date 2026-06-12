import { attachment } from "./attachment";
import { astro } from "./astro";
import { bigfive } from "./bigfive";
import { ATTACHMENT_AXES } from "./attachment";
import { ASTRO_AXES } from "./astro";
import { BIGFIVE_AXES } from "./bigfive";
import { mft, MFT_AXES } from "./mft";
import type { AxisDef } from "./shared-schema";
import type { MethodologySpec } from "./types";
import { zohar, ZOHAR_AXES } from "./zohar";

export const METHODOLOGIES: MethodologySpec[] = [
  mft,
  bigfive,
  attachment,
  zohar,
  astro,
];

const AXES_BY_ID: Record<string, AxisDef[]> = {
  mft: MFT_AXES,
  bigfive: BIGFIVE_AXES,
  attachment: ATTACHMENT_AXES,
  zohar: ZOHAR_AXES,
  astro: ASTRO_AXES,
};

export function getMethodology(id: string): MethodologySpec | undefined {
  return METHODOLOGIES.find((m) => m.id === id);
}

export function getAxes(id: string): AxisDef[] {
  return AXES_BY_ID[id] ?? [];
}

export function getAxisLabel(methodologyId: string, axisKey: string): string {
  const axes = getAxes(methodologyId);
  return axes.find((a) => a.key === axisKey)?.ru ?? axisKey;
}
