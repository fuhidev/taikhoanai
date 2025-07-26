"use client";

import { ContactInfo } from "@/components/ContactInfo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function ExtensionPage() {
 const handleInstallExtension = () => {
  window.open(
   "https://chromewebstore.google.com/detail/aigiarevn/gkjgjkaofdmbnhhpknfkckfbnpmijanp",
   "_blank"
  );
 };

 return (
  <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
   {/* Header */}
   <div className="bg-primary text-white py-16">
    <div className="container mx-auto px-4">
     <div className="max-w-4xl mx-auto text-center">
      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
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
         d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
       </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
       taikhoanai.io.vn Extension
      </h1>
      <p className="text-xl text-primary-foreground/90 mb-8">
       Trình duyệt mở rộng giúp bạn tự động đăng nhập vào các nền tảng AI một
       cách nhanh chóng và thuận tiện
      </p>
      <div className="flex justify-center items-center space-x-8">
       <div className="text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
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
           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
         </svg>
        </div>
        <p className="text-sm font-medium">Bảo mật cao</p>
       </div>
       <div className="text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
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
           d="M13 10V3L4 14h7v7l9-11h-7z"
          />
         </svg>
        </div>
        <p className="text-sm font-medium">Nhanh chóng</p>
       </div>
       <div className="text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
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
           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
         </svg>
        </div>
        <p className="text-sm font-medium">Dễ sử dụng</p>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Main Content */}
   <div className="container mx-auto px-4 py-16">
    <div className="max-w-6xl mx-auto">
     {/* Install Section */}
     <div className="text-center mb-16">
      <Card className="bg-white shadow-xl max-w-2xl mx-auto border-2 border-primary/20">
       <CardHeader className="text-center pb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
         <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
         >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
         </svg>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
         Cài đặt từ Chrome Web Store
        </h2>
        <p className="text-muted-foreground">
         Đã có sẵn trên cửa hàng chính thức của Google Chrome
        </p>
       </CardHeader>
       <CardContent className="text-center pt-0">
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
         <div className="flex items-center justify-center mb-2">
          <svg
           className="w-5 h-5 text-green-600 mr-2"
           fill="currentColor"
           viewBox="0 0 20 20"
          >
           <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
           />
          </svg>
          <span className="text-green-800 font-semibold">
           Được Google xác minh
          </span>
         </div>
         <p className="text-green-700 text-sm">
          Extension đã được Google kiểm tra và phê duyệt, đảm bảo an toàn cho
          thiết bị của bạn
         </p>
        </div>

        <Button
         onClick={handleInstallExtension}
         size="lg"
         className="w-full mb-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 text-lg shadow-lg"
        >
         <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
         </svg>
         Cài đặt từ Chrome Web Store
        </Button>

        <p className="text-sm text-muted-foreground">
         Miễn phí • Cài đặt chỉ trong 1 cú click • Cập nhật tự động
        </p>
       </CardContent>
      </Card>
     </div>

     {/* Features */}
     <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">
       ✨ Tính năng nổi bật
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
       <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-8">
         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
           className="w-8 h-8 text-green-600"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
          >
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
           />
          </svg>
         </div>
         <h3 className="text-xl font-semibold mb-3">Tự động đăng nhập</h3>
         <p className="text-muted-foreground">
          Tự động điền thông tin đăng nhập cho ChatGPT, Google Gemini, Leonardo
          AI, HailuoAI
         </p>
        </CardContent>
       </Card>

       <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-8">
         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
           className="w-8 h-8 text-blue-600"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
          >
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
           />
          </svg>
         </div>
         <h3 className="text-xl font-semibold mb-3">Bảo mật dữ liệu</h3>
         <p className="text-muted-foreground">
          Dữ liệu được mã hóa và lưu trữ cục bộ, không gửi về server
         </p>
        </CardContent>
       </Card>

       <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-8">
         <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
           className="w-8 h-8 text-purple-600"
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
         <h3 className="text-xl font-semibold mb-3">Cập nhật tự động</h3>
         <p className="text-muted-foreground">
          Luôn được cập nhật phiên bản mới nhất từ Chrome Web Store
         </p>
        </CardContent>
       </Card>
      </div>
     </div>

     {/* How to Use */}
     <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">🚀 Cách sử dụng</h2>
      <div className="max-w-4xl mx-auto">
       <Card className="overflow-hidden">
        <CardContent className="p-0">
         <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
          <div className="p-8 text-center">
           <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            1
           </div>
           <h3 className="text-xl font-semibold mb-3">Cài đặt Extension</h3>
           <p className="text-muted-foreground">
            Click vào nút &quot;Cài đặt từ Chrome Web Store&quot; và thêm vào
            Chrome
           </p>
          </div>

          <div className="p-8 text-center">
           <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            2
           </div>
           <h3 className="text-xl font-semibold mb-3">Đăng nhập tài khoản</h3>
           <p className="text-muted-foreground">
            Click vào icon extension và đăng nhập bằng tài khoản taikhoanai.io.vn
           </p>
          </div>

          <div className="p-8 text-center">
           <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            3
           </div>
           <h3 className="text-xl font-semibold mb-3">Sử dụng ngay</h3>
           <p className="text-muted-foreground">
            Truy cập các nền tảng AI và tự động đăng nhập một cách dễ dàng
           </p>
          </div>
         </div>
        </CardContent>
       </Card>
      </div>
     </div>

     {/* Supported Platforms */}
     <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">
       🌐 Nền tảng được hỗ trợ
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
       {[
        {
         name: "ChatGPT",
         icon: "🤖",
         description: "OpenAI ChatGPT",
         url: "chat.openai.com",
        },
        {
         name: "Google Gemini",
         icon: "💎",
         description: "Google Gemini AI",
         url: "gemini.google.com",
        },
        {
         name: "Leonardo AI",
         icon: "🎨",
         description: "Leonardo AI Art",
         url: "leonardo.ai",
        },
        {
         name: "HailuoAI",
         icon: "🌊",
         description: "Hailuo AI Video",
         url: "hailuoai.com",
        },
       ].map((platform) => (
        <Card
         key={platform.name}
         className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
         <CardContent className="p-6">
          <div className="text-4xl mb-3">{platform.icon}</div>
          <h3 className="font-semibold text-lg mb-2">{platform.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">
           {platform.description}
          </p>
          <p className="text-xs text-primary font-mono">{platform.url}</p>
         </CardContent>
        </Card>
       ))}
      </div>
     </div>

     {/* FAQ */}
     <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">
       ❓ Câu hỏi thường gặp
      </h2>
      <div className="max-w-4xl mx-auto space-y-6">
       {[
        {
         question: "Extension có an toàn không?",
         answer:
          "Có, extension đã được Google xem xét và phê duyệt trên Chrome Web Store. Tất cả dữ liệu được mã hóa và lưu trữ cục bộ trên thiết bị của bạn.",
        },
        {
         question: "Extension có miễn phí không?",
         answer:
          "Có, extension hoàn toàn miễn phí để tải và sử dụng từ Chrome Web Store. Không có phí ẩn hay chi phí đăng ký.",
        },
        {
         question: "Extension có tương thích với các trình duyệt khác không?",
         answer:
          "Extension được thiết kế cho Chrome và các trình duyệt dựa trên Chromium như Edge, Brave. Hiện tại chưa hỗ trợ Firefox hay Safari.",
        },
        {
         question: "Làm thế nào để cập nhật extension?",
         answer:
          "Extension sẽ tự động cập nhật thông qua Chrome Web Store. Bạn không cần thực hiện bất kỳ thao tác nào để nhận phiên bản mới nhất.",
        },
        {
         question: "Tôi có cần tài khoản taikhoanai.io.vn không?",
         answer:
          "Có, bạn cần có tài khoản taikhoanai.io.vn để sử dụng extension. Nếu chưa có, bạn có thể đăng ký miễn phí tại taikhoanai.io.vn.",
        },
       ].map((faq, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
         <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-3 text-primary">
           {faq.question}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
         </CardContent>
        </Card>
       ))}
      </div>
     </div>

     {/* Support */}
     <div className="mt-16">
      <ContactInfo />
     </div>
    </div>
   </div>
  </div>
 );
}
