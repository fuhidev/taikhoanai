import { StoredUserData } from "./types";

export class StorageService {
 static async setUserData(userData: StoredUserData): Promise<void> {
  await chrome.storage.local.set({ userData });
 }

 static async getUserData(): Promise<StoredUserData | null> {
  const result = await chrome.storage.local.get("userData");
  return result.userData || null;
 }

 static async clearUserData(): Promise<void> {
  await chrome.storage.local.remove("userData");
 }

 static async isLoginValid(userData: StoredUserData): Promise<boolean> {
  const loginAge = Date.now() - userData.loginTime;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  return loginAge < maxAge;
 }
}
