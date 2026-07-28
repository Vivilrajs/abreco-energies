import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

function getFilePath(collectionName: string): string {
  return path.join(process.cwd(), `local_${collectionName}.json`);
}

export function getLocalItems(collectionName: string): any[] {
  try {
    const filePath = getFilePath(collectionName);
    if (!existsSync(filePath)) {
      return [];
    }
    const content = readFileSync(filePath, "utf8");
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error(`Error reading local ${collectionName} file:`, error);
    return [];
  }
}

export function saveLocalItem(collectionName: string, item: any): any {
  const list = getLocalItems(collectionName);
  const now = new Date().toISOString();
  
  const localId = item._id || "local-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
  
  const newRecord = {
    ...item,
    _id: localId,
    createdAt: now,
    updatedAt: now,
  };
  list.push(newRecord);
  try {
    const filePath = getFilePath(collectionName);
    writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing to local ${collectionName} file:`, error);
  }
  return newRecord;
}

export function updateLocalItem(collectionName: string, id: string, patch: any): any | null {
  const list = getLocalItems(collectionName);
  const index = list.findIndex((item) => item._id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  list[index] = {
    ...list[index],
    ...patch,
    updatedAt: now,
  };

  try {
    const filePath = getFilePath(collectionName);
    writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
    return list[index];
  } catch (error) {
    console.error(`Error updating local ${collectionName} file:`, error);
    return null;
  }
}

export function deleteLocalItem(collectionName: string, id: string): boolean {
  const list = getLocalItems(collectionName);
  const filtered = list.filter((item) => item._id !== id);
  if (list.length === filtered.length) return false;

  try {
    const filePath = getFilePath(collectionName);
    writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error deleting from local ${collectionName} file:`, error);
    return false;
  }
}

// Keep the old exports for backward compatibility
export function getLocalSubmissions() {
  return getLocalItems("submissions");
}
export function saveLocalSubmission(sub: any) {
  return saveLocalItem("submissions", sub);
}
export function updateLocalSubmission(id: string, patch: any) {
  return updateLocalItem("submissions", id, patch);
}
export function deleteLocalSubmission(id: string) {
  return deleteLocalItem("submissions", id);
}

const SETTINGS_FILE_PATH = path.join(process.cwd(), "local_settings.json");

export function getLocalSettings(defaultVal: any): any {
  try {
    if (!existsSync(SETTINGS_FILE_PATH)) {
      return defaultVal;
    }
    const content = readFileSync(SETTINGS_FILE_PATH, "utf8");
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("Error reading local settings file:", error);
    return defaultVal;
  }
}

export function saveLocalSettings(settings: any): any {
  try {
    writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), "utf8");
    return settings;
  } catch (error) {
    console.error("Error writing local settings file:", error);
    return settings;
  }
}
