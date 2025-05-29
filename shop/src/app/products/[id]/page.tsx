"use client";

import { ContactInfo } from "@/components/ContactInfo";
import { Button } from "@/components/ui/Button";
import { getProductById } from "@/lib/firebaseService";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
 const params = useParams();
 const [product, setProduct] = useState<Product | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchProduct = async () => {
   if (!params.id) return;

   try {
    const fetchedProduct = await getProductById(params.id as string);
    if (fetchedProduct) {
     setProduct(fetchedProduct);
    } else {
     setError("Không tìm thấy sản phẩm");
    }
   } catch (error) {
    console.error("Error fetching product:", error);
    setError("Có lỗi xảy ra khi tải sản phẩm");
   } finally {
    setLoading(false);
   }
  };

  fetchProduct();
 }, [params.id]);

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
     <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
     <p className="text-muted-foreground">Đang tải...</p>
    </div>
   </div>
  );
 }

 if (error || !product) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
       className="w-8 h-8 text-red-500"
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
       />
      </svg>{" "}
     </div>
     <h1 className="text-2xl font-bold text-foreground mb-2">{error}</h1>
     <p className="text-muted-foreground mb-6">
      Sản phẩm không tồn tại hoặc đã bị xóa
     </p>
     <Link href="/">
      <Button variant="primary">Về trang chủ</Button>
     </Link>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-background">
   {/* Breadcrumb */}
   <div className="bg-accent py-4">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
       <li>
        <Link href="/" className="text-muted-foreground hover:text-primary">
         Trang chủ
        </Link>
       </li>{" "}
       <li>
        <svg
         className="w-4 h-4 text-muted-foreground"
         fill="currentColor"
         viewBox="0 0 20 20"
        >
         <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
         />
        </svg>
       </li>
       <li>
        <Link
         href="/products"
         className="text-muted-foreground hover:text-primary"
        >
         Sản phẩm
        </Link>
       </li>
       <li>
        <svg
         className="w-4 h-4 text-muted-foreground"
         fill="currentColor"
         viewBox="0 0 20 20"
        >
         <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
         />
        </svg>
       </li>
       <li className="text-primary font-medium line-clamp-1">{product.name}</li>
      </ol>
     </nav>
    </div>
   </div>

   {/* Product Detail */}
   <section className="py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="grid lg:grid-cols-2 gap-12">
      {/* Product Image */}
      <div className="space-y-4">
       <div className="aspect-square bg-accent rounded-2xl overflow-hidden">
        {product.image ? (
         <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
         />
        ) : (
         <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
           <svg
            className="w-16 h-16 text-muted-foreground mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
           >
            <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth={2}
             d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
           </svg>
           <p className="text-muted-foreground">Không có hình ảnh</p>
          </div>
         </div>
        )}
       </div>

       {/* Additional Images */}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
       <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
         {product.name}
        </h1>

        {/* {product.category && (
         <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          {product.category}
         </span>
        )} */}

        {product.price && (
         <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-bold text-primary">
           {product.price.toLocaleString("vi-VN")}đ
          </span>
          {/* {product.originalPrice && product.originalPrice > product.price && (
           <span className="text-xl text-muted-foreground line-through">
            {product.originalPrice.toLocaleString("vi-VN")}đ
           </span>
          )} */}
         </div>
        )}
       </div>

       {/* Product Details */}
       <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
         Thông tin sản phẩm
        </h3>

        <div className="space-y-3">
         <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">Thời hạn:</span>
          <span className="font-medium text-foreground">
           {product.duration} ngày
          </span>
         </div>

         <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">Website:</span>
          <span className="font-medium text-primary">{product.website}</span>
         </div>

         {/* {product.platform && (
          <div className="flex justify-between py-2 border-b border-border">
           <span className="text-muted-foreground">Nền tảng:</span>
           <span className="font-medium text-foreground">
            {product.platform}
           </span>
          </div>
         )} */}

         {/* {product.accountType && (
          <div className="flex justify-between py-2 border-b border-border">
           <span className="text-muted-foreground">Loại tài khoản:</span>
           <span className="font-medium text-foreground">
            {product.accountType}
           </span>
          </div>
         )} */}
        </div>
       </div>

       {/* Features */}
       {/* {product.features && product.features.length > 0 && (
        <div className="space-y-4">
         <h3 className="text-xl font-semibold text-foreground">Tính năng</h3>
         <ul className="space-y-2">
          {product.features.map((feature, index) => (
           <li key={index} className="flex items-start gap-3">
            <svg
             className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
            >
             <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
             />
            </svg>
            <span className="text-foreground">{feature}</span>
           </li>
          ))}
         </ul>
        </div>
       )} */}

       {/* Description */}
       {product.description && (
        <div className="space-y-4">
         <h3 className="text-xl font-semibold text-foreground">Mô tả</h3>
         <div className="text-muted-foreground leading-relaxed">
          {product.description.split("\n").map((line, index) => (
           <p key={index} className="mb-2">
            {line}
           </p>
          ))}
         </div>
        </div>
       )}

       {/* CTA Section */}
       <div className="bg-accent rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-foreground text-center">
         Quan tâm đến sản phẩm này?
        </h3>
        <p className="text-muted-foreground text-center">
         Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
         <Button variant="primary" size="lg" className="flex-1">
          Liên hệ Zalo
         </Button>
         <Button variant="outline" size="lg" className="flex-1">
          Fanpage Facebook
         </Button>
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Contact Section */}
   <section className="py-16 bg-accent">
    <ContactInfo />
   </section>
  </div>
 );
}
