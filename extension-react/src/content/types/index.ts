export interface UserData {
 success: boolean;
 userData?: {
  user: {
   id: string;
  };
  productAccess: ProductAccess[];
 };
}

export interface ProductAccess {
 id: string;
 website: string;
 endDate: string;
 cookies?: string;
 localStorage?: string;
}

export type NotificationType = "success" | "error" | "warning";

export interface ChromeMessage {
 type: string;
 data?: any;
}
