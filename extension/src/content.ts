import { ProductAccess, StoredUserData } from "./types";

class ContentManager {
 private currentUrl: string;
 private isProcessing: boolean = false;

 constructor() {
  this.currentUrl = window.location.href;
  this.initialize();
 }

 private async initialize(): Promise<void> {
  // Wait for page to load
  if (document.readyState === "loading") {
   document.addEventListener("DOMContentLoaded", () => {
    this.checkAndInjectCookie();
   });
  } else {
   this.checkAndInjectCookie();
  }

  // Listen for URL changes (SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
   const url = location.href;
   if (url !== lastUrl) {
    lastUrl = url;
    this.currentUrl = url;
    setTimeout(() => this.checkAndInjectCookie(), 1000);
   }
  }).observe(document, { subtree: true, childList: true });
 }

 private async checkAndInjectCookie(): Promise<void> {
  if (this.isProcessing) return;
  this.isProcessing = true;

  try {
   console.log("[AI Access] Checking access for:", this.currentUrl);

   // Get user data from storage
   const result = await chrome.storage.local.get("userData");
   if (!result.userData) {
    console.log("[AI Access] User not logged in");
    return;
   }

   const userData: StoredUserData = result.userData;

   // Check if user has access to current website
   const matchingProduct = this.findMatchingProduct(
    userData.productAccess,
    this.currentUrl
   );

   if (matchingProduct) {
    console.log(
     "[AI Access] Found matching product:",
     matchingProduct.productName
    );

    // Check if product is still valid
    const endDate = new Date(matchingProduct.endDate);
    if (endDate < new Date()) {
     console.log("[AI Access] Product expired");
     this.showNotification("Sản phẩm đã hết hạn", "error");
     return;
    }

    // Inject cookie
    await this.injectCookie(matchingProduct);
    this.showNotification(
     `Đã kích hoạt ${matchingProduct.productName}`,
     "success"
    );
   } else {
    console.log("[AI Access] No matching product for current website");
   }
  } catch (error) {
   console.error("[AI Access] Error:", error);
  } finally {
   this.isProcessing = false;
  }
 }

 private findMatchingProduct(
  productAccess: ProductAccess[],
  currentUrl: string
 ): ProductAccess | null {
  return (
   productAccess.find((product) => {
    try {
     const productDomain = new URL(product.website).hostname;
     const currentDomain = new URL(currentUrl).hostname;
     return productDomain === currentDomain;
    } catch (error) {
     console.error("Error comparing URLs:", error);
     return false;
    }
   }) || null
  );
 }

 private async injectCookie(product: ProductAccess): Promise<void> {
  try {
   // Send message to background script to set cookies
   const response = await chrome.runtime.sendMessage({
    action: "setCookies",
    cookies: product.cookie,
    url: product.website,
   });

   if (response.success) {
    console.log("[AI Access] Cookies injected successfully");

    // Refresh page after a short delay to apply cookies
    setTimeout(() => {
     window.location.reload();
    }, 1000);
   } else {
    console.error("[AI Access] Failed to inject cookies:", response.error);
    this.showNotification("Lỗi khi thiết lập cookie", "error");
   }
  } catch (error) {
   console.error("[AI Access] Error injecting cookies:", error);
   this.showNotification("Lỗi khi thiết lập cookie", "error");
  }
 }

 private showNotification(message: string, type: "success" | "error"): void {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
      ${
       type === "success"
        ? "background-color: #4caf50;"
        : "background-color: #f44336;"
      }
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
   notification.style.opacity = "1";
   notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
   notification.style.opacity = "0";
   notification.style.transform = "translateX(100px)";
   setTimeout(() => {
    if (notification.parentNode) {
     notification.parentNode.removeChild(notification);
    }
   }, 300);
  }, 3000);
 }
}

// Initialize content manager
new ContentManager();
