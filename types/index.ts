export interface User {
 id: string;
 phoneNumber: string;
 password: string;
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
