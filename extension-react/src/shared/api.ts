import { DeviceUtils } from "./device-utils";
import { LoginRequest, LoginResponse, ProductAccessResponse } from "./types";

// Sử dụng environment variable với fallback
const API_BASE_URL =
 import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export class ApiService {
 static async login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
   const deviceInfo = DeviceUtils.getDeviceInfo();
   const deviceId = await DeviceUtils.getStoredDeviceId();

   const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     ...credentials,
     deviceInfo,
     deviceId,
    }),
   });

   if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
   }

   return await response.json();
  } catch (error) {
   throw error;
  }
 }
 static async validateSession(
  sessionId: string,
  deviceId: string
 ): Promise<{
  success: boolean;
  valid: boolean;
  message?: string;
 }> {
  try {
   const response = await fetch(`${API_BASE_URL}/extension/validate-session`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, deviceId }),
   });

   return await response.json();
  } catch (error) {
   console.error("Session validation error:", error);
   return { success: false, valid: false, message: "Network error" };
  }
 }

 static async logout(sessionId: string): Promise<{ success: boolean }> {
  try {
   const response = await fetch(`${API_BASE_URL}/extension/logout`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
   });

   return await response.json();
  } catch (error) {
   console.error("Logout API error:", error);
   return { success: false };
  }
 }

 static async getProductAccess(userId: string): Promise<ProductAccessResponse> {
  try {
   const response = await fetch(
    `${API_BASE_URL}/product-access?userId=${userId}`,
    {
     method: "GET",
     headers: {
      "Content-Type": "application/json",
     },
    }
   );

   if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
   }

   return await response.json();
  } catch (error) {
   throw error;
  }
 }
}
   throw error;
  }
 }
}
