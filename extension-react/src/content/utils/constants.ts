export const STORAGE_KEYS = {
 COOKIE_INJECTED: "aigiare_cookies_injected",
 LAST_ACCESS_CHECK: "aigiare_last_access_check",
 LAST_HEARTBEAT: "aigiare_last_heartbeat",
} as const;

export const INTERVALS = {
 ACCESS_CHECK: 2 * 60 * 1000, // 2 minutes
 SUBSCRIPTION_CHECK: 5 * 60 * 1000, // 5 minutes
 HEARTBEAT: 1 * 60 * 1000, // 1 minute
 CACHE_DURATION: 30 * 1000, // 30 seconds
} as const;

export const PRESERVE_KEYS = ["aigiare_", "extension_", "chrome_"];
