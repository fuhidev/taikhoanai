export interface Product {
 originalPrice?: number;
 id: string;
 name: string;
 duration: number; // số ngày
 cookie: string;
 website: string;
 createdAt: Date;
 updatedAt: Date;
 image: string;
 price: number;
 description?: string;
}

export interface Page {
 id: string;
 slug: string;
 title: string;
 content: string;
 isPublished: boolean;
 createdAt: Date;
 updatedAt: Date;
}

export interface ContactInfo {
 zalo: string;
 facebook: string;
 phone: string;
 email?: string;
}
