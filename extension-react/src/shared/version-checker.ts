import { StorageService } from "./storage";
import { ProductAccess, StoredUserData } from "./types";

export interface VersionInfo {
 version: string;
 downloadUrl: string;
 releaseNotes: string;
 required: boolean; // forceUpdate từ API
 publishedAt: string;
}

class VersionChecker {
 private currentVersion: string;
 private updateCheckInterval: number = 30 * 60 * 1000; // 30 phút
 private updateDeadline: number = 60 * 60 * 1000; // 1 giờ
 private apiBaseUrl: string;

 constructor() {
  this.currentVersion = chrome.runtime.getManifest().version;

  // Sử dụng environment variable với fallback
  this.apiBaseUrl =
   import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  console.log("VersionChecker using API base URL:", this.apiBaseUrl);
 }
 async checkForUpdates(): Promise<void> {
  try {
   console.log("Checking for updates...");

   const response = await fetch(`${this.apiBaseUrl}/extension/version`);

   if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
   }

   const versionInfo: VersionInfo = await response.json();

   console.log("Current version:", this.currentVersion);
   console.log("Latest version:", versionInfo.version);
   console.log("Force update required:", versionInfo.required);

   // So sánh version
   if (this.isNewerVersion(versionInfo.version)) {
    // Lưu thông tin update
    await chrome.storage.local.set({
     updateAvailable: true,
     updateInfo: versionInfo,
    });

    if (versionInfo.required) {
     // Force update - vô hiệu hóa ngay lập tức
     await this.handleForceUpdate(versionInfo);
    } else {
     // Optional update - hiển thị thông báo tùy chọn
     await this.handleOptionalUpdate(versionInfo);
    }
   } else {
    console.log("Extension is up to date");
    // Xóa thông tin update cũ
    await chrome.storage.local.remove([
     "updateAvailable",
     "updateInfo",
     "extensionDisabled",
    ]);
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

 private async handleForceUpdate(versionInfo: VersionInfo): Promise<void> {
  console.log("Force update required, disabling extension features");

  // Vô hiệu hóa extension ngay lập tức
  await this.disableExtensionFeatures();

  // Hiển thị thông báo bắt buộc
  this.showForceUpdateNotification(versionInfo);
 }

 private async handleOptionalUpdate(versionInfo: VersionInfo): Promise<void> {
  console.log("Optional update available");

  // Hiển thị thông báo tùy chọn
  this.showOptionalUpdateNotification(versionInfo);

  // Bắt đầu countdown cho update tùy chọn (nếu muốn)
  await this.handleUpdateRequired(versionInfo);
 }

 async disableExtensionFeatures(): Promise<void> {
  // Đánh dấu extension bị vô hiệu hóa
  await chrome.storage.local.set({
   extensionDisabled: true,
   disableReason: "force_update_required",
  });

  // Thông báo tất cả content scripts
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
   if (tab.id) {
    chrome.tabs
     .sendMessage(tab.id, {
      type: "EXTENSION_DISABLED",
      reason: "force_update_required",
     })
     .catch(() => {
      // Ignore errors for tabs without content scripts
     });
   }
  }
 }

 async enableExtensionFeatures(): Promise<void> {
  await chrome.storage.local.remove(["extensionDisabled", "disableReason"]);

  // Thông báo tất cả content scripts
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
   if (tab.id) {
    chrome.tabs
     .sendMessage(tab.id, {
      type: "EXTENSION_ENABLED",
     })
     .catch(() => {
      // Ignore errors for tabs without content scripts
     });
   }
  }
 }

 showForceUpdateNotification(versionInfo: VersionInfo): void {
  chrome.notifications.create("force-update-required", {
   type: "basic",
   iconUrl: "icons/icon48.png",
   title: "Cập nhật bắt buộc!",
   message: `Phiên bản ${versionInfo.version} yêu cầu cập nhật ngay lập tức để tiếp tục sử dụng.`,
   buttons: [{ title: "Tải xuống ngay" }, { title: "Xem chi tiết" }],
   priority: 2,
   requireInteraction: true, // Không tự động ẩn
  });
 }

 showOptionalUpdateNotification(versionInfo: VersionInfo): void {
  chrome.notifications.create("update-available", {
   type: "basic",
   iconUrl: "icons/icon48.png",
   title: "Cập nhật có sẵn",
   message: `Phiên bản ${versionInfo.version} đã có sẵn. Bạn có muốn cập nhật?`,
   buttons: [{ title: "Cập nhật" }, { title: "Để sau" }],
   priority: 1,
  });
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
