"use client";

import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";

interface ProductCardProps {
 product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
 const formatPrice = (price?: number) => {
  if (!price) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
   style: "currency",
   currency: "VND",
  }).format(price);
 };

 const formatDuration = (days: number) => {
  if (days >= 365) {
   const years = Math.floor(days / 365);
   const remainingDays = days % 365;
   if (remainingDays === 0) {
    return `${years} năm`;
   }
   return `${years} năm ${remainingDays} ngày`;
  } else if (days >= 30) {
   const months = Math.floor(days / 30);
   const remainingDays = days % 30;
   if (remainingDays === 0) {
    return `${months} tháng`;
   }
   return `${months} tháng ${remainingDays} ngày`;
  } else {
   return `${days} ngày`;
  }
 };

 //  const discountPercentage =
 //   product.originalPrice && product.price
 //    ? Math.round((1 - product.price / product.originalPrice) * 100)
 //    : 0;
 return (
  <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
   <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
    {product.image ? (
     <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
     />
    ) : (
     <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
       <span className="text-primary-foreground text-2xl font-bold">
        {product.name.charAt(0).toUpperCase()}
       </span>
      </div>
     </div>
    )}
    {/* {discountPercentage > 0 && (
     <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
      -{discountPercentage}%
     </div>
    )} */}
    {/* {product.featured && (
     <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold">
      Nổi bật
     </div>
    )} */}
    {/* {product.inStock === false && (
     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <span className="text-white font-semibold">Hết hàng</span>
     </div>
    )} */}
   </div>

   <CardContent className="p-4">
    <div className="space-y-2">
     <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
      {product.name}
     </h3>

     {/* <p className="text-muted-foreground text-sm line-clamp-2">
      {product.description}
     </p> */}

     <div className="space-y-1">
      <div className="flex items-center space-x-2">
       <span className="text-xl font-bold text-primary">
        {formatPrice(product.price)}
       </span>
       {product.originalPrice && (
        <span className="text-sm text-muted-foreground line-through animate-pulse">
         {formatPrice(product.originalPrice)}
        </span>
       )}
      </div>

      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
       <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
       >
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={2}
         d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
       </svg>
       <span>Thời hạn: {formatDuration(product.duration)}</span>
      </div>

      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
       <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
       >
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={2}
         d="M16 11V5a1 1 0 00-1-1H9a1 1 0 00-1 1v6M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"
        />
       </svg>
       <span>Đã bán: {product.soldCount ?? 0}</span>
      </div>
      {/* <div className="text-xs text-muted-foreground">
       Danh mục: {product.category}
      </div> */}
     </div>

     <div className="flex space-x-2 pt-2">
      <Link href={`/products/${product.id}`} className="flex-1">
       <Button
        variant="primary"
        size="sm"
        className="w-full"
        // disabled={!product.inStock}
       >
        Xem chi tiết
        {/* {product.inStock ? "Xem chi tiết" : "Hết hàng"} */}
       </Button>
      </Link>
     </div>
    </div>
   </CardContent>
  </Card>
 );
};
