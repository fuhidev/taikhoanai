"use client";
import { Button } from "./ui/Button";
export const ContactInfo = () => {
 const zaloPhone = "094 348 79 68";
 const fanpageUrl = "https://www.facebook.com/1001thuocphimhay/";
 const handleZaloContact = () => {
  window.open(`https://zalo.me/${zaloPhone}`, "_blank");
 };
 const handleFanpageContact = () => {
  window.open(fanpageUrl, "_blank");
 };
 return (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
   {" "}
   <div className="text-center mb-12">
    {" "}
    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
     {" "}
     Liên hệ với chúng tôi{" "}
    </h2>{" "}
    <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>{" "}
    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
     {" "}
     Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn. Hãy liên hệ qua các kênh
     dưới đây để được phục vụ tốt nhất.{" "}
    </p>{" "}
   </div>{" "}
   <div className="max-w-4xl mx-auto">
    {" "}
    <div className="grid md:grid-cols-2 gap-8">
     {" "}
     {/* Zalo Contact */}{" "}
     <div className="bg-card rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
      {" "}
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
       {" "}
       <svg
        className="w-10 h-10 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
       >
        {" "}
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.188c-1.747 1.745-4.067 2.706-6.538 2.706-1.286 0-2.522-.258-3.673-.767l-4.244.943.943-4.244c-.509-1.151-.767-2.387-.767-3.673 0-2.471.961-4.791 2.706-6.538C7.066 2.87 9.471 1.875 12 1.875s4.934.995 6.681 2.74c1.745 1.747 2.706 4.067 2.706 6.538 0 2.471-.961 4.791-2.706 6.538l-.787-.503z" />{" "}
       </svg>{" "}
      </div>{" "}
      <h3 className="text-2xl font-bold text-foreground mb-4">Zalo</h3>{" "}
      <p className="text-muted-foreground mb-6">
       {" "}
       Liên hệ trực tiếp qua Zalo để được tư vấn nhanh chóng và tiện lợi{" "}
      </p>{" "}
      <div className="space-y-3 mb-6">
       {" "}
       <p className="text-lg font-semibold text-primary">{zaloPhone}</p>{" "}
       <p className="text-sm text-muted-foreground">
        {" "}
        Thời gian hỗ trợ: 8:00 - 22:00 hàng ngày{" "}
       </p>{" "}
      </div>{" "}
      <Button
       onClick={handleZaloContact}
       variant="primary"
       size="lg"
       className="w-full"
      >
       {" "}
       <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        {" "}
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.188c-1.747 1.745-4.067 2.706-6.538 2.706-1.286 0-2.522-.258-3.673-.767l-4.244.943.943-4.244c-.509-1.151-.767-2.387-.767-3.673 0-2.471.961-4.791 2.706-6.538C7.066 2.87 9.471 1.875 12 1.875s4.934.995 6.681 2.74c1.745 1.747 2.706 4.067 2.706 6.538 0 2.471-.961 4.791-2.706 6.538l-.787-.503z" />{" "}
       </svg>{" "}
       Chat Zalo{" "}
      </Button>{" "}
     </div>{" "}
     {/* Facebook Fanpage */}{" "}
     <div className="bg-card rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
      {" "}
      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
       {" "}
       <svg
        className="w-10 h-10 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
       >
        {" "}
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />{" "}
       </svg>{" "}
      </div>{" "}
      <h3 className="text-2xl font-bold text-foreground mb-4">
       Facebook Fanpage
      </h3>{" "}
      <p className="text-muted-foreground mb-6">
       {" "}
       Theo dõi fanpage để cập nhật tin tức mới nhất và nhận nhiều ưu đãi hấp
       dẫn{" "}
      </p>{" "}
      <div className="space-y-3 mb-6">
       {" "}
       <p className="text-sm text-muted-foreground">
        {" "}
        ✓ Tin tức và khuyến mãi mới nhất{" "}
       </p>{" "}
       <p className="text-sm text-muted-foreground">
        {" "}
        ✓ Hỗ trợ khách hàng qua Messenger{" "}
       </p>{" "}
       <p className="text-sm text-muted-foreground">
        {" "}
        ✓ Cộng đồng khách hàng thân thiết{" "}
       </p>{" "}
      </div>{" "}
      <Button
       onClick={handleFanpageContact}
       variant="outline"
       size="lg"
       className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
      >
       {" "}
       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        {" "}
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />{" "}
       </svg>
       Theo dõi Fanpage
      </Button>
     </div>
    </div>
    {/* Additional Contact Info */}{" "}
    <div className="mt-12 text-center">
     <div className="bg-card rounded-2xl p-8 shadow-lg">
      <h3 className="text-xl font-bold text-foreground mb-4">Thông tin khác</h3>
      <div className="grid sm:grid-cols-3 gap-6 text-center">
       <div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
         <svg
          className="w-6 h-6 text-primary"
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
         </svg>{" "}
        </div>
        <h4 className="font-semibold text-foreground mb-1">Giờ làm việc</h4>
        <p className="text-sm text-muted-foreground">8:00 - 22:00 hàng ngày</p>
       </div>

       <div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
         <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
         >
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />{" "}
         </svg>
        </div>
        <h4 className="font-semibold text-foreground mb-1">Hỗ trợ</h4>
        <p className="text-sm text-muted-foreground">Tư vấn miễn phí 24/7</p>
       </div>

       <div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
         <svg
          className="w-6 h-6 text-primary"
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
        <h4 className="font-semibold text-foreground mb-1">Cam kết</h4>
        <p className="text-sm text-muted-foreground">Hỗ trợ sau bán hàng</p>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};
