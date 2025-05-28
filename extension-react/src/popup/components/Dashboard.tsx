import React, { useState } from "react";
import { ApiService } from "../../shared/api";
import { StorageService } from "../../shared/storage";
import { ProductAccess, StoredUserData } from "../../shared/types";

interface DashboardProps {
 userData: StoredUserData;
 onLogout: () => void;
 onUserDataUpdate?: (userData: StoredUserData) => void; // Callback để cập nhật userData ở parent
}

const Dashboard: React.FC<DashboardProps> = ({
 userData,
 onLogout,
 onUserDataUpdate,
}) => {
 const [isRefreshing, setIsRefreshing] = useState(false);

 const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
   year: "numeric",
   month: "2-digit",
   day: "2-digit",
  });
 };

 const isProductExpired = (product: ProductAccess) => {
  return new Date(product.endDate) < new Date();
 };

 const getProductStatusClass = (product: ProductAccess) => {
  return isProductExpired(product)
   ? "bg-red-100 text-red-800 border-red-200"
   : "bg-green-100 text-green-800 border-green-200";
 };
 const getProductStatusText = (product: ProductAccess) => {
  return isProductExpired(product) ? "Hết hạn" : "Còn hạn";
 };

 // Hàm tải lại danh sách sản phẩm
 const refreshProductList = async () => {
  setIsRefreshing(true);
  try {
   console.log("Refreshing product list...");

   // Gọi API để lấy danh sách sản phẩm mới nhất
   const productAccessResponse = await ApiService.getProductAccess(
    userData.user.id
   );

   if (productAccessResponse.success && productAccessResponse.data) {
    // Cập nhật userData với danh sách sản phẩm mới
    const updatedUserData: StoredUserData = {
     ...userData,
     productAccess: productAccessResponse.data,
    };

    // Lưu vào storage
    await StorageService.setUserData(updatedUserData);

    // Gọi callback để cập nhật parent component
    if (onUserDataUpdate) {
     onUserDataUpdate(updatedUserData);
    }

    console.log("Product list refreshed successfully");
   } else {
    console.error(
     "Failed to refresh product list:",
     productAccessResponse.message
    );
   }
  } catch (error) {
   console.error("Error refreshing product list:", error);
  } finally {
   setIsRefreshing(false);
  }
 };

 // Hàm mở website
 const openWebsite = (websiteUrl: string) => {
  try {
   // Đảm bảo URL có protocol
   let url = websiteUrl;
   if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
   }

   // Mở tab mới với website
   chrome.tabs.create({ url: url });
  } catch (error) {
   console.error("Error opening website:", error);
  }
 };

 return (
  <div className="p-4 h-full flex flex-col">
   {/* Header */}
   <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold text-primary-600">Dashboard</h2>
    <button
     className="px-3 py-1 text-sm border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
     onClick={onLogout}
    >
     <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
     >
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       strokeWidth={2}
       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
     </svg>
     Đăng xuất
    </button>
   </div>
   {/* User Info */}
   <div className="card mb-4">
    <div className="flex items-center mb-2">
     <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white mr-3">
      <svg
       className="w-6 h-6"
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
       />
      </svg>
     </div>
     <div>
      <h3 className="font-semibold text-gray-900">{userData.user.fullName}</h3>
      <p className="text-sm text-gray-600">{userData.user.phoneNumber}</p>
     </div>
    </div>
    <p className="text-xs text-gray-500">
     Đăng nhập: {new Date(userData.loginTime).toLocaleString("vi-VN")}
    </p>
   </div>{" "}
   {/* Products */}
   <div className="card flex-1 flex flex-col">
    <div className="border-b border-gray-200 pb-3 mb-3">
     <div className="flex items-center justify-between">
      <h3 className="font-semibold text-gray-900">
       Sản phẩm của bạn ({userData.productAccess.length})
      </h3>
      <button
       onClick={refreshProductList}
       disabled={isRefreshing}
       className="px-3 py-1 text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400 rounded-lg transition-colors duration-200 flex items-center gap-1"
      >
       <svg
        className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
       >
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={2}
         d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
       </svg>
       {isRefreshing ? "Đang tải..." : "Tải lại"}
      </button>
     </div>
    </div>

    <div className="flex-1 overflow-auto">
     {userData.productAccess.length === 0 ? (
      <div className="text-center py-8">
       <p className="text-gray-500 text-sm">Bạn chưa có sản phẩm nào</p>
      </div>
     ) : (
      <div className="space-y-3">
       {userData.productAccess.map((product, index) => (
        <div
         key={product.id}
         className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200"
        >
         <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <svg
             className="w-4 h-4 text-primary-600"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
            >
             <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
             />
            </svg>
           </div>
           <h4 className="font-medium text-gray-900">{product.productName}</h4>
          </div>
          <span
           className={`px-2 py-1 text-xs font-medium rounded-full border ${getProductStatusClass(
            product
           )}`}
          >
           {getProductStatusText(product)}
          </span>
         </div>

         <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-1">
           {" "}
           <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
           >
            <path
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth={2}
             d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
            />
           </svg>
           <button
            onClick={() => openWebsite(product.website)}
            className="text-primary-600 hover:text-primary-800 hover:underline transition-colors duration-200 break-all text-left"
            title="Click để mở website"
           >
            {product.website}
           </button>
          </div>
          <div className="flex items-center gap-1">
           <svg
            className="w-4 h-4"
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
           <span>Hết hạn: {formatDate(product.endDate)}</span>
          </div>
         </div>
        </div>
       ))}
      </div>
     )}
    </div>
   </div>
  </div>
 );
};

export default Dashboard;
