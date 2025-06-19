import { PRESERVE_KEYS, STORAGE_KEYS } from "../utils/constants";

export class SessionService {
 static setFlag(key: string, value: string = "true"): void {
  sessionStorage.setItem(key, value);
 }

 static getFlag(key: string): string | null {
  return sessionStorage.getItem(key);
 }

 static hasFlag(key: string): boolean {
  return !!this.getFlag(key);
 }

 static removeFlag(key: string): void {
  sessionStorage.removeItem(key);
 }
 static clearAllFlags(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
   this.removeFlag(key);
   this.removeFlag(key + "_refreshed");
  });
 }

 static clearInjectedLocalStorage(): void {
  try {
   const keysToRemove: string[] = [];

   for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !this.shouldPreserveKey(key)) {
     keysToRemove.push(key);
    }
   }

   keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
   // Error clearing localStorage
  }
 }

 private static shouldPreserveKey(key: string): boolean {
  return PRESERVE_KEYS.some((prefix) => key.startsWith(prefix));
 }

 static injectLocalStorage(localStorageData: string): void {
  try {
   const data = JSON.parse(localStorageData);
   Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, String(value));
   });
  } catch (error) {
   // Error injecting localStorage
   throw error;
  }
 }
}
