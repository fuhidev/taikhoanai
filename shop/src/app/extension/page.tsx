"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useEffect, useState } from "react";

interface ExtensionVersion {
 version: string;
 downloadUrl: string;
 releaseNotes: string;
 required: boolean;
 publishedAt: string;
}

export default function ExtensionPage() {
 const [extensionData, setExtensionData] = useState<ExtensionVersion | null>(
  null
 );
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchExtensionData = async () => {
   try {
    const response = await fetch(
     "https://portal.aigiare.vn/api/extension/version"
    );
    if (!response.ok) {
     throw new Error("Không thể tải thông tin extension");
    }
    const data = await response.json();
    setExtensionData(data);
   } catch (err) {
    setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
   } finally {
    setLoading(false);
   }
  };

  fetchExtensionData();
 }, []);

 const handleDownload = () => {
  if (extensionData?.downloadUrl) {
   window.open(extensionData.downloadUrl, "_blank");
  }
 };

 return (
  <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
   {/* Header */}
   <div className="bg-primary text-white py-16">
    <div className="container mx-auto px-4">
     <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
       aigiare.vn Extension
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
     {/* Download Section */}
     <div className="text-center mb-16">
      {loading ? (
       <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-muted-foreground">
         Đang tải thông tin extension...
        </span>
       </div>
      ) : error ? (
       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">⚠️ {error}</p>
       </div>
      ) : extensionData ? (
       <Card className="bg-white shadow-xl max-w-2xl mx-auto">
        <CardHeader className="text-center">
         <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
           className="w-10 h-10 text-white"
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
         <h2 className="text-2xl font-bold text-foreground">
          aigiare.vn Extension v{extensionData.version}
         </h2>
         <p className="text-muted-foreground">
          Phát hành:{" "}
          {new Date(extensionData.publishedAt).toLocaleDateString("vi-VN")}
         </p>
        </CardHeader>
        <CardContent className="text-center">
         {extensionData.releaseNotes && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
           <h3 className="font-semibold text-blue-800 mb-2">
            📝 Ghi chú phiên bản:
           </h3>
           <p className="text-blue-700 text-sm">{extensionData.releaseNotes}</p>
          </div>
         )}
         <Button onClick={handleDownload} size="lg" className="w-full mb-4">
          📥 Tải Extension về máy
         </Button>
         <p className="text-sm text-muted-foreground">
          Tệp zip sẽ được tải về, sau đó bạn cần giải nén và cài đặt thủ công
          vào Chrome
         </p>
        </CardContent>
       </Card>
      ) : null}
     </div>

     {/* Features */}
     <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">
       ✨ Tính năng nổi bật
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
       <Card className="text-center">
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

       <Card className="text-center">
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

       <Card className="text-center">
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
         <h3 className="text-xl font-semibold mb-3">Hiệu suất cao</h3>
         <p className="text-muted-foreground">
          Giao diện đơn giản, sử dụng ít tài nguyên hệ thống
         </p>
        </CardContent>
       </Card>
      </div>
     </div>

     {/* Installation Guide */}
     <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">
       🔧 Hướng dẫn cài đặt
      </h2>
      <div className="max-w-4xl mx-auto">
       <Card>
        <CardContent className="p-8">
         <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
           <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
            1
           </div>
           <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3">
             Tải và giải nén extension
            </h3>{" "}
            <p className="text-muted-foreground mb-4">
             Nhấn nút &quot;Tải Extension về máy&quot; ở trên để tải file zip về
             máy tính của bạn.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
             <p className="text-yellow-800 text-sm">
              💡 <strong>Lưu ý:</strong> Giải nén file zip vào một thư mục mà
              bạn không sẽ xóa (ví dụ: D:\Extensions\aigiare-extension)
             </p>
            </div>
           </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-4">
           <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
            2
           </div>
           <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3">Mở Chrome Extensions</h3>
            <p className="text-muted-foreground mb-4">
             Mở trình duyệt Chrome và truy cập vào:
            </p>
            <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
             chrome://extensions/
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
             Hoặc vào menu Chrome → More tools → Extensions
            </p>
           </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-4">
           <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
            3
           </div>
           <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3">Bật Developer mode</h3>{" "}
            <p className="text-muted-foreground mb-4">
             Ở góc trên bên phải trang Extensions, bật công tắc &quot;Developer
             mode&quot;
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
             <p className="text-blue-800 text-sm">
              ℹ️ Developer mode cho phép bạn cài đặt extension từ mã nguồn cục
              bộ
             </p>
            </div>
           </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-4">
           <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
            4
           </div>
           <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3">
             Load unpacked extension
            </h3>{" "}
            <p className="text-muted-foreground mb-4">
             Nhấn nút &quot;Load unpacked&quot; và chọn thư mục đã giải nén
             extension
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
             <p className="text-green-800 text-sm">
              ✅ Extension sẽ xuất hiện trong danh sách với tên &quot;aigiare.vn
              Extension&quot;
             </p>
            </div>
           </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start space-x-4">
           <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
            5
           </div>
           <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3">Cài đặt và sử dụng</h3>
            <p className="text-muted-foreground mb-4">
             Nhấn vào icon extension trên thanh công cụ Chrome để mở popup và
             đăng nhập với tài khoản aigiare.vn của bạn
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
             <p className="text-purple-800 text-sm">
              🎉 Bây giờ bạn có thể tự động đăng nhập vào các nền tảng AI một
              cách dễ dàng!
             </p>
            </div>
           </div>
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
        { name: "ChatGPT", icon: "🤖", description: "OpenAI ChatGPT" },
        { name: "Google Gemini", icon: "💎", description: "Google Gemini AI" },
        { name: "Leonardo AI", icon: "🎨", description: "Leonardo AI Art" },
        { name: "HailuoAI", icon: "🌊", description: "Hailuo AI Video" },
       ].map((platform) => (
        <Card
         key={platform.name}
         className="text-center hover:shadow-lg transition-shadow"
        >
         <CardContent className="p-6">
          <div className="text-4xl mb-3">{platform.icon}</div>
          <h3 className="font-semibold text-lg mb-2">{platform.name}</h3>
          <p className="text-sm text-muted-foreground">
           {platform.description}
          </p>
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
          "Có, extension được thiết kế với bảo mật cao. Tất cả dữ liệu được mã hóa và lưu trữ cục bộ trên thiết bị của bạn, không gửi về server.",
        },
        {
         question:
          "Tại sao phải cài đặt thủ công thay vì tải từ Chrome Web Store?",
         answer:
          "Extension đang trong quá trình được xem xét để đưa lên Chrome Web Store. Hiện tại bạn có thể cài đặt thủ công để sử dụng ngay.",
        },
        {
         question: "Extension có tương thích với các trình duyệt khác không?",
         answer:
          "Hiện tại extension chỉ hỗ trợ Chrome và các trình duyệt dựa trên Chromium như Edge, Brave.",
        },
        {
         question: "Làm thế nào để cập nhật extension?",
         answer:
          "Khi có phiên bản mới, bạn cần tải file zip mới, giải nén và cập nhật thư mục extension, sau đó reload extension trong Chrome.",
        },
       ].map((faq, index) => (
        <Card key={index}>
         <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
          <p className="text-muted-foreground">{faq.answer}</p>
         </CardContent>
        </Card>
       ))}
      </div>
     </div>

     {/* Support */}
     <div className="text-center">
      <Card className="bg-gradient-to-r from-primary/10 to-blue-50 max-w-2xl mx-auto">
       <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-4">🆘 Cần hỗ trợ?</h2>
        <p className="text-muted-foreground mb-6">
         Nếu bạn gặp khó khăn trong quá trình cài đặt hoặc sử dụng extension,
         đừng ngần ngại liên hệ với chúng tôi
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
         <Button
          variant="outline"
          onClick={() => window.open("https://zalo.me/0943487968", "_blank")}
         >
          📞 Chat Zalo
         </Button>
         <Button
          variant="outline"
          onClick={() =>
           window.open("https://www.facebook.com/1001thuocphimhay/", "_blank")
          }
         >
          💬 Facebook
         </Button>
        </div>
       </CardContent>
      </Card>
     </div>
    </div>
   </div>
  </div>
 );
}
