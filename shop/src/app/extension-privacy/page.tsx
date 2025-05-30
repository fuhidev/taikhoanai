import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Chính Sách Quyền Riêng Tư Extension | aigiare.vn",
 description:
  "Chính sách quyền riêng tư của aigiare.vn Extension - Cam kết bảo vệ thông tin người dùng extension Chrome.",
 keywords:
  "chính sách quyền riêng tư, extension, chrome extension, aigiare.vn, bảo mật",
};

export default function ExtensionPrivacyPage() {
 return (
  <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
   {/* Header */}
   <div className="bg-primary text-white py-16">
    <div className="container mx-auto px-4">
     <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
       Chính Sách Quyền Riêng Tư Extension
      </h1>
      <p className="text-xl text-primary-foreground/90">
       Cam kết bảo vệ quyền riêng tư của bạn khi sử dụng aigiare.vn Extension
      </p>
     </div>
    </div>
   </div>

   {/* Content */}
   <div className="container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
     {/* Last Updated */}
     <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
      <p className="text-blue-800 font-medium">
       Cập nhật lần cuối: 30 tháng 5, 2025
      </p>
     </div>

     {/* Introduction */}
     <section className="mb-8">
      <p className="text-muted-foreground leading-relaxed mb-4">
       Chào mừng bạn đến với extension chính thức của aigiare.vn! Chúng tôi cam
       kết bảo vệ quyền riêng tư của bạn và đảm bảo rằng trải nghiệm của bạn với
       extension là an toàn và minh bạch. Chính sách Quyền riêng tư này giải
       thích cách thức chúng tôi xử lý thông tin khi bạn sử dụng extension của
       chúng tôi.
      </p>
     </section>

     {/* Section 1 */}
     <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
       1. Thông tin chúng tôi thu thập
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
       Extension aigiare.vn được thiết kế để không thu thập bất kỳ thông tin
       nhận dạng cá nhân nào của bạn.
      </p>

      <div className="space-y-4">
       <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
        <h3 className="text-lg font-semibold text-foreground mb-3">
         Thông tin đăng nhập:
        </h3>
        <p className="text-muted-foreground leading-relaxed">
         Extension của chúng tôi cho phép bạn tự động đăng nhập vào các nền tảng
         AI như ChatGPT, Google Gemini, Leonardo AI, HailuoAI. Để thực hiện chức
         năng này, extension sẽ lưu trữ cục bộ và mã hóa thông tin đăng nhập của
         bạn trên thiết bị của bạn. Thông tin này chỉ được sử dụng để tự động
         điền vào các trường đăng nhập khi bạn truy cập các trang web được hỗ
         trợ và không bao giờ được gửi về máy chủ của aigiare.vn hoặc bất kỳ bên
         thứ ba nào khác.
        </p>
       </div>

       <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
        <h3 className="text-lg font-semibold text-foreground mb-3">
         Dữ liệu sử dụng ẩn danh (không bắt buộc):
        </h3>
        <p className="text-muted-foreground leading-relaxed">
         Để cải thiện chất lượng extension, chúng tôi có thể thu thập các dữ
         liệu sử dụng ẩn danh không định danh như số lần extension được sử dụng,
         tính năng nào được truy cập nhiều nhất hoặc các lỗi kỹ thuật phát sinh.
         Dữ liệu này không thể được liên kết với bất kỳ cá nhân nào và chỉ dùng
         cho mục đích phân tích tổng hợp. Bạn có thể chọn không tham gia việc
         thu thập dữ liệu này trong cài đặt của extension.
        </p>
       </div>
      </div>
     </section>

     {/* Section 2 */}
     <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
       2. Cách chúng tôi sử dụng thông tin
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
       Thông tin duy nhất mà extension xử lý (thông tin đăng nhập được mã hóa)
       chỉ được sử dụng cho mục đích duy nhất là:
      </p>
      <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
       <p className="text-amber-800 font-medium">
        Thực hiện chức năng tự động đăng nhập: Giúp bạn truy cập các nền tảng AI
        một cách nhanh chóng và thuận tiện.
       </p>
      </div>
      <p className="text-muted-foreground leading-relaxed mt-4">
       Chúng tôi không sử dụng thông tin của bạn cho các mục đích quảng cáo,
       tiếp thị hay chia sẻ với bên thứ ba dưới bất kỳ hình thức nào.
      </p>
     </section>

     {/* Section 3 */}
     <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
       3. Chia sẻ thông tin của bạn
      </h2>
      <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
       <p className="text-red-800 font-medium">
        Chúng tôi không chia sẻ bất kỳ thông tin cá nhân nào của bạn với bất kỳ
        bên thứ ba nào. Mọi thông tin đăng nhập được mã hóa đều được lưu trữ cục
        bộ trên thiết bị của bạn và không được truyền đi.
       </p>
      </div>
     </section>

     {/* Section 4 */}
     <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
       4. Bảo mật dữ liệu
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
       Chúng tôi đặt sự an toàn thông tin của bạn lên hàng đầu:
      </p>
      <div className="grid md:grid-cols-1 gap-4">
       <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
         🔐 Mã hóa mạnh mẽ
        </h3>
        <p className="text-blue-700">
         Tất cả thông tin đăng nhập được lưu trữ cục bộ trên thiết bị của bạn
         đều được mã hóa bằng các tiêu chuẩn bảo mật ngành.
        </p>
       </div>
       <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">
         🔒 Quyền truy cập hạn chế
        </h3>
        <p className="text-purple-700">
         Extension chỉ yêu cầu các quyền tối thiểu cần thiết để thực hiện chức
         năng chính (ví dụ: truy cập các trang web cụ thể để điền thông tin đăng
         nhập).
        </p>
       </div>
       <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
         ✅ Tuân thủ tiêu chuẩn Chrome Web Store
        </h3>
        <p className="text-green-700">
         Chúng tôi tuân thủ nghiêm ngặt các chính sách và nguyên tắc bảo mật của
         Google Chrome Web Store.
        </p>
       </div>
      </div>
     </section>

     {/* Section 5 */}
     <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
       5. Quyền của bạn
      </h2>
      <p className="text-muted-foreground leading-relaxed">
       Vì chúng tôi không thu thập thông tin nhận dạng cá nhân, nên không có dữ
       liệu cá nhân nào của bạn được lưu trữ trên máy chủ của chúng tôi. Bạn có
       toàn quyền kiểm soát thông tin đăng nhập được lưu trữ trong extension
       trên thiết bị của mình và có thể xóa chúng bất cứ lúc nào thông qua cài
       đặt của extension hoặc xóa extension khỏi trình duyệt của bạn.
      </p>
     </section>

     {/* Section 6 */}
     <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
       6. Thay đổi Chính sách Quyền riêng tư này
      </h2>
      <p className="text-muted-foreground leading-relaxed">
       Chúng tôi có thể cập nhật Chính sách Quyền riêng tư này theo thời gian để
       phản ánh những thay đổi trong thực tiễn của chúng tôi hoặc do yêu cầu
       pháp lý. Khi chúng tôi thực hiện các thay đổi quan trọng, chúng tôi sẽ
       cập nhật ngày "Cập nhật lần cuối" ở đầu trang. Chúng tôi khuyến khích bạn
       xem xét Chính sách Quyền riêng tư này định kỳ.
      </p>
     </section>

     {/* Section 7 */}
     <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
       7. Liên hệ với chúng tôi
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
       Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Chính sách Quyền riêng tư
       này hoặc cách chúng tôi xử lý dữ liệu, vui lòng liên hệ với chúng tôi
       qua:
      </p>
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 p-6 rounded-lg">
       <div className="space-y-2">
        <p className="font-medium text-foreground">
         🌐 Website:{" "}
         <a href="https://aigiare.vn" className="text-primary hover:underline">
          aigiare.vn
         </a>
        </p>
        <p className="font-medium text-foreground">
         📧 Email hỗ trợ:{" "}
         <a
          href="mailto:cskh@aigiare.vn"
          className="text-primary hover:underline"
         >
          cskh@aigiare.vn
         </a>
        </p>
       </div>
      </div>
     </section>

     {/* Back to Home */}
     <div className="text-center pt-8 border-t border-gray-200">
      <a
       href="/"
       className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
       ← Quay về trang chủ
      </a>
     </div>
    </div>
   </div>
  </div>
 );
}
