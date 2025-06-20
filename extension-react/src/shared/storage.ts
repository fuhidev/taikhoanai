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
  // Get user data first to get all domains that need cleanup
  const userData = await this.getUserData();
  let domainsToClean: string[] = [];

  if (userData && userData.productAccess) {
   // Extract all domains from user's product access
   domainsToClean = userData.productAccess
    .map((access: any) => {
     try {
      return new URL(access.website).hostname;
     } catch (err) {
      return null;
     }
    })
    .filter((domain: string | null) => domain !== null);
  }

  // Clear local storage
  await chrome.storage.local.remove("userData");

  // Get all tabs to notify them
  try {
   const tabs = await chrome.tabs.query({});

   for (const tab of tabs) {
    if (tab.id && tab.url) {
     try {
      // Send logout message to content script
      await chrome.tabs.sendMessage(tab.id, {
       type: "USER_LOGGED_OUT",
      });

      // Check if this tab's domain is in user's product access
      const tabUrl = new URL(tab.url);
      if (domainsToClean.includes(tabUrl.hostname)) {
       await chrome.tabs.sendMessage(tab.id, {
        type: "CLEAR_COOKIES",
        data: { domain: tabUrl.hostname },
       });
      }
     } catch (tabError) {
      // Ignore errors - some tabs might not have our content script
     }
    }
   }
  } catch (error) {
   // Could not notify content scripts of logout
  }
 }

 // New method to notify all tabs about access changes
 static async notifyAccessRevoked(revokedDomains: string[]): Promise<void> {
  try {
   const tabs = await chrome.tabs.query({});

   for (const tab of tabs) {
    if (tab.id && tab.url) {
     try {
      const tabUrl = new URL(tab.url);
      if (revokedDomains.includes(tabUrl.hostname)) {
       await chrome.tabs.sendMessage(tab.id, {
        type: "ACCESS_REVOKED",
        data: { domain: tabUrl.hostname },
       });
      }
     } catch (tabError) {
      // Could not notify tab
     }
    }
   }
  } catch (error) {
   // Could not notify content scripts of access revocation
  }
 }

 static async isLoginValid(userData: StoredUserData): Promise<boolean> {
  const loginAge = Date.now() - userData.loginTime;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  return loginAge < maxAge;
 }
}
