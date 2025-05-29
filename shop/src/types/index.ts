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
 description?: string;
}

export interface ContactInfo {
 zalo: string;
 facebook: string;
 phone: string;
 email?: string;
}
