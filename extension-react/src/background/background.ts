// Background script for Chrome extension
import { ApiService } from "../shared/api";
import { versionChecker } from "../shared/version-checker";

console.log("aigiare.vn background script loaded");

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
 console.log("Extension installed:", details);

 // Đặt lịch kiểm tra phiên bản định kỳ (mỗi 15 phút cho force update)
 chrome.alarms.create("version-check", { periodInMinutes: 15 });

 // Kiểm tra ngay lập tức
 versionChecker.checkForUpdates();
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
 versionChecker.checkForUpdates();
});

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
 if (alarm.name === "version-check") {
  versionChecker.checkForUpdates();
 }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(
 async (notificationId, buttonIndex) => {
  if (notificationId === "force-update-required") {
   const stored = await chrome.storage.local.get(["updateInfo"]);
   if (stored.updateInfo) {
    if (buttonIndex === 0) {
     // Tải xuống ngay
     chrome.tabs.create({ url: stored.updateInfo.downloadUrl });
    } else if (buttonIndex === 1) {
     // Xem chi tiết
     chrome.tabs.create({
      url: `data:text/html,<html><body><h2>Thông tin cập nhật v${stored.updateInfo.version}</h2><pre>${stored.updateInfo.releaseNotes}</pre></body></html>`,
     });
    }
   }
  } else if (notificationId === "update-available") {
   const stored = await chrome.storage.local.get(["updateInfo"]);
   if (stored.updateInfo) {
    if (buttonIndex === 0) {
     // Cập nhật
     chrome.tabs.create({ url: stored.updateInfo.downloadUrl });
    }
    // ButtonIndex === 1 là "Để sau" - không làm gì
   }
  } else if (notificationId === "update-required") {
   if (buttonIndex === 0) {
    // Tải xuống ngay
    const stored = await chrome.storage.local.get(["downloadUrl"]);
    if (stored.downloadUrl) {
     chrome.tabs.create({ url: stored.downloadUrl });
    }
   }
  }
 }
);

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 console.log("Message received in background:", message);

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
   console.log("Unknown message type:", message.type);
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
 data: { website: string; cookies: string },
 tabId?: number
) {
 if (!tabId) return;

 try {
  console.log("Starting cookie injection for:", data.website);
  console.log("Cookies to inject:", data.cookies);

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

  console.log("Parsed cookies:", cookiesToSet);
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
    if (cookie.expirationDate) {
     cookieData.expirationDate = cookie.expirationDate;
    }

    console.log("Setting cookie:", cookieData);
    await chrome.cookies.set(cookieData);
    console.log("Cookie set successfully:", cookie.name);
   } catch (cookieError) {
    console.error("Error setting individual cookie:", cookie.name, cookieError);
   }
  }

  console.log("All cookies processed for:", data.website);

  // Notify content script
  chrome.tabs.sendMessage(tabId, {
   type: "COOKIES_INJECTED",
   success: true,
  });
 } catch (error) {
  console.error("Error injecting cookies:", error);

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
  console.error("Error getting user data:", error);
  sendResponse({
   success: false,
   error: error instanceof Error ? error.message : String(error),
  });
 }
}

async function handleClearCookies(data: { domain: string }, tabId?: number) {
 try {
  console.log("Clearing cookies for domain:", data.domain);

  // Get all cookies for the domain
  const cookies = await chrome.cookies.getAll({ domain: data.domain });

  console.log("Found cookies to clear:", cookies.length);

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
    console.log("Removed cookie:", cookie.name);
   } catch (error) {
    console.error("Error removing cookie:", cookie.name, error);
   }
  }

  console.log("Finished clearing cookies for:", data.domain);

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
  console.error("Error clearing cookies:", error);

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
  console.log("Refreshing user data from server...");

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

    console.log("User data refreshed successfully");
    sendResponse({ success: true, userData: updatedUserData });
   } else {
    console.error(
     "Failed to refresh product access:",
     productAccessResponse.message
    );
    sendResponse({
     success: false,
     error: productAccessResponse.message || "Failed to refresh data",
    });
   }
  } catch (apiError) {
   console.error("API error during refresh:", apiError);
   sendResponse({
    success: false,
    error: "Network error while refreshing data",
   });
  }
 } catch (error) {
  console.error("Error refreshing user data:", error);
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
  console.log("Clearing all cookies for domain:", data.domain);

  // Get all cookies for the domain and its subdomains
  const allCookies = await chrome.cookies.getAll({});
  const cookiesToRemove = allCookies.filter(
   (cookie) =>
    cookie.domain === data.domain ||
    cookie.domain === `.${data.domain}` ||
    cookie.domain.endsWith(`.${data.domain}`)
  );

  console.log("Found cookies to remove:", cookiesToRemove.length);

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
    console.log("Removed cookie:", cookie.name, "from", cookie.domain);
   } catch (error) {
    console.error("Error removing cookie:", cookie.name, error);
   }
  }

  console.log("Finished clearing all cookies for:", data.domain);

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
  console.error("Error clearing all cookies:", error);

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
  console.log("Checking subscription status from server...");

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

   console.log("Subscription status checked successfully");
   sendResponse({ success: true, userData: updatedUserData });
  } else {
   console.error(
    "Failed to check subscription status:",
    productAccessResponse.message
   );
   sendResponse({
    success: false,
    error: productAccessResponse.message || "Failed to check subscription",
   });
  }
 } catch (error) {
  console.error("Error checking subscription status:", error);
  sendResponse({
   success: false,
   error: error instanceof Error ? error.message : String(error),
  });
 }
}
