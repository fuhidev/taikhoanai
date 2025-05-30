"use client";

import { AIParticles } from "@/components/animations/AIParticles";
import { HeroAnimations } from "@/components/animations/HeroAnimations";
import { LoadingAIAnimation } from "@/components/animations/LottiePlayer";
import { ScrollAnimations } from "@/components/animations/ScrollAnimations";
import { ContactInfo } from "@/components/ContactInfo";
import { ProductList } from "@/components/ProductList";
import { Button } from "@/components/ui/Button";
import { getProducts } from "@/lib/firebaseService";
import { Product } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchProducts = async () => {
   try {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
   } catch (error) {
    console.error("Error fetching products:", error);
   } finally {
    setLoading(false);
   }
  };

  fetchProducts();
 }, []);
 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80">
    <div className="text-center">
     <div className="w-32 h-32 mb-6">
      <LoadingAIAnimation className="w-full h-full" />
     </div>
     <p className="text-white text-lg font-medium">Đang tải dữ liệu AI...</p>
     <div className="mt-4 flex justify-center">
      <div className="flex space-x-2">
       <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
       <div
        className="w-2 h-2 bg-secondary rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
       ></div>
       <div
        className="w-2 h-2 bg-secondary rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
       ></div>
      </div>
     </div>
    </div>
   </div>
  );
 }
 return (
  <ScrollAnimations>
   <div className="min-h-screen">
    {/* Hero Section */}
    <section className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-white overflow-hidden">
     <AIParticles />
     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
      <HeroAnimations>
       <div className="text-center max-w-4xl mx-auto">
        <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 leading-tight">
         Chào mừng đến với
         <span className="hero-subtitle block text-secondary ai-text">
          AIGiáRẻ.vn
         </span>
        </h1>
        <p className="hero-description text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
         Khám phá bộ sưu tập sản phẩm chất lượng cao với giá tốt nhất. Chúng tôi
         cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất.
        </p>
        <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
         <Link href="/products">
          <Button
           variant="secondary"
           size="lg"
           className="hero-button w-full sm:w-auto"
          >
           Xem sản phẩm
          </Button>
         </Link>
         <Link href="#contact">
          <Button
           variant="outline"
           size="lg"
           className="hero-button w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary"
          >
           Liên hệ ngay
          </Button>
         </Link>
        </div>
       </div>
      </HeroAnimations>
     </div>
    </section>
    {/* Featured Products */}
    {/* <section className="py-16 bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
       Sản phẩm nổi bật
      </h2>
      <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
       Những sản phẩm được khách hàng yêu thích và đánh giá cao nhất
      </p>
     </div>

     <ProductList
      products={products.filter((p) => p.featured).slice(0, 8)}
      title=""
     />

     {products.filter((p) => p.featured).length > 8 && (
      <div className="text-center mt-12">
       <Link href="/products">
        <Button variant="outline" size="lg">
         Xem tất cả sản phẩm
        </Button>
       </Link>
      </div>
     )}
    </div>
   </section> */}{" "}
    {/* All Products */}
    <section className="py-16 bg-accent animate-on-scroll">
     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
       <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Tất cả sản phẩm
       </h2>
       <div className="w-24 h-1 bg-primary mx-auto mb-6 progress-bar"></div>
       {/* <p className="text-muted-foreground text-lg max-w-2xl mx-auto"> */}
       {/* Khám phá toàn bộ bộ sưu tập sản phẩm của chúng tôi
      </p> */}
      </div>

      <ProductList products={products.slice(0, 12)} title="" />

      {products.length > 12 && (
       <div className="text-center mt-12">
        <Link href="/products">
         <Button variant="primary" size="lg">
          Xem thêm sản phẩm
         </Button>
        </Link>
       </div>
      )}
     </div>
    </section>
    {/* Why Choose Us */}
    <section className="py-16 bg-background animate-on-scroll">
     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
       <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Tại sao chọn chúng tôi?
       </h2>
       <div className="w-24 h-1 bg-primary mx-auto mb-6 progress-bar"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 stagger-cards">
       <div className="text-center p-6 card-item">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
         <svg
          className="w-8 h-8 text-white"
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
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">
         Chất lượng cao
        </h3>
        <p className="text-muted-foreground">
         Tất cả sản phẩm đều được kiểm tra kỹ lưỡng về chất lượng trước khi đến
         tay khách hàng.
        </p>
       </div>

       <div className="text-center p-6 card-item">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
         <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
         >
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
         </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">
         Giá cạnh tranh
        </h3>
        <p className="text-muted-foreground">
         Chúng tôi cam kết mang đến những mức giá tốt nhất và nhiều ưu đãi hấp
         dẫn.
        </p>
       </div>

       <div className="text-center p-6 card-item">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
         <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
         >
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19z"
          />
         </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">
         Hỗ trợ 24/7
        </h3>
        <p className="text-muted-foreground">
         Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ bạn mọi
         lúc.
        </p>
       </div>
      </div>
     </div>
    </section>
    {/* Contact Section */}
    <section id="contact" className="py-16 bg-accent animate-on-scroll">
     <ContactInfo />
    </section>
   </div>
  </ScrollAnimations>
 );
}
