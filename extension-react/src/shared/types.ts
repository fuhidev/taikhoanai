export interface User {
 id: string;
 phoneNumber: string;
 fullName: string;
 email?: string;
 role: "user" | "admin";
 isActive: boolean;
 createdAt: Date;
 updatedAt: Date;
}

export interface Product {
 id: string;
 name: string;
 description: string;
 website: string;
 price: number;
 duration: number; // days
 isActive: boolean;
 createdAt: Date;
 updatedAt: Date;
}

export interface ProductAccess {
 id: string;
 userId: string;
 productId: string;
 productName: string;
 website: string;
 cookies: string;
 localStorage?: string; // Thêm localStorage field
 startDate: Date;
 endDate: Date;
 isActive: boolean;
}

export interface UserSubscription {
 id: string;
 userId: string;
 productId: string;
 startDate: Date;
 endDate: Date;
 status: "active" | "expired" | "cancelled";
 autoRenew: boolean;
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

export interface StoredUserData {
 user: User;
 subscriptions: UserSubscription[];
 productAccess: ProductAccess[];
 loginTime: number;
 lastRefresh?: number;
 sessionId: string; // Thêm session ID
 deviceId: string; // Thêm device ID
}

export interface LoginRequest {
 phoneNumber: string;
 password: string;
}

export interface LoginResponse {
 success: boolean;
 message?: string;
 user?: User;
 subscriptions?: UserSubscription[];
 sessionId?: string; // Thêm session ID
 deviceConflict?: boolean; // Thêm flag xung đột thiết bị
 activeDevice?: {
  deviceName: string;
  loginTime: number;
  lastActive: number;
 };
}

export interface ProductAccessResponse {
 success: boolean;
 message?: string;
 data?: ProductAccess[];
}
