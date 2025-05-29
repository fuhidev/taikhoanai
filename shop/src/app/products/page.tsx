"use client";

import { ProductList } from "@/components/ProductList";
import { Button } from "@/components/ui/Button";
import { getProducts } from "@/lib/firebaseService";
import { Product } from "@/types";
import { useEffect, useState } from "react";

export default function ProductsPage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  loadProducts();
 }, []);

 const loadProducts = async () => {
  try {
   setLoading(true);
   const productsData = await getProducts();
   setProducts(productsData);
  } catch (err) {
   setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
   console.error("Error loading products:", err);
  } finally {
   setLoading(false);
  }
 };

 if (loading) {
  return (
   <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
     <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Đang tải sản phẩm...</p>
     </div>
    </div>
   </div>
  );
 }

 if (error) {
  return (
   <div className="min-h-screen bg-background flex items-center justify-center">
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
      </svg>
     </div>
     <h1 className="text-2xl font-bold text-foreground mb-2">Có lỗi xảy ra</h1>
     <p className="text-muted-foreground mb-6">{error}</p>
     <Button onClick={loadProducts} variant="primary">
      Thử lại
     </Button>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-background">
   {/* Page Header */}
   <div className="bg-accent py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
       Tất cả sản phẩm
      </h1>
      <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
       Khám phá bộ sưu tập đầy đủ các sản phẩm chất lượng cao của chúng tôi
      </p>
     </div>
    </div>
   </div>

   {/* Products Count */}
   <div className="py-8 bg-card border-b border-border">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center">
      <p className="text-muted-foreground">
       Tổng cộng {products.length} sản phẩm
      </p>
     </div>
    </div>
   </div>

   {/* Products Grid */}
   <div className="py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     {products.length > 0 ? (
      <ProductList products={products} title="" />
     ) : (
      <div className="text-center py-12">
       <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
         className="w-8 h-8 text-muted-foreground"
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
        >
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
         />
        </svg>
       </div>
       <h3 className="text-xl font-semibold text-foreground mb-2">
        Chưa có sản phẩm nào
       </h3>
       <p className="text-muted-foreground">
        Hiện tại chưa có sản phẩm nào được đăng bán
       </p>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
