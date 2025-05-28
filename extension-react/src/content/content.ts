// Content script for platform access management
console.log("aigiare.vn content script loaded on:", window.location.href);

// Flags to prevent infinite refresh loop
const COOKIE_INJECTED_FLAG = "aigiare_cookies_injected";
const LAST_ACCESS_CHECK = "aigiare_last_access_check";
const LAST_HEARTBEAT = "aigiare_last_heartbeat";
const ACCESS_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const HEARTBEAT_INTERVAL = 1 * 60 * 1000; // 1 minute

// Only run on supported domains (check against user's product access)
async function shouldRunOnThisDomain(): Promise<boolean> {
 try {
  const response: any = await new Promise((resolve) => {
   chrome.runtime.sendMessage({ type: "GET_USER_DATA" }, resolve);
  });

  if (
   response.success &&
   response.userData &&
   response.userData.productAccess
  ) {
   const currentDomain = window.location.hostname;
   const hasAccess = response.userData.productAccess.some((access: any) => {
    try {
     const accessDomain = new URL(access.website).hostname;
     return accessDomain === currentDomain;
    } catch (err) {
     return false;
    }
   });

   console.log(
    "Domain check - Current:",
    currentDomain,
    "Has access:",
    hasAccess
   );
   return hasAccess;
  }

  return false;
 } catch (error) {
  console.log("Error checking domain access:", error);
  return false;
 }
}

// Initialize content script
async function initContentScript() {
 const shouldRun = await shouldRunOnThisDomain();

 if (!shouldRun) {
  console.log("Skipping content script - no access to this domain");
  return;
 }

 // Check if cookies were already injected to prevent infinite refresh
 const lastCheck = sessionStorage.getItem(LAST_ACCESS_CHECK);
 const needsCheck =
  !lastCheck || Date.now() - parseInt(lastCheck) > ACCESS_CHECK_INTERVAL;

 if (sessionStorage.getItem(COOKIE_INJECTED_FLAG) && !needsCheck) {
  console.log("Cookies already injected and recently checked, skipping...");
 } else {
  // Check if user has access to this website
  checkUserAccess();
 }
}

// Start the content script
initContentScript();

async function checkUserAccess() {
 try {
  console.log("Checking user access for:", window.location.href);

  // Update last access check time
  sessionStorage.setItem(LAST_ACCESS_CHECK, Date.now().toString());

  // Get user data from background script
  const response: any = await new Promise((resolve) => {
   chrome.runtime.sendMessage({ type: "GET_USER_DATA" }, resolve);
  });

  console.log("User data response:", response);

  if (response.success && response.userData) {
   const userData = response.userData;
   const currentDomain = window.location.hostname;

   console.log("Current domain:", currentDomain);
   console.log("User product access:", userData.productAccess);

   // Find matching product access for this domain
   const matchingAccess = userData.productAccess.find((access: any) => {
    try {
     const accessDomain = new URL(access.website).hostname;
     console.log("Comparing:", accessDomain, "with", currentDomain);
     return accessDomain === currentDomain;
    } catch (err) {
     console.error("Error parsing access website URL:", access.website, err);
     return false;
    }
   });

   if (matchingAccess) {
    console.log("Found matching access:", matchingAccess);

    // Check if access is still valid
    const endDate = new Date(matchingAccess.endDate);
    const now = new Date();

    console.log("Access end date:", endDate);
    console.log("Current date:", now);

    if (endDate > now) {
     console.log("User has valid access to this website");

     // Check if cookies were already injected
     if (!sessionStorage.getItem(COOKIE_INJECTED_FLAG)) {
      injectCookies(matchingAccess);
     } else {
      console.log("Cookies already injected, access still valid");
     }
    } else {
     console.log("User access has expired for this website");
     clearCookiesAndSession();
     showAccessExpiredNotification();
    }
   } else {
    console.log("User does not have access to this website");
    clearCookiesAndSession();
    showNoAccessNotification();
   }
  } else {
   console.log("User not logged in or no user data");
   clearCookiesAndSession();
  }
 } catch (error) {
  console.error("Error checking user access:", error);
 }
}

function injectCookies(access: any) {
 try {
  console.log("Injecting cookies for access:", access);
  console.log("Website:", access.website);
  console.log("Cookies:", access.cookie);

  // Double-check access is still valid before injecting
  const endDate = new Date(access.endDate);
  const now = new Date();

  if (endDate <= now) {
   console.log("Access expired during injection, aborting");
   clearCookiesAndSession();
   showAccessExpiredNotification();
   return;
  }

  // Set flag to prevent re-injection
  sessionStorage.setItem(COOKIE_INJECTED_FLAG, "true");

  // Request background script to inject cookies
  chrome.runtime.sendMessage({
   type: "INJECT_COOKIES",
   data: {
    website: access.website,
    cookies: access.cookie,
   },
  });

  console.log("Cookie injection request sent to background script");
 } catch (error) {
  console.error("Error requesting cookie injection:", error);
 }
}

function clearCookiesAndSession() {
 console.log("Clearing cookies and session data");

 // Clear session storage flags
 sessionStorage.removeItem(COOKIE_INJECTED_FLAG);
 sessionStorage.removeItem(COOKIE_INJECTED_FLAG + "_refreshed");
 sessionStorage.removeItem(LAST_ACCESS_CHECK);

 // Request background script to clear cookies for current domain
 chrome.runtime.sendMessage({
  type: "CLEAR_COOKIES",
  data: {
   domain: window.location.hostname,
  },
 });
}

function showAccessExpiredNotification() {
 showNotification("Quyền truy cập đã hết hạn", "error");
}

function showNoAccessNotification() {
 showNotification("Bạn chưa có quyền truy cập website này", "warning");
}

function showNotification(
 message: string,
 type: "success" | "error" | "warning"
) {
 // Create notification element
 const notification = document.createElement("div");
 notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

 // Set colors based on type
 switch (type) {
  case "success":
   notification.style.backgroundColor = "rgba(76, 175, 80, 0.9)";
   break;
  case "error":
   notification.style.backgroundColor = "rgba(244, 67, 54, 0.9)";
   break;
  case "warning":
   notification.style.backgroundColor = "rgba(255, 152, 0, 0.9)";
   break;
 }

 notification.textContent = message;

 // Add animation keyframes
 if (!document.querySelector("#ai-access-keyframes")) {
  const style = document.createElement("style");
  style.id = "ai-access-keyframes";
  style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
  document.head.appendChild(style);
 }

 document.body.appendChild(notification);

 // Auto remove after 5 seconds
 setTimeout(() => {
  if (notification.parentNode) {
   notification.style.animation = "slideIn 0.3s ease-out reverse";
   setTimeout(() => {
    notification.remove();
   }, 300);
  }
 }, 5000);
}

// Function to clear injection flags (useful for debugging or when user logs out)
function clearInjectionFlags() {
 sessionStorage.removeItem(COOKIE_INJECTED_FLAG);
 sessionStorage.removeItem(COOKIE_INJECTED_FLAG + "_refreshed");
 sessionStorage.removeItem(LAST_ACCESS_CHECK);
 sessionStorage.removeItem(LAST_HEARTBEAT);
 console.log("Injection flags cleared");
}

// Function to perform heartbeat check (lighter than full access check)
async function performHeartbeat() {
 try {
  const lastHeartbeat = sessionStorage.getItem(LAST_HEARTBEAT);
  const needsHeartbeat =
   !lastHeartbeat || Date.now() - parseInt(lastHeartbeat) > HEARTBEAT_INTERVAL;

  if (!needsHeartbeat) return;

  console.log("Performing heartbeat check...");
  sessionStorage.setItem(LAST_HEARTBEAT, Date.now().toString());

  // Quick check to see if user data still exists
  const response: any = await new Promise((resolve) => {
   chrome.runtime.sendMessage({ type: "GET_USER_DATA" }, resolve);
  });

  if (!response.success || !response.userData) {
   console.log("Heartbeat failed - user not logged in");
   clearCookiesAndSession();
   showNotification("Phiên đăng nhập đã hết hạn", "warning");
   return false;
  }

  return true;
 } catch (error) {
  console.error("Heartbeat error:", error);
  return false;
 }
}

// Function to refresh user access status (check for revoked access, expired subscriptions)
async function refreshAccessStatus() {
 try {
  console.log("Refreshing access status for:", window.location.hostname);

  // Force refresh user data from server
  const response: any = await new Promise((resolve) => {
   chrome.runtime.sendMessage({ type: "REFRESH_USER_DATA" }, resolve);
  });

  if (response.success && response.userData) {
   const userData = response.userData;
   const currentDomain = window.location.hostname;

   // Find matching product access for this domain
   const matchingAccess = userData.productAccess.find((access: any) => {
    try {
     const accessDomain = new URL(access.website).hostname;
     return accessDomain === currentDomain;
    } catch (err) {
     return false;
    }
   });

   if (!matchingAccess) {
    console.log("Access revoked for this website");
    clearCookiesAndSession();
    showNotification("Quyền truy cập đã bị thu hồi", "error");
    return false;
   }

   // Check if access is still valid
   const endDate = new Date(matchingAccess.endDate);
   const now = new Date();

   if (endDate <= now) {
    console.log("Access expired for this website");
    clearCookiesAndSession();
    showAccessExpiredNotification();
    return false;
   }

   console.log("Access still valid");
   return true;
  } else {
   console.log("User not logged in anymore");
   clearCookiesAndSession();
   showNotification("Phiên đăng nhập đã hết hạn", "warning");
   return false;
  }
 } catch (error) {
  console.error("Error refreshing access status:", error);
  return false;
 }
}

// Function to clear all cookies for current domain
async function clearAllCookiesForDomain() {
 try {
  console.log("Clearing all cookies for domain:", window.location.hostname);

  const response: any = await new Promise((resolve) => {
   chrome.runtime.sendMessage(
    {
     type: "CLEAR_ALL_COOKIES",
     data: { domain: window.location.hostname },
    },
    resolve
   );
  });

  if (response.success) {
   console.log("Cookies cleared successfully, count:", response.cleared);
  } else {
   console.error("Failed to clear cookies:", response.error);
  }
 } catch (error) {
  console.error("Error clearing cookies:", error);
 }
}

// Function to handle access revocation
function handleAccessRevoked(reason: string) {
 console.log("Access revoked:", reason);

 // Clear session flags
 clearInjectionFlags();

 // Clear cookies
 clearAllCookiesForDomain();

 // Show notification
 showNotification(reason, "error");

 // Optionally redirect to login page after a delay
 setTimeout(() => {
  // You can customize this behavior
  window.location.reload();
 }, 3000);
}

// Function to check if subscription is still valid
async function checkSubscriptionStatus() {
 try {
  const response: any = await new Promise((resolve) => {
   chrome.runtime.sendMessage({ type: "CHECK_SUBSCRIPTION_STATUS" }, resolve);
  });

  if (response.success) {
   const currentDomain = window.location.hostname;
   const hasValidAccess = response.userData?.productAccess?.some(
    (access: any) => {
     try {
      const accessDomain = new URL(access.website).hostname;
      if (accessDomain === currentDomain) {
       const endDate = new Date(access.endDate);
       return endDate > new Date();
      }
      return false;
     } catch (err) {
      return false;
     }
    }
   );

   if (!hasValidAccess) {
    handleAccessRevoked("Gói đăng ký đã hết hạn hoặc bị thu hồi");
    return false;
   }

   return true;
  }

  return false;
 } catch (error) {
  console.error("Error checking subscription status:", error);
  return false;
 }
}

// Set up more frequent access check (every 2 minutes) to detect revoked access quickly
setInterval(() => {
 if (sessionStorage.getItem(COOKIE_INJECTED_FLAG)) {
  console.log("Running periodic access check...");
  refreshAccessStatus();
 }
}, 2 * 60 * 1000); // 2 minutes

// Set up periodic subscription check (every 5 minutes)
setInterval(() => {
 if (sessionStorage.getItem(COOKIE_INJECTED_FLAG)) {
  console.log("Running periodic subscription check...");
  checkSubscriptionStatus();
 }
}, 5 * 60 * 1000); // 5 minutes

// Set up heartbeat check (every 1 minute) - lighter check
setInterval(() => {
 if (sessionStorage.getItem(COOKIE_INJECTED_FLAG)) {
  performHeartbeat();
 }
}, HEARTBEAT_INTERVAL);

// Check access when page becomes visible/focused (user switches back to tab)
document.addEventListener("visibilitychange", () => {
 if (!document.hidden && sessionStorage.getItem(COOKIE_INJECTED_FLAG)) {
  console.log("Page visible again, checking access status...");
  refreshAccessStatus();
 }
});

// Check access when window gains focus
window.addEventListener("focus", () => {
 if (sessionStorage.getItem(COOKIE_INJECTED_FLAG)) {
  console.log("Window focused, checking access status...");
  refreshAccessStatus();
 }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 console.log("Content script received message:", message);
 switch (message.type) {
  case "COOKIES_INJECTED":
   if (message.success) {
    console.log("Cookies injected successfully");

    // Validate access is still valid after injection
    setTimeout(async () => {
     const stillValid = await refreshAccessStatus();
     if (stillValid) {
      showNotification("Đã tự động đăng nhập!", "success");
      // Only refresh if this is the first time injecting cookies
      if (!sessionStorage.getItem(COOKIE_INJECTED_FLAG + "_refreshed")) {
       sessionStorage.setItem(COOKIE_INJECTED_FLAG + "_refreshed", "true");
       // Refresh page to apply cookies after a short delay
       setTimeout(() => {
        console.log("Refreshing page to apply cookies");
        window.location.reload();
       }, 2000);
      } else {
       console.log("Page already refreshed, skipping refresh");
      }
     } else {
      console.log("Access no longer valid after injection");
     }
    }, 1000); // Check after 1 second
   } else {
    console.error("Failed to inject cookies:", message.error);
    showNotification(
     "Lỗi khi đăng nhập tự động: " + (message.error || "Unknown error"),
     "error"
    );
   }
   break;
  case "USER_LOGGED_OUT":
   console.log("User logged out, clearing injection flags and cookies");
   clearInjectionFlags();
   clearAllCookiesForDomain();
   showNotification("Đã đăng xuất khỏi hệ thống", "warning");
   break;
  case "ACCESS_REVOKED":
   console.log("Access revoked by admin");
   handleAccessRevoked("Quyền truy cập đã bị thu hồi bởi quản trị viên");
   break;
  case "SUBSCRIPTION_EXPIRED":
   console.log("Subscription expired");
   handleAccessRevoked("Gói đăng ký đã hết hạn");
   break;
  case "CLEAR_COOKIES":
   console.log("Clearing cookies for domain:", message.data?.domain);
   clearAllCookiesForDomain();
   break;
  default:
   console.log("Unknown message type:", message.type);
 }

 // Always send response to prevent errors
 sendResponse({ received: true });
});
