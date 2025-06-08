// Background script for Chrome extension
import { ApiService } from "../shared/api";
import { StorageService } from "../shared/storage";

// aigiare.vn background script loaded

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
 // Extension installed: ${details}

 // Đặt lịch kiểm tra session định kỳ (mỗi 5 phút)
 chrome.alarms.create("session-check", { periodInMinutes: 5 });
});

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
 if (alarm.name === "session-check") {
  validateCurrentSession();
 }
});

// Handle notification button clicks

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 // Message received in background: ${message}

 switch (message.type) {
  case "CHECK_EXTENSION_STATUS":
   handleCheckExtensionStatus(sendResponse);
   return true;
  case "INJECT_COOKIES":
   handleCookieInjection(message.data, sender.tab?.id);
   break;
  case "GET_USER_DATA":
   handleGetUserData(sendResponse);
   return true; // Keep the message channel open for async response
  case "CLEAR_COOKIES":
   handleClearCookies(message.data, sender.tab?.id);
   break;
  case "CLEAR_ALL_COOKIES":
   handleClearAllCookies(message.data, sender.tab?.id, sendResponse);
   return true;
  case "REFRESH_USER_DATA":
   handleRefreshUserData(sendResponse);
   return true; // Keep the message channel open for async response
  case "CHECK_SUBSCRIPTION_STATUS":
   handleCheckSubscriptionStatus(sendResponse);
   return true; // Keep the message channel open for async response
  default:
  // Unknown message type: ${message.type}
 }
});

async function handleCheckExtensionStatus(
 sendResponse: (response: any) => void
) {
 try {
  const result = await chrome.storage.local.get([
   "extensionDisabled",
   "disableReason",
   "updateInfo",
  ]);

  sendResponse({
   success: true,
   disabled: result.extensionDisabled || false,
   reason: result.disableReason,
   updateInfo: result.updateInfo,
  });
 } catch (error) {
  sendResponse({
   success: false,
   error: error instanceof Error ? error.message : String(error),
  });
 }
}

async function handleCookieInjection(
 data: { website: string; cookies: string; expirationDate?: number },
 tabId?: number
) {
 if (!tabId) return;

 try {
  const url = new URL(data.website);
  let cookiesToSet = [];

  // Parse cookies - handle both JSON format and simple string format
  try {
   // Try JSON format first
   cookiesToSet = JSON.parse(data.cookies);
  } catch {
   // If not JSON, parse as simple cookie string
   const cookieString = data.cookies;
   cookiesToSet = parseCookieString(cookieString);
  }

  // Set cookies for the website
  for (const cookie of cookiesToSet) {
   try {
    const cookieData: chrome.cookies.SetDetails = {
     url: data.website,
     name: cookie.name,
     value: cookie.value,
     domain: cookie.domain || url.hostname,
     path: cookie.path || "/",
     secure: url.protocol === "https:",
     httpOnly: cookie.httpOnly || false,
    };

    // Add expiration if provided
    if (data.expirationDate) {
     cookieData.expirationDate = data.expirationDate;
    }

    await chrome.cookies.set(cookieData);
   } catch (cookieError) {}
  }

  // Notify content script
  chrome.tabs.sendMessage(tabId, {
   type: "COOKIES_INJECTED",
   success: true,
  });
 } catch (error) {
  if (tabId) {
   chrome.tabs.sendMessage(tabId, {
    type: "COOKIES_INJECTED",
    success: false,
    error: error instanceof Error ? error.message : String(error),
   });
  }
 }
}

// Helper function to parse cookie string format
function parseCookieString(cookieString: string) {
 const cookies = [];
 const pairs = cookieString.split(";");

 for (const pair of pairs) {
  const [name, value] = pair.trim().split("=");
  if (name && value) {
   cookies.push({
    name: name.trim(),
    value: value.trim(),
   });
  }
 }

 return cookies;
}

async function handleGetUserData(sendResponse: (response: any) => void) {
 try {
  const result = await chrome.storage.local.get("userData");
  sendResponse({ success: true, userData: result.userData });
 } catch (error) {
  sendResponse({
   success: false,
   error: error instanceof Error ? error.message : String(error),
  });
 }
}

async function handleClearCookies(data: { domain: string }, tabId?: number) {
 try {
  // Get all cookies for the domain
  const cookies = await chrome.cookies.getAll({ domain: data.domain });

  // Remove each cookie
  for (const cookie of cookies) {
   const url = `http${cookie.secure ? "s" : ""}://${cookie.domain}${
    cookie.path
   }`;
   try {
    await chrome.cookies.remove({
     url: url,
     name: cookie.name,
    });
   } catch (error) {}
  }

  // Notify content script if available
  if (tabId) {
   chrome.tabs
    .sendMessage(tabId, {
     type: "COOKIES_CLEARED",
     success: true,
     domain: data.domain,
    })
    .catch(() => {
     // Ignore errors - tab might be closed
    });
  }
 } catch (error) {
  if (tabId) {
   chrome.tabs
    .sendMessage(tabId, {
     type: "COOKIES_CLEARED",
     success: false,
     error: error instanceof Error ? error.message : String(error),
    })
    .catch(() => {
     // Ignore errors - tab might be closed
    });
  }
 }
}

async function handleRefreshUserData(sendResponse: (response: any) => void) {
 try {
  // Get current user data
  const result = await chrome.storage.local.get("userData");
  const userData = result.userData;

  if (!userData || !userData.user) {
   sendResponse({ success: false, error: "No user data found" });
   return;
  }
  // Import API service
  try {
   // Refresh product access from server
   const productAccessResponse = await ApiService.getProductAccess(
    userData.user.id
   );

   if (productAccessResponse.success && productAccessResponse.data) {
    // Update user data with fresh product access
    const updatedUserData = {
     ...userData,
     productAccess: productAccessResponse.data,
     lastRefresh: Date.now(),
    };

    // Save updated data
    await chrome.storage.local.set({ userData: updatedUserData });

    sendResponse({ success: true, userData: updatedUserData });
   } else {
    sendResponse({
     success: false,
     error: productAccessResponse.message || "Failed to refresh data",
    });
   }
  } catch (apiError) {
   sendResponse({
    success: false,
    error: "Network error while refreshing data",
   });
  }
 } catch (error) {
  sendResponse({
   success: false,
   error: error instanceof Error ? error.message : String(error),
  });
 }
}

async function handleClearAllCookies(
 data: { domain: string },
 tabId?: number,
 sendResponse?: (response: any) => void
) {
 try {
  // Get all cookies for the domain and its subdomains
  const allCookies = await chrome.cookies.getAll({});
  const cookiesToRemove = allCookies.filter(
   (cookie) =>
    cookie.domain === data.domain ||
    cookie.domain === `.${data.domain}` ||
    cookie.domain.endsWith(`.${data.domain}`)
  );

  // Remove each cookie
  for (const cookie of cookiesToRemove) {
   const url = `http${cookie.secure ? "s" : ""}://${
    cookie.domain.startsWith(".") ? cookie.domain.substring(1) : cookie.domain
   }${cookie.path}`;
   try {
    await chrome.cookies.remove({
     url: url,
     name: cookie.name,
    });
   } catch (error) {}
  }

  if (sendResponse) {
   sendResponse({ success: true, cleared: cookiesToRemove.length });
  }

  // Notify content script if available
  if (tabId) {
   chrome.tabs
    .sendMessage(tabId, {
     type: "COOKIES_CLEARED",
     success: true,
     domain: data.domain,
     cleared: cookiesToRemove.length,
    })
    .catch(() => {
     // Ignore errors - tab might be closed
    });
  }
 } catch (error) {
  if (sendResponse) {
   sendResponse({
    success: false,
    error: error instanceof Error ? error.message : String(error),
   });
  }

  if (tabId) {
   chrome.tabs
    .sendMessage(tabId, {
     type: "COOKIES_CLEARED",
     success: false,
     error: error instanceof Error ? error.message : String(error),
    })
    .catch(() => {
     // Ignore errors - tab might be closed
    });
  }
 }
}

async function handleCheckSubscriptionStatus(
 sendResponse: (response: any) => void
) {
 try {
  // Get current user data
  const result = await chrome.storage.local.get("userData");
  const userData = result.userData;

  if (!userData || !userData.user) {
   sendResponse({ success: false, error: "No user data found" });
   return;
  }

  // Refresh product access from server to get latest subscription status
  const productAccessResponse = await ApiService.getProductAccess(
   userData.user.id
  );

  if (productAccessResponse.success && productAccessResponse.data) {
   // Update user data with fresh product access
   const updatedUserData = {
    ...userData,
    productAccess: productAccessResponse.data,
    lastRefresh: Date.now(),
   };

   // Save updated data
   await chrome.storage.local.set({ userData: updatedUserData });

   sendResponse({ success: true, userData: updatedUserData });
  } else {
   sendResponse({
    success: false,
    error: productAccessResponse.message || "Failed to check subscription",
   });
  }
 } catch (error) {
  sendResponse({
   success: false,
   error: error instanceof Error ? error.message : String(error),
  });
 }
}

// Session validation function
async function validateCurrentSession() {
 try {
  const userData = await StorageService.getUserData();

  if (userData && userData.sessionId && userData.deviceId) {
   const validation = await ApiService.validateSession(
    userData.sessionId,
    userData.deviceId
   );

   if (!validation.success || !validation.valid) {
    await StorageService.clearUserData();

    // Notify all tabs about session expiry
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
     if (tab.id) {
      chrome.tabs
       .sendMessage(tab.id, {
        type: "SESSION_EXPIRED",
        reason: validation.message || "Session không hợp lệ",
       })
       .catch(() => {
        // Ignore errors for tabs without content scripts
       });
     }
    }
   }
  }
 } catch (error) {}
}
