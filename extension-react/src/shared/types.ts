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

export interface StoredUserData {
 user: User;
 subscriptions: UserSubscription[];
 productAccess: ProductAccess[];
 loginTime: number;
 lastRefresh?: number;
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
}

export interface ProductAccessResponse {
 success: boolean;
 message?: string;
 data?: ProductAccess[];
}
