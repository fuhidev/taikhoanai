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
  console.log("Clearing user data and notifying content scripts...");

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
      console.warn("Invalid website URL:", access.website);
      return null;
     }
    })
    .filter((domain: string | null) => domain !== null);

   console.log("Domains to clean cookies for:", domainsToClean);
  }

  // Clear local storage
  await chrome.storage.local.remove("userData");

  // Get all tabs to notify them
  try {
   const tabs = await chrome.tabs.query({});
   console.log("Found tabs to notify:", tabs.length);

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
       console.log("Clearing cookies for domain:", tabUrl.hostname);
       await chrome.tabs.sendMessage(tab.id, {
        type: "CLEAR_COOKIES",
        data: { domain: tabUrl.hostname },
       });
      }
     } catch (tabError) {
      // Ignore errors - some tabs might not have our content script
      console.log("Could not notify tab:", tab.id, tabError);
     }
    }
   }
  } catch (error) {
   console.warn("Could not notify content scripts of logout:", error);
  }

  console.log("User data cleared and logout notifications sent");
 }

 static async isLoginValid(userData: StoredUserData): Promise<boolean> {
  const loginAge = Date.now() - userData.loginTime;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  return loginAge < maxAge;
 }
}
