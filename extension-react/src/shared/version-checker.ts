import { StorageService } from "./storage";
import { ProductAccess, StoredUserData } from "./types";

class VersionChecker {
 private currentVersion: string;
 private updateCheckInterval: number = 30 * 60 * 1000; // 30 phút
 private updateDeadline: number = 60 * 60 * 1000; // 1 giờ
 private apiBaseUrl: string = "https://aigiaren.vn/api";

 constructor() {
  this.currentVersion = chrome.runtime.getManifest().version;
 }

 async checkForUpdates(): Promise<void> {
  try {
   const response = await fetch(`${this.apiBaseUrl}/extension/version`);
   const data = await response.json();

   if (this.isNewerVersion(data.version)) {
    await this.handleUpdateRequired(data);
   }
  } catch (error) {
   console.error("Error checking for updates:", error);
  }
 }

 private isNewerVersion(remoteVersion: string): boolean {
  const current = this.currentVersion.split(".").map(Number);
  const remote = remoteVersion.split(".").map(Number);

  for (let i = 0; i < Math.max(current.length, remote.length); i++) {
   const currentPart = current[i] || 0;
   const remotePart = remote[i] || 0;

   if (remotePart > currentPart) return true;
   if (remotePart < currentPart) return false;
  }
  return false;
 }

 private async handleUpdateRequired(updateInfo: any): Promise<void> {
  const updateNotified = await chrome.storage.local.get("updateNotified");

  if (!updateNotified.updateNotified) {
   await chrome.storage.local.set({
    updateNotified: true,
    updateDeadline: Date.now() + this.updateDeadline,
    newVersion: updateInfo.version,
    downloadUrl: updateInfo.downloadUrl,
   });

   this.showUpdateNotification(updateInfo);
   this.startCountdown();
  } else {
   const stored = await chrome.storage.local.get(["updateDeadline"]);
   if (Date.now() > stored.updateDeadline) {
    await this.clearProductAccessData();
    this.showExpiredNotification();
   }
  }
 }

 private async getUserProductAccess(): Promise<ProductAccess[]> {
  try {
   const userData: StoredUserData | null = await StorageService.getUserData();
   return userData?.productAccess || [];
  } catch (error) {
   console.error("Error getting user product access:", error);
   return [];
  }
 }

 private async getDomainsFromProductAccess(
  productAccess: ProductAccess[]
 ): Promise<string[]> {
  const domains = new Set<string>();

  productAccess.forEach((product) => {
   if (product.website) {
    try {
     const url = new URL(product.website);
     domains.add(url.hostname);

     const rootDomain = url.hostname.replace(/^www\./, "");
     domains.add(rootDomain);

     const baseDomain = rootDomain;
     ["www", "app", "admin", "api", "dashboard"].forEach((subdomain) => {
      domains.add(`${subdomain}.${baseDomain}`);
     });
    } catch (err) {
     console.warn("Invalid URL in product access:", product.website);
    }
   }
  });

  return Array.from(domains);
 }

 private async clearProductAccessData(): Promise<void> {
  try {
   const productAccess = await this.getUserProductAccess();

   if (productAccess.length === 0) {
    console.log("No product access found, clearing main domain only");
    await this.clearDomainCookies("aigiaren.vn");
   } else {
    const domains = await this.getDomainsFromProductAccess(productAccess);
    console.log("Clearing cookies for product access domains:", domains);

    for (const domain of domains) {
     await this.clearDomainCookies(domain);
    }
   }

   await StorageService.clearUserData();
   console.log("All product access data cleared due to update deadline");
  } catch (error) {
   console.error("Error clearing product access data:", error);
  }
 }

 private async clearDomainCookies(domain: string): Promise<void> {
  try {
   await this.removeCookiesForDomain(domain);
   await this.removeCookiesForDomain(`.${domain}`);
  } catch (error) {
   console.error(`Error clearing cookies for domain ${domain}:`, error);
  }
 }

 private async removeCookiesForDomain(domain: string): Promise<void> {
  try {
   const cookies = await chrome.cookies.getAll({ domain });

   for (const cookie of cookies) {
    const url = `http${cookie.secure ? "s" : ""}://${domain}${cookie.path}`;
    await chrome.cookies.remove({
     url: url,
     name: cookie.name,
     storeId: cookie.storeId,
    });
   }

   console.log(`Cleared ${cookies.length} cookies for domain: ${domain}`);
  } catch (error) {
   console.error(`Error removing cookies for domain ${domain}:`, error);
  }
 }

 private showUpdateNotification(updateInfo: any): void {
  chrome.notifications.create("update-required", {
   type: "basic",
   iconUrl: "icons/icon48.png",
   title: "Cập nhật Extension Required",
   message: `Phiên bản mới ${updateInfo.version} đã có sẵn. Bạn có 1 giờ để cập nhật.`,
   buttons: [{ title: "Tải xuống ngay" }, { title: "Nhắc tôi sau" }],
  });
 }

 private async startCountdown(): Promise<void> {
  const checkInterval = setInterval(async () => {
   const stored = await chrome.storage.local.get(["updateDeadline"]);
   const timeLeft = stored.updateDeadline - Date.now();

   if (timeLeft <= 0) {
    clearInterval(checkInterval);
    await this.clearProductAccessData();
    this.showExpiredNotification();
   } else if (timeLeft <= 15 * 60 * 1000) {
    this.showWarningNotification(Math.ceil(timeLeft / 60000));
   }
  }, 5 * 60 * 1000);
 }

 private showWarningNotification(minutesLeft: number): void {
  chrome.notifications.create("update-warning", {
   type: "basic",
   iconUrl: "icons/icon48.png",
   title: "Cảnh báo: Sắp hết hạn cập nhật",
   message: `Còn ${minutesLeft} phút để cập nhật extension. Sau đó sẽ xóa dữ liệu truy cập.`,
  });
 }

 private showExpiredNotification(): void {
  chrome.notifications.create("update-expired", {
   type: "basic",
   iconUrl: "icons/icon48.png",
   title: "Extension đã bị vô hiệu hóa",
   message:
    "Dữ liệu truy cập đã bị xóa do không cập nhật đúng hạn. Vui lòng cập nhật extension.",
   requireInteraction: true,
  });
 }
}

export const versionChecker = new VersionChecker();
