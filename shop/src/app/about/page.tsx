import { ContactInfo } from "@/components/ContactInfo";
import { Button } from "@/components/ui/Button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
 title: "Giới thiệu - AIGiáRẻ.vn",
 description:
  "Tìm hiểu về AIGiáRẻ.vn - đối tác tin cậy cung cấp sản phẩm chất lượng cao với giá tốt nhất thị trường",
 openGraph: {
  title: "Giới thiệu - AIGiáRẻ.vn",
  description:
   "Tìm hiểu về AIGiáRẻ.vn - đối tác tin cậy cung cấp sản phẩm chất lượng cao",
 },
};

export default function AboutPage() {
 return (
  <div className="min-h-screen bg-background">
   {/* Hero Section */}
   <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
     <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Về chúng tôi</h1>
      <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
       Chúng tôi là đối tác tin cậy trong việc cung cấp các sản phẩm chất lượng
       cao với giá cả phải chăng và dịch vụ khách hàng xuất sắc.
      </p>
     </div>
    </div>
   </div>

   {/* Mission & Vision */}
   <div className="py-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
       <div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
         Sứ mệnh của chúng tôi
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
         Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao
         nhất với giá cả hợp lý. Mỗi sản phẩm đều được tuyển chọn kỹ lưỡng để
         đảm bảo đáp ứng nhu cầu và mong đợi của khách hàng.
        </p>
        <p className="text-muted-foreground text-lg leading-relaxed">
         Với đội ngũ chuyên nghiệp và tận tâm, chúng tôi không ngừng nỗ lực để
         cải thiện chất lượng dịch vụ và mang lại trải nghiệm mua sắm tuyệt vời
         nhất.
        </p>
       </div>
       <div className="order-first md:order-last">
        <div className="bg-accent rounded-2xl p-8 h-80 flex items-center justify-center">
         <div className="text-center">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
           <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
           >
            <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth={2}
             d="M13 10V3L4 14h7v7l9-11h-7z"
            />
           </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground">Sứ mệnh</h3>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Values */}
   <div className="py-20 bg-accent">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
       Giá trị cốt lõi
      </h2>
      <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
       Những giá trị mà chúng tôi luôn theo đuổi và thực hiện trong mỗi hoạt
       động kinh doanh
      </p>
     </div>

     <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-background rounded-2xl p-8 text-center shadow-lg">
       <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
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
       <h3 className="text-xl font-bold text-foreground mb-4">Chất lượng</h3>
       <p className="text-muted-foreground">
        Cam kết cung cấp sản phẩm chất lượng cao, được kiểm tra kỹ lưỡng trước
        khi đến tay khách hàng.
       </p>
      </div>

      <div className="bg-background rounded-2xl p-8 text-center shadow-lg">
       <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
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
       <h3 className="text-xl font-bold text-foreground mb-4">Giá cả hợp lý</h3>
       <p className="text-muted-foreground">
        Mang đến những mức giá tốt nhất thị trường với nhiều chương trình khuyến
        mãi hấp dẫn.
       </p>
      </div>

      <div className="bg-background rounded-2xl p-8 text-center shadow-lg">
       <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
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
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
         />
        </svg>
       </div>
       <h3 className="text-xl font-bold text-foreground mb-4">Hỗ trợ 24/7</h3>
       <p className="text-muted-foreground">
        Đội ngũ chăm sóc khách hàng chuyên nghiệp, sẵn sàng hỗ trợ bạn mọi lúc,
        mọi nơi.
       </p>
      </div>
     </div>
    </div>
   </div>

   {/* Why Choose Us */}
   <div className="py-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
       <div className="order-last md:order-first">
        <div className="bg-accent rounded-2xl p-8 h-80 flex items-center justify-center">
         <div className="text-center">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
           <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
           >
            <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth={2}
             d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
           </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground">
           Tại sao chọn chúng tôi?
          </h3>
         </div>
        </div>
       </div>
       <div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
         Tại sao chọn chúng tôi?
        </h2>
        <div className="space-y-6">
         <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
           <svg
            className="w-4 h-4 text-white"
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
          <div>
           <h3 className="text-lg font-semibold text-foreground mb-2">
            Kinh nghiệm lâu năm
           </h3>
           <p className="text-muted-foreground">
            Với nhiều năm kinh nghiệm trong ngành, chúng tôi hiểu rõ nhu cầu và
            mong đợi của khách hàng.
           </p>
          </div>
         </div>

         <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
           <svg
            className="w-4 h-4 text-white"
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
          <div>
           <h3 className="text-lg font-semibold text-foreground mb-2">
            Đảm bảo chất lượng
           </h3>
           <p className="text-muted-foreground">
            Mỗi sản phẩm đều được kiểm tra nghiêm ngặt và có chính sách bảo hành
            rõ ràng.
           </p>
          </div>
         </div>

         <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
           <svg
            className="w-4 h-4 text-white"
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
          <div>
           <h3 className="text-lg font-semibold text-foreground mb-2">
            Giao hàng nhanh chóng
           </h3>
           <p className="text-muted-foreground">
            Hệ thống giao hàng hiện đại, đảm bảo sản phẩm đến tay khách hàng
            nhanh nhất.
           </p>
          </div>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Stats */}
   <div className="py-20 bg-primary text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
       <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
       <div className="text-white/80">Khách hàng hài lòng</div>
      </div>
      <div>
       <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
       <div className="text-white/80">Sản phẩm chất lượng</div>
      </div>
      <div>
       <div className="text-4xl md:text-5xl font-bold mb-2">99%</div>
       <div className="text-white/80">Đánh giá tích cực</div>
      </div>
      <div>
       <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
       <div className="text-white/80">Hỗ trợ khách hàng</div>
      </div>
     </div>
    </div>
   </div>

   {/* CTA Section */}
   <div className="py-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
       Sẵn sàng khám phá sản phẩm?
      </h2>
      <p className="text-muted-foreground text-lg mb-8">
       Hãy xem bộ sưu tập sản phẩm phong phú của chúng tôi và tìm những sản phẩm
       phù hợp với nhu cầu của bạn.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
       <Link href="/products">
        <Button variant="primary" size="lg">
         Xem sản phẩm
        </Button>
       </Link>
       <Link href="#contact">
        <Button variant="outline" size="lg">
         Liên hệ tư vấn
        </Button>
       </Link>
      </div>
     </div>
    </div>
   </div>

   {/* Contact Section */}
   <div id="contact" className="py-20 bg-accent">
    <ContactInfo />
   </div>
  </div>
 );
}
