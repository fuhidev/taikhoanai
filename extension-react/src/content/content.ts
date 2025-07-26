// Content script for platform access management
// taikhoanai.io.vn content script loaded on: ${window.location.href}

import { AccessManager } from "./managers/AccessManager";
import { IntervalManager } from "./managers/IntervalManager";
import { NotificationManager } from "./managers/NotificationManager";
import { DomainService } from "./services/DomainService";
import { SessionService } from "./services/SessionService";
import { INTERVALS, STORAGE_KEYS } from "./utils/constants";

class ContentScript {
 private isPageVisible = !document.hidden;
 async init(): Promise<void> {
  const shouldRun = await DomainService.shouldRunOnThisDomain();
  if (!shouldRun) {
   return;
  }

  this.setupEventListeners();
  this.setupSchedulers();
  await this.performInitialCheck();
 }

 private setupEventListeners(): void {
  // Page visibility
  document.addEventListener("visibilitychange", () => {
   this.handleVisibilityChange();
  });

  // Window focus
  window.addEventListener("focus", () => {
   this.handleWindowFocus();
  });

  // Cleanup on unload
  window.addEventListener("beforeunload", () => {
   this.cleanup();
  });

  // Chrome messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   this.handleChromeMessage(message);
   sendResponse({ received: true });
  });
 }

 private setupSchedulers(): void {
  if (!SessionService.hasFlag(STORAGE_KEYS.COOKIE_INJECTED)) return;

  // Heartbeat - always running (lightweight)
  IntervalManager.set(
   "heartbeat",
   () => {
    AccessManager.performHeartbeat();
   },
   INTERVALS.HEARTBEAT
  );

  // Intensive checks only when page visible
  if (this.isPageVisible) {
   this.startIntensiveChecks();
  }
 }

 private startIntensiveChecks(): void {
  IntervalManager.set(
   "accessCheck",
   () => {
    AccessManager.refreshAccessStatus();
   },
   INTERVALS.ACCESS_CHECK
  );

  IntervalManager.set(
   "subscriptionCheck",
   () => {
    this.checkSubscriptionStatus();
   },
   INTERVALS.SUBSCRIPTION_CHECK
  );
 }

 private stopIntensiveChecks(): void {
  IntervalManager.clear("accessCheck");
  IntervalManager.clear("subscriptionCheck");
 }

 private async performInitialCheck(): Promise<void> {
  const lastCheck = SessionService.getFlag(STORAGE_KEYS.LAST_ACCESS_CHECK);
  const needsCheck =
   !lastCheck || Date.now() - parseInt(lastCheck) > INTERVALS.ACCESS_CHECK;
  if (SessionService.hasFlag(STORAGE_KEYS.COOKIE_INJECTED) && !needsCheck) {
  } else {
   await AccessManager.checkUserAccess();
  }
 }

 private handleVisibilityChange(): void {
  this.isPageVisible = !document.hidden;
  if (this.isPageVisible) {
   this.startIntensiveChecks();
   this.performImmediateCheck();
  } else {
   this.stopIntensiveChecks();
  }
 }
 private handleWindowFocus(): void {
  if (SessionService.hasFlag(STORAGE_KEYS.COOKIE_INJECTED)) {
   this.performImmediateCheck();
  }
 }

 private async performImmediateCheck(): Promise<void> {
  if (SessionService.hasFlag(STORAGE_KEYS.COOKIE_INJECTED)) {
   await AccessManager.refreshAccessStatus();
  }
 }
 private handleChromeMessage(message: any): void {
  switch (message.type) {
   case "COOKIES_INJECTED":
    break;

   case "USER_LOGGED_OUT":
    AccessManager.clearCookiesAndSession();
    break;

   case "ACCESS_REVOKED":
    this.handleAccessRevoked(
     message.data?.reason || "Quyền truy cập đã bị thu hồi"
    );
    break;

   case "SUBSCRIPTION_EXPIRED":
    this.handleAccessRevoked("Gói dịch vụ đã hết hạn");
    break;
  }
 }

 private handleAccessRevoked(reason: string): void {
  SessionService.clearAllFlags();
  AccessManager.clearCookiesAndSession();
  NotificationManager.show(reason, "error");

  setTimeout(() => {
   window.location.reload();
  }, 3000);
 }

 private async checkSubscriptionStatus(): Promise<boolean> {
  try {
   const response: any = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "CHECK_SUBSCRIPTION" }, resolve);
   });

   if (response.success) {
    return true;
   }

   this.handleAccessRevoked("Gói dịch vụ không còn hiệu lực");
   return false;
  } catch (error) {
   return false;
  }
 }
 private cleanup(): void {
  IntervalManager.clearAll();
 }
}

// Initialize
const contentScript = new ContentScript();
contentScript.init();
