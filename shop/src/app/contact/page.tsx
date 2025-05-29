import { ContactInfo } from "@/components/ContactInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Liên hệ - AIGiáRẻ.vn",
 description:
  "Liên hệ với AIGiáRẻ.vn qua Zalo hoặc Facebook để được tư vấn và hỗ trợ nhanh chóng",
 openGraph: {
  title: "Liên hệ - AIGiáRẻ.vn",
  description:
   "Liên hệ với AIGiáRẻ.vn qua Zalo hoặc Facebook để được tư vấn và hỗ trợ nhanh chóng",
 },
};

export default function ContactPage() {
 return (
  <div className="min-h-screen bg-background">
   {/* Hero Section */}
   <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
     <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
       Liên hệ với chúng tôi
      </h1>
      <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
       Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ qua các kênh
       dưới đây để được phục vụ tốt nhất.
      </p>
     </div>
    </div>
   </div>

   {/* Contact Info Section */}
   <div className="py-20">
    <ContactInfo />
   </div>

   {/* FAQ Section */}
   <div className="py-20 bg-accent">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
       <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Câu hỏi thường gặp
       </h2>
       <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
       <p className="text-muted-foreground text-lg">
        Những câu hỏi được đặt nhiều nhất từ khách hàng
       </p>
      </div>

      <div className="space-y-6">
       <div className="bg-background rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-3">
         Làm thế nào để đặt hàng?
        </h3>
        <p className="text-muted-foreground">
         Bạn có thể xem sản phẩm trên website, sau đó liên hệ với chúng tôi qua
         Zalo hoặc Facebook để được tư vấn và đặt hàng. Chúng tôi sẽ hướng dẫn
         bạn chi tiết về quy trình đặt hàng.
        </p>
       </div>

       <div className="bg-background rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-3">
         Thời gian giao hàng là bao lâu?
        </h3>
        <p className="text-muted-foreground">
         Thời gian giao hàng phụ thuộc vào vị trí và loại sản phẩm. Thông
         thường, chúng tôi giao hàng trong vòng 1-3 ngày làm việc cho khu vực
         nội thành và 3-7 ngày cho các tỉnh thành khác.
        </p>
       </div>

       <div className="bg-background rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-3">
         Chính sách đổi trả như thế nào?
        </h3>
        <p className="text-muted-foreground">
         Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với
         điều kiện sản phẩm còn nguyên vẹn, chưa sử dụng và có đầy đủ hóa đơn,
         phụ kiện đi kèm.
        </p>
       </div>

       <div className="bg-background rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-3">
         Có hỗ trợ bảo hành không?
        </h3>
        <p className="text-muted-foreground">
         Tất cả sản phẩm đều được bảo hành theo quy định của nhà sản xuất. Chúng
         tôi cam kết hỗ trợ khách hàng trong suốt quá trình sử dụng sản phẩm.
        </p>
       </div>

       <div className="bg-background rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-3">
         Làm sao để theo dõi đơn hàng?
        </h3>
        <p className="text-muted-foreground">
         Sau khi đặt hàng thành công, chúng tôi sẽ cung cấp mã theo dõi đơn
         hàng. Bạn có thể liên hệ trực tiếp qua Zalo để kiểm tra tình trạng đơn
         hàng bất cứ lúc nào.
        </p>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Contact Methods */}
   <div className="py-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
     <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
       <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Các cách liên hệ khác
       </h2>
       <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
       <div className="bg-card rounded-2xl p-8 shadow-lg">
        <div className="flex items-center mb-6">
         <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
          <svg
           className="w-6 h-6 text-white"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
          >
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
           />
          </svg>
         </div>
         <h3 className="text-xl font-bold text-foreground">Giờ làm việc</h3>
        </div>
        <div className="space-y-3 text-muted-foreground">
         <div className="flex justify-between">
          <span>Thứ 2 - Thứ 6:</span>
          <span className="font-medium">8:00 - 22:00</span>
         </div>
         <div className="flex justify-between">
          <span>Thứ 7 - Chủ nhật:</span>
          <span className="font-medium">9:00 - 21:00</span>
         </div>
         <div className="flex justify-between">
          <span>Ngày lễ:</span>
          <span className="font-medium">9:00 - 18:00</span>
         </div>
        </div>
       </div>

       <div className="bg-card rounded-2xl p-8 shadow-lg">
        <div className="flex items-center mb-6">
         <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
          <svg
           className="w-6 h-6 text-white"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
          >
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
           />
          </svg>
         </div>
         <h3 className="text-xl font-bold text-foreground">Hỗ trợ khẩn cấp</h3>
        </div>
        <div className="space-y-3 text-muted-foreground">
         <p>Đối với các vấn đề khẩn cấp ngoài giờ làm việc:</p>
         <div className="bg-accent rounded-lg p-4">
          <p className="font-medium text-foreground">
           Hãy gửi tin nhắn qua Zalo, chúng tôi sẽ phản hồi sớm nhất có thể
          </p>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
