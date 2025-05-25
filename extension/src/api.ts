import { LoginRequest, LoginResponse, ProductAccess } from "./types";

const API_BASE_URL = "http://localhost:3000/api";

export class ApiService {
 static async login(request: LoginRequest): Promise<LoginResponse> {
  try {
   const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
   });

   const data = await response.json();
   return data;
  } catch (error) {
   console.error("Login API error:", error);
   return {
    success: false,
    message: "Không thể kết nối đến server",
   };
  }
 }

 static async getProductAccess(
  userId: string
 ): Promise<{ success: boolean; data?: ProductAccess[]; message?: string }> {
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

   const data = await response.json();
   return data;
  } catch (error) {
   console.error("Get product access API error:", error);
   return {
    success: false,
    message: "Không thể kết nối đến server",
   };
  }
 }
}
