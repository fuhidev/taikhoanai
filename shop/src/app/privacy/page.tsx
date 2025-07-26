import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Chính Sách Bảo Mật | taikhoanai.io.vn",
 description:
  "Chính sách bảo mật thông tin khách hàng của taikhoanai.io.vn - Cam kết bảo vệ dữ liệu cá nhân của bạn khi sử dụng dịch vụ AI accounts.",
 keywords:
  "chính sách bảo mật, quyền riêng tư, bảo vệ dữ liệu, taikhoanai, ai accounts",
};

export default function PrivacyPage() {
 return (
  <div className="min-h-screen bg-background py-12">
   <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
    {/* Header */}
    <div className="text-center mb-12">
     <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
      Chính Sách Bảo Mật
     </h1>
     <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
     <p className="text-lg text-muted-foreground">
      Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
     </p>
    </div>

    {/* Content */}
    <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg">
     <div className="prose prose-lg max-w-none">
      {/* Introduction */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        Cam Kết Của Chúng Tôi
       </h2>{" "}
       <p className="text-muted-foreground leading-relaxed mb-4">
        taikhoanai.io.vn cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách
        hàng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và
        bảo vệ thông tin của bạn khi sử dụng dịch vụ AI accounts và các sản phẩm
        liên quan của chúng tôi.
       </p>
       <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
        <p className="text-foreground font-medium">
         🔒 Chúng tôi KHÔNG bao giờ bán, cho thuê hoặc chia sẻ thông tin cá nhân
         của bạn với bên thứ ba mà không có sự đồng ý của bạn.
        </p>
       </div>
      </section>

      {/* Section 1 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        1. Thông Tin Chúng Tôi Thu Thập
       </h2>
       <div className="space-y-4">
        <div>
         <h3 className="text-xl font-semibold text-foreground mb-2">
          Thông tin bạn cung cấp trực tiếp:
         </h3>
         <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
          <li>Họ tên và thông tin liên hệ</li>
          <li>Số điện thoại và địa chỉ email</li>
          <li>Thông tin thanh toán (được mã hóa)</li>
          <li>Nội dung tin nhắn và phản hồi</li>
         </ul>
        </div>
        <div>
         <h3 className="text-xl font-semibold text-foreground mb-2">
          Thông tin thu thập tự động:
         </h3>
         <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
          <li>Địa chỉ IP và thông tin thiết bị</li>
          <li>Thời gian truy cập và trang đã xem</li>
          <li>Trình duyệt và hệ điều hành</li>
          <li>Cookies và dữ liệu phiên làm việc</li>
         </ul>
        </div>
       </div>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        2. Mục Đích Sử Dụng Thông Tin
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:
       </p>
       <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-primary/5 p-4 rounded-lg">
         <h4 className="font-semibold text-foreground mb-2">
          Cung cấp dịch vụ
         </h4>
         <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Xử lý đơn hàng và giao hàng</li>
          <li>• Cung cấp hỗ trợ khách hàng</li>
          <li>• Quản lý tài khoản người dùng</li>
         </ul>
        </div>
        <div className="bg-secondary/10 p-4 rounded-lg">
         <h4 className="font-semibold text-foreground mb-2">
          Cải thiện dịch vụ
         </h4>
         <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Phân tích hành vi người dùng</li>
          <li>• Tối ưu hóa website</li>
          <li>• Phát triển tính năng mới</li>
         </ul>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
         <h4 className="font-semibold text-foreground mb-2">Liên lạc</h4>
         <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Gửi thông báo quan trọng</li>
          <li>• Chia sẻ khuyến mãi (nếu đồng ý)</li>
          <li>• Phản hồi câu hỏi</li>
         </ul>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
         <h4 className="font-semibold text-foreground mb-2">Bảo mật</h4>
         <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Ngăn chặn gian lận</li>
          <li>• Bảo vệ tài khoản</li>
          <li>• Tuân thủ pháp luật</li>
         </ul>
        </div>
       </div>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        3. Cách Chúng Tôi Bảo Vệ Thông Tin
       </h2>
       <div className="space-y-4">
        <div className="bg-card border border-primary/20 p-6 rounded-lg">
         <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
           🔐
          </span>
          Mã Hóa Dữ Liệu
         </h3>
         <p className="text-muted-foreground">
          Tất cả thông tin nhạy cảm được mã hóa bằng SSL/TLS 256-bit trong quá
          trình truyền tải và AES-256 khi lưu trữ.
         </p>
        </div>

        <div className="bg-card border border-primary/20 p-6 rounded-lg">
         <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
           🛡️
          </span>
          Kiểm Soát Truy Cập
         </h3>
         <p className="text-muted-foreground">
          Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin cá nhân, với
          hệ thống xác thực đa lớp và giám sát hoạt động.
         </p>
        </div>

        <div className="bg-card border border-primary/20 p-6 rounded-lg">
         <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
           🔄
          </span>
          Sao Lưu Thường Xuyên
         </h3>
         <p className="text-muted-foreground">
          Dữ liệu được sao lưu tự động hàng ngày và lưu trữ ở nhiều địa điểm
          khác nhau để đảm bảo an toàn.
         </p>
        </div>
       </div>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        4. Chia Sẻ Thông Tin Với Bên Thứ Ba
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Chúng tôi chỉ chia sẻ thông tin của bạn trong các trường hợp sau:
       </p>
       <div className="space-y-3">
        <div className="flex items-start space-x-3">
         <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mt-1">
          !
         </span>
         <div>
          <p className="font-medium text-foreground">Yêu cầu pháp lý</p>
          <p className="text-sm text-muted-foreground">
           Khi được yêu cầu bởi cơ quan chức năng có thẩm quyền
          </p>
         </div>
        </div>
        <div className="flex items-start space-x-3">
         <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-1">
          🤝
         </span>
         <div>
          <p className="font-medium text-foreground">Đối tác dịch vụ</p>
          <p className="text-sm text-muted-foreground">
           Với các đối tác được ủy quyền để cung cấp dịch vụ (thanh toán, vận
           chuyển)
          </p>
         </div>
        </div>
        <div className="flex items-start space-x-3">
         <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-1">
          ✓
         </span>
         <div>
          <p className="font-medium text-foreground">Sự đồng ý của bạn</p>
          <p className="text-sm text-muted-foreground">
           Khi bạn đã cho phép rõ ràng để chia sẻ thông tin
          </p>
         </div>
        </div>
       </div>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        5. Quyền Của Bạn
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Bạn có các quyền sau đối với thông tin cá nhân của mình:
       </p>
       <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
         <h4 className="font-semibold text-foreground mb-2">Quyền truy cập</h4>
         <p className="text-sm text-muted-foreground">
          Yêu cầu xem thông tin cá nhân chúng tôi đang lưu trữ
         </p>
        </div>
        <div className="bg-secondary/10 p-4 rounded-lg border-l-4 border-secondary">
         <h4 className="font-semibold text-foreground mb-2">Quyền chỉnh sửa</h4>
         <p className="text-sm text-muted-foreground">
          Cập nhật hoặc sửa đổi thông tin không chính xác
         </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
         <h4 className="font-semibold text-foreground mb-2">Quyền xóa</h4>
         <p className="text-sm text-muted-foreground">
          Yêu cầu xóa thông tin cá nhân trong một số trường hợp
         </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
         <h4 className="font-semibold text-foreground mb-2">Quyền rút lại</h4>
         <p className="text-sm text-muted-foreground">
          Rút lại sự đồng ý xử lý dữ liệu bất cứ lúc nào
         </p>
        </div>
       </div>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        6. Cookies và Công Nghệ Theo Dõi
       </h2>
       <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
         Chúng tôi sử dụng cookies và các công nghệ tương tự để:
        </p>
        <div className="bg-card border p-4 rounded-lg">
         <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start">
           <span className="text-primary mr-2">•</span>
           Ghi nhớ thông tin đăng nhập và tùy chọn của bạn
          </li>
          <li className="flex items-start">
           <span className="text-primary mr-2">•</span>
           Phân tích cách bạn sử dụng website để cải thiện trải nghiệm
          </li>
          <li className="flex items-start">
           <span className="text-primary mr-2">•</span>
           Hiển thị nội dung và quảng cáo phù hợp với sở thích
          </li>
          <li className="flex items-start">
           <span className="text-primary mr-2">•</span>
           Bảo vệ website khỏi các hoạt động độc hại
          </li>
         </ul>
        </div>
        <p className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded-lg">
         💡 <strong>Lưu ý:</strong> Bạn có thể tắt cookies trong trình duyệt,
         nhưng điều này có thể ảnh hưởng đến chức năng của website.
        </p>
       </div>
      </section>

      {/* Section 7 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        7. Thay Đổi Chính Sách
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Khi có
        thay đổi quan trọng, chúng tôi sẽ:
       </p>
       <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
        <li>Thông báo trước ít nhất 30 ngày qua email</li>
        <li>Đăng thông báo nổi bật trên website</li>
        <li>Gửi tin nhắn qua các kênh liên lạc chính</li>
       </ul>
      </section>

      {/* Section 8 */}
      <section className="mb-8">
       <h2 className="text-2xl font-bold text-foreground mb-4">
        8. Liên Hệ Về Quyền Riêng Tư
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-4">
        Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện quyền của
        mình, vui lòng liên hệ:
       </p>
       <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
        <div className="grid md:grid-cols-2 gap-4">
         <div>
          <h4 className="font-semibold text-foreground mb-2">
           Liên hệ trực tiếp
          </h4>
          <ul className="text-muted-foreground space-y-1">
           <li>
            <strong>Zalo:</strong> 094 348 79 68
           </li>{" "}
           <li>
            <strong>Facebook:</strong> taikhoanai.io.vn Fanpage
           </li>
          </ul>
         </div>
         <div>
          <h4 className="font-semibold text-foreground mb-2">
           Thời gian phản hồi
          </h4>
          <ul className="text-muted-foreground space-y-1">
           <li>• Hỗ trợ: 8:00 - 22:00 hàng ngày</li>
           <li>• Phản hồi trong vòng 24 giờ</li>
          </ul>
         </div>
        </div>
       </div>
      </section>
     </div>
    </div>

    {/* Navigation */}
    <div className="mt-12 text-center">
     <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a
       href="/terms"
       className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
       Điều Khoản Sử Dụng
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
