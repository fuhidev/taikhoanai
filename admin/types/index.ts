export interface User {
 id: string;
 phoneNumber: string;
 password: string;
 fullName?: string;
 isAdmin?: boolean;
 createdAt: Date;
 updatedAt: Date;
}

export interface Product {
 id: string;
 name: string;
 duration: number; // số ngày
 cookie: string;
 website: string;
 createdAt: Date;
 updatedAt: Date;
 image: string;
 price: number;
 originalPrice?: number;
}

export interface UserSubscription {
 id: string;
 userId: string;
 productId: string;
 startDate: Date;
 endDate: Date;
 isActive: boolean;
 createdAt: Date;
}

export interface Order {
 id: string;
 userId: string;
 productId: string;
 duration: number;
 totalAmount?: number;
 status: "pending" | "completed" | "cancelled";
 createdAt: Date;
}

export interface LoginRequest {
 phoneNumber: string;
 password: string;
}

export interface LoginResponse {
 success: boolean;
 user?: User;
 subscriptions?: UserSubscription[];
 message?: string;
}

export interface ProductAccess {
 productId: string;
 productName: string;
 website: string;
 cookie: string;
 isActive: boolean;
 endDate: Date;
}

export interface AdminLoginRequest {
 phoneNumber: string;
 password: string;
}

export interface AdminLoginResponse {
 success: boolean;
 user?: User;
 message?: string;
}

export interface DeviceInfo {
 deviceId: string;
 deviceName: string;
 browser: string;
 os: string;
 ip?: string;
 userAgent: string;
}

export interface UserSession {
 id: string;
 userId: string;
 userInfo?: {
  phoneNumber: string;
  fullName?: string;
 };
 deviceInfo: DeviceInfo;
 loginTime: number;
 lastActive: number;
 isActive: boolean;
 revokedAt?: number;
 revokedBy?: string; // admin user id
}
