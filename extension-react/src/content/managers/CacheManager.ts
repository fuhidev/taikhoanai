import { UserData } from "../types";
import { INTERVALS } from "../utils/constants";

export class CacheManager {
 private static cache: UserData | null = null;
 private static lastFetch = 0;

 static async get(forceRefresh = false): Promise<UserData> {
  const now = Date.now();
  const isCacheValid =
   this.cache && now - this.lastFetch < INTERVALS.CACHE_DURATION;
  if (!forceRefresh && isCacheValid) {
   return this.cache!;
  }

  const response = await this.fetchUserData();

  if (response.success) {
   this.cache = response;
   this.lastFetch = now;
  }

  return response;
 }

 private static fetchUserData(): Promise<UserData> {
  return new Promise((resolve) => {
   chrome.runtime.sendMessage({ type: "GET_USER_DATA" }, resolve);
  });
 }
 static invalidate(): void {
  this.cache = null;
  this.lastFetch = 0;
 }
}
