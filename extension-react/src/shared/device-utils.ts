export interface DeviceInfo {
 deviceId: string;
 deviceName: string;
 browser: string;
 os: string;
 ip?: string;
 userAgent: string;
}

export class DeviceUtils {
 static generateDeviceId(): string {
  // Tạo device ID dựa trên các thông tin hardware/software
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
   ctx.textBaseline = "top";
   ctx.font = "14px Arial";
   ctx.fillText("Device fingerprint", 2, 2);
  }

  const fingerprint = [
   navigator.userAgent,
   navigator.language,
   screen.width + "x" + screen.height,
   screen.colorDepth,
   new Date().getTimezoneOffset(),
   canvas.toDataURL(),
   navigator.hardwareConcurrency || "unknown",
   (navigator as any).deviceMemory || "unknown",
  ].join("|");

  return btoa(fingerprint)
   .replace(/[^a-zA-Z0-9]/g, "")
   .substring(0, 32);
 }

 static getDeviceInfo(): DeviceInfo {
  const deviceId = this.generateDeviceId();
  const userAgent = navigator.userAgent;

  // Parse browser
  let browser = "Unknown";
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";

  // Parse OS
  let os = "Unknown";
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iOS")) os = "iOS";

  return {
   deviceId,
   deviceName: `${browser} on ${os}`,
   browser,
   os,
   userAgent,
  };
 }

 static async getStoredDeviceId(): Promise<string> {
  const stored = await chrome.storage.local.get(["deviceId"]);
  if (stored.deviceId) {
   return stored.deviceId;
  }

  const deviceInfo = this.getDeviceInfo();
  await chrome.storage.local.set({ deviceId: deviceInfo.deviceId });
  return deviceInfo.deviceId;
 }
}
