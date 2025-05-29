import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Điều Khoản Sử Dụng | Siêu Thị MMO",
 description:
  "Điều khoản sử dụng dịch vụ của Siêu Thị MMO - Tìm hiểu về quyền và nghĩa vụ khi sử dụng sản phẩm của chúng tôi.",
 keywords: "điều khoản sử dụng, quy định, siêu thị mmo",
};

export default function TermsPage() {
 return (
  <div className="min-h-screen bg-background py-12">
   <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
    {/* Header */}
    <div className="text-center mb-12">
     <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
      Điều Khoản Sử Dụng
     </h1>
     <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
     <p className="text-lg text-muted-foreground">
      Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
     </p>
    </div>

    {/* Content */}
    <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg">
     <div className="prose prose-lg max-w-none">
      {/* Section 1 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        1. Chấp Nhận Điều Khoản
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Bằng việc truy cập và sử dụng website Siêu Thị MMO, bạn đồng ý tuân thủ
        và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu dưới
        đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này,
        vui lòng không sử dụng dịch vụ của chúng tôi.
       </p>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        2. Mô Tả Dịch Vụ
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Siêu Thị MMO cung cấp các sản phẩm và dịch vụ MMO (Make Money Online)
        bao gồm nhưng không giới hạn:
       </p>
       <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
        <li>Tài khoản và profile các nền tảng MMO</li>
        <li>Tools và phần mềm hỗ trợ kiếm tiền online</li>
        <li>Khóa học và hướng dẫn MMO</li>
        <li>Dịch vụ tư vấn và hỗ trợ kỹ thuật</li>
       </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        3. Quyền và Nghĩa Vụ Của Người Dùng
       </h2>
       <div className="space-y-4">
        <div>
         <h3 className="text-xl font-semibold text-foreground mb-2">
          Quyền của bạn:
         </h3>
         <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
          <li>Được sử dụng sản phẩm theo đúng mục đích</li>
          <li>Được hỗ trợ kỹ thuật và tư vấn</li>
          <li>Được bảo mật thông tin cá nhân</li>
          <li>Được hoàn tiền theo chính sách quy định</li>
         </ul>
        </div>
        <div>
         <h3 className="text-xl font-semibold text-foreground mb-2">
          Nghĩa vụ của bạn:
         </h3>
         <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
          <li>Cung cấp thông tin chính xác khi đăng ký</li>
          <li>Sử dụng sản phẩm theo đúng hướng dẫn</li>
          <li>Không chia sẻ hoặc bán lại sản phẩm</li>
          <li>Tuân thủ pháp luật và quy định có liên quan</li>
         </ul>
        </div>
       </div>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        4. Chính Sách Thanh Toán và Hoàn Tiền
       </h2>
       <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
         <strong>Thanh toán:</strong> Chúng tôi chấp nhận các hình thức thanh
         toán: chuyển khoản ngân hàng, ví điện tử, thẻ cào điện thoại.
        </p>
        <p className="text-muted-foreground leading-relaxed">
         <strong>Hoàn tiền:</strong> Trong trường hợp sản phẩm không hoạt động
         đúng như mô tả, bạn có thể yêu cầu hoàn tiền trong vòng 24 giờ sau khi
         mua.
        </p>
       </div>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        5. Hạn Chế Trách Nhiệm
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Siêu Thị MMO không chịu trách nhiệm về:
       </p>
       <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
        <li>Thiệt hại gián tiếp phát sinh từ việc sử dụng sản phẩm</li>
        <li>Các thay đổi chính sách từ phía nền tảng thứ ba</li>
        <li>Mất mát dữ liệu do lỗi người dùng</li>
        <li>Vi phạm pháp luật của người dùng khi sử dụng sản phẩm</li>
       </ul>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        6. Sở Hữu Trí Tuệ
       </h2>
       <p className="text-muted-foreground leading-relaxed">
        Tất cả nội dung, thiết kế, logo, và tài liệu trên website thuộc quyền sở
        hữu của Siêu Thị MMO. Nghiêm cấm sao chép, phân phối hoặc sử dụng cho
        mục đích thương mại mà không có sự cho phép bằng văn bản.
       </p>
      </section>

      {/* Section 7 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        7. Sửa Đổi Điều Khoản
       </h2>
       <p className="text-muted-foreground leading-relaxed">
        Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Các thay
        đổi sẽ có hiệu lực ngay khi được đăng tải trên website. Việc bạn tiếp
        tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc chấp nhận
        các điều khoản mới.
       </p>
      </section>

      {/* Section 8 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        8. Thông Tin Liên Hệ
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ
        với chúng tôi qua:
       </p>
       <div className="bg-primary/5 p-4 rounded-lg">
        <ul className="text-muted-foreground space-y-2">
         <li>
          <strong>Zalo:</strong>{" "}
          {process.env.NEXT_PUBLIC_ZALO_PHONE || "0123456789"}
         </li>
         <li>
          <strong>Facebook:</strong> Siêu Thị MMO Fanpage
         </li>
         <li>
          <strong>Thời gian hỗ trợ:</strong> 8:00 - 22:00 hàng ngày
         </li>
        </ul>
       </div>
      </section>
     </div>
    </div>

    {/* Navigation */}
    <div className="mt-12 text-center">
     <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a
       href="/privacy"
       className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
       Chính Sách Bảo Mật
      </a>
      <a
       href="/contact"
       className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
      >
       Liên Hệ Hỗ Trợ
      </a>
     </div>
    </div>
   </div>
  </div>
 );
}
