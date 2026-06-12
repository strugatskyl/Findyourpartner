"use client";

import { openDB, type IDBPDatabase } from "idb";
import type { ProfileData, ReportData } from "./methodologies/shared-schema";

const DB_NAME = "fyp";
const STORE = "profiles";
const VERSION = 1;

export interface StoredProfile {
  methodology_id: string;
  data: ProfileData;
  created_at: string;
  label?: string;
}

export interface StoredReport {
  methodology_id: string;
  data: ReportData;
  created_at: string;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      },
    });
  }
  return dbPromise;
}

function key(role: "me" | "partner", methodologyId: string) {
  return `${role}:${methodologyId}`;
}

export async function saveProfile(
  role: "me" | "partner",
  methodologyId: string,
  profile: StoredProfile,
): Promise<void> {
  const db = await getDB();
  await db.put(STORE, profile, key(role, methodologyId));
}

export async function loadProfile(
  role: "me" | "partner",
  methodologyId: string,
): Promise<StoredProfile | null> {
  const db = await getDB();
  const result = await db.get(STORE, key(role, methodologyId));
  return result ?? null;
}

export async function listMyMethodologies(): Promise<string[]> {
  const db = await getDB();
  const keys = (await db.getAllKeys(STORE)) as string[];
  return keys
    .filter((k) => k.startsWith("me:"))
    .map((k) => k.slice("me:".length));
}

export async function deleteProfile(
  role: "me" | "partner",
  methodologyId: string,
): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, key(role, methodologyId));
}

export async function saveReport(
  methodologyId: string,
  report: StoredReport,
): Promise<void> {
  const db = await getDB();
  await db.put(STORE, report, `report:${methodologyId}`);
}

export async function loadReport(
  methodologyId: string,
): Promise<StoredReport | null> {
  const db = await getDB();
  const result = await db.get(STORE, `report:${methodologyId}`);
  return result ?? null;
}

export async function deleteReport(methodologyId: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, `report:${methodologyId}`);
}

export async function clearAll(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE);
}
