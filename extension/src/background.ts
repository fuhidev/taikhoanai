// Background script for managing cookies
class BackgroundManager {
 constructor() {
  this.initializeMessageListener();
 }

 private initializeMessageListener(): void {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === "setCookies") {
    this.setCookies(request.cookies, request.url)
     .then((result) => sendResponse(result))
     .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
   }
  });
 }

 private async setCookies(
  cookieString: string,
  url: string
 ): Promise<{ success: boolean; error?: string }> {
  try {
   console.log("[Background] Setting cookies for:", url);

   // Parse cookie string
   const cookies = this.parseCookieString(cookieString);
   const urlObj = new URL(url);

   // Set each cookie
   for (const cookie of cookies) {
    try {
     await chrome.cookies.set({
      url: url,
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain || urlObj.hostname,
      path: cookie.path || "/",
      secure: urlObj.protocol === "https:",
      httpOnly: cookie.httpOnly || false,
      expirationDate: cookie.expirationDate,
     });

     console.log("[Background] Set cookie:", cookie.name);
    } catch (cookieError) {
     console.error(
      "[Background] Error setting cookie:",
      cookie.name,
      cookieError
     );
    }
   }

   console.log("[Background] All cookies set successfully");
   return { success: true };
  } catch (error) {
   console.error("[Background] Error setting cookies:", error);
   return {
    success: false,
    error: error instanceof Error ? error.message : "Unknown error",
   };
  }
 }

 private parseCookieString(cookieString: string): Array<{
  name: string;
  value: string;
  domain?: string;
  path?: string;
  httpOnly?: boolean;
  expirationDate?: number;
 }> {
  const cookies: Array<{
   name: string;
   value: string;
   domain?: string;
   path?: string;
   httpOnly?: boolean;
   expirationDate?: number;
  }> = [];

  // Split by semicolon and parse each cookie
  const cookieParts = cookieString.split(";").map((part) => part.trim());

  let currentCookie: any = null;

  for (const part of cookieParts) {
   if (part.includes("=")) {
    const [key, value] = part.split("=", 2);
    const trimmedKey = key.trim();
    const trimmedValue = value ? value.trim() : "";

    // Check if this is a cookie name-value pair or an attribute
    if (!currentCookie || this.isCookieAttribute(trimmedKey)) {
     if (currentCookie && this.isCookieAttribute(trimmedKey)) {
      // This is an attribute of the current cookie
      this.setCookieAttribute(currentCookie, trimmedKey, trimmedValue);
     } else {
      // This is a new cookie
      if (currentCookie) {
       cookies.push(currentCookie);
      }
      currentCookie = {
       name: trimmedKey,
       value: trimmedValue,
      };
     }
    }
   } else if (currentCookie) {
    // Handle attributes without values (like HttpOnly, Secure)
    const attribute = part.toLowerCase();
    if (attribute === "httponly") {
     currentCookie.httpOnly = true;
    }
   }
  }

  // Add the last cookie
  if (currentCookie) {
   cookies.push(currentCookie);
  }

  return cookies;
 }

 private isCookieAttribute(key: string): boolean {
  const attributes = [
   "domain",
   "path",
   "expires",
   "max-age",
   "secure",
   "httponly",
   "samesite",
  ];
  return attributes.includes(key.toLowerCase());
 }

 private setCookieAttribute(cookie: any, key: string, value: string): void {
  const lowerKey = key.toLowerCase();

  switch (lowerKey) {
   case "domain":
    cookie.domain = value;
    break;
   case "path":
    cookie.path = value;
    break;
   case "expires":
    // Parse expires date
    try {
     const date = new Date(value);
     cookie.expirationDate = Math.floor(date.getTime() / 1000);
    } catch (error) {
     console.warn("Failed to parse expires date:", value);
    }
    break;
   case "max-age":
    // Convert max-age to expiration date
    try {
     const maxAge = parseInt(value, 10);
     if (!isNaN(maxAge)) {
      cookie.expirationDate = Math.floor((Date.now() + maxAge * 1000) / 1000);
     }
    } catch (error) {
     console.warn("Failed to parse max-age:", value);
    }
    break;
   case "httponly":
    cookie.httpOnly = true;
    break;
  }
 }
}

// Initialize background manager
new BackgroundManager();
