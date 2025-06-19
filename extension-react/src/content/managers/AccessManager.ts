import { DomainService } from "../services/DomainService";
import { SessionService } from "../services/SessionService";
import { ChromeMessage, ProductAccess } from "../types";
import { STORAGE_KEYS } from "../utils/constants";
import { CacheManager } from "./CacheManager";
import { NotificationManager } from "./NotificationManager";

export class AccessManager {
 static async checkUserAccess(): Promise<void> {
  try {
   // Update last access check time
   SessionService.setFlag(
    STORAGE_KEYS.LAST_ACCESS_CHECK,
    Date.now().toString()
   );

   const response = await CacheManager.get();

   if (response.success && response.userData) {
    await this.handleValidUser(response.userData);
   } else {
    this.handleInvalidUser();
   }
  } catch (error) {
   // Error checking user access
  }
 }

 private static async handleValidUser(userData: any): Promise<void> {
  const currentDomain = window.location.hostname;
  const matchingAccess = DomainService.findMatchingAccess(
   userData.productAccess,
   currentDomain
  );

  if (matchingAccess) {
   if (DomainService.isAccessExpired(matchingAccess)) {
    this.handleExpiredAccess();
   } else {
    await this.injectAccess(matchingAccess);
   }
  } else {
   this.handleNoAccess();
  }
 }
 private static handleInvalidUser(): void {
  this.clearCookiesAndSession();
 }

 private static handleExpiredAccess(): void {
  NotificationManager.show("Quyền truy cập đã hết hạn", "error");
  this.clearCookiesAndSession();
 }

 private static handleNoAccess(): void {
  NotificationManager.show("Bạn chưa có quyền truy cập website này", "warning");
  this.clearCookiesAndSession();
 }
 private static async injectAccess(access: ProductAccess): Promise<void> {
  try {
   // Set flag to prevent re-injection
   SessionService.setFlag(STORAGE_KEYS.COOKIE_INJECTED);

   // Inject cookies if available
   if (access.cookies?.trim()) {
    await this.sendMessage({
     type: "INJECT_COOKIES",
     data: {
      cookies: access.cookies,
      domain: window.location.hostname,
     },
    });
   }

   // Inject localStorage if available
   if (access.localStorage?.trim()) {
    SessionService.injectLocalStorage(access.localStorage);
   }
  } catch (error) {
   NotificationManager.show("Lỗi khi inject quyền truy cập", "error");
  }
 }
 static clearCookiesAndSession(): void {
  SessionService.clearInjectedLocalStorage();
  SessionService.clearAllFlags();

  this.sendMessage({
   type: "CLEAR_COOKIES",
   data: { domain: window.location.hostname },
  });
 }

 static async performHeartbeat(): Promise<boolean> {
  try {
   const lastHeartbeat = SessionService.getFlag(STORAGE_KEYS.LAST_HEARTBEAT);
   const needsHeartbeat =
    !lastHeartbeat || Date.now() - parseInt(lastHeartbeat) > 60 * 1000; // 1 minute

   if (!needsHeartbeat) return true;

   SessionService.setFlag(STORAGE_KEYS.LAST_HEARTBEAT, Date.now().toString());

   const response = await CacheManager.get();

   if (!response.success || !response.userData) {
    this.clearCookiesAndSession();
    NotificationManager.show("Phiên đăng nhập đã hết hạn", "warning");
    return false;
   }

   return true;
  } catch (error) {
   return false;
  }
 }
 static async refreshAccessStatus(): Promise<boolean> {
  try {
   // Force refresh from server
   const response = await this.sendMessage({
    type: "REFRESH_USER_DATA",
   });

   if (response.success && response.userData) {
    CacheManager.invalidate();
    await this.checkUserAccess();
    return true;
   } else {
    this.clearCookiesAndSession();
    return false;
   }
  } catch (error) {
   return false;
  }
 }

 private static sendMessage(message: ChromeMessage): Promise<any> {
  return new Promise((resolve) => {
   chrome.runtime.sendMessage(message, resolve);
  });
 }
}
