import { LoginRequest, LoginResponse, ProductAccessResponse } from "./types";

// Sử dụng environment variable với fallback
const API_BASE_URL =
 import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log("Extension using API base URL:", API_BASE_URL);

export class ApiService {
 static async login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
   const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
   });

   if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
   }

   return await response.json();
  } catch (error) {
   console.error("Login API error:", error);
   throw error;
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
   console.error("Product Access API error:", error);
   throw error;
  }
 }
}
