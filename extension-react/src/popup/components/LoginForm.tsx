import React, { useState } from "react";
import { ApiService } from "../../shared/api";
import { DeviceUtils } from "../../shared/device-utils";
import { StorageService } from "../../shared/storage";
import { StoredUserData } from "../../shared/types";

interface LoginFormProps {
 onLoginSuccess: (userData: StoredUserData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
 const [phoneNumber, setPhoneNumber] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [deviceConflictError, setDeviceConflictError] = useState<{
  show: boolean;
  message: string;
  activeDevice?: any;
 }>({ show: false, message: "" });
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!phoneNumber.trim() || !password.trim()) {
   setError("Vui lòng nhập đầy đủ thông tin");
   return;
  }
  setIsLoading(true);
  setError(null);
  setDeviceConflictError({ show: false, message: "" });

  try {
   console.log("Attempting login...");
   const response = await ApiService.login({
    phoneNumber: phoneNumber.trim(),
    password: password.trim(),
   });
   console.log("Login response:", response);

   if (response.success && response.user && response.sessionId) {
    const deviceId = await DeviceUtils.getStoredDeviceId();

    console.log("Login successful, getting product access...");

    // Create user data object
    const userData: StoredUserData = {
     user: response.user,
     subscriptions: response.subscriptions || [],
     productAccess: [],
     loginTime: Date.now(),
     sessionId: response.sessionId,
     deviceId: deviceId,
    };

    try {
     // Get product access
     const productAccessResponse = await ApiService.getProductAccess(
      response.user.id
     );
     console.log("Product access response:", productAccessResponse);

     if (productAccessResponse.success && productAccessResponse.data) {
      userData.productAccess = productAccessResponse.data;
     }
    } catch (productError) {
     console.warn("Failed to fetch product access:", productError);
     // Continue with empty product access
    }

    // Store user data
    await StorageService.setUserData(userData);
    console.log("User data stored:", userData);

    // Notify parent component
    onLoginSuccess(userData);
   } else {
    console.log("Login failed:", response.message);

    // Kiểm tra nếu là lỗi device conflict
    if (response.deviceConflict) {
     setDeviceConflictError({
      show: true,
      message: response.message || "Tài khoản đã đăng nhập trên thiết bị khác",
      activeDevice: response.activeDevice,
     });
    } else {
     setError(response.message || "Đăng nhập thất bại");
    }
   }
  } catch (error) {
   console.error("Login error:", error);
   setError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
  } finally {
   setIsLoading(false);
  }
 };

 const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !isLoading) {
   handleSubmit(e as any);
  }
 };

 return (
  <div className="p-6 h-full flex flex-col">
   {/* Header */}
   <div className="text-center mb-6">
    <h1 className="text-2xl font-bold text-primary-600 mb-2">aigiare.vn</h1>
    <p className="text-gray-600 text-sm">Đăng nhập để quản lý tài khoản AI</p>
   </div>{" "}
   {/* Login Form */}
   <div className="card flex-1">
    <form onSubmit={handleSubmit} className="space-y-4">
     {" "}
     {/* Device Conflict Error */}
     {deviceConflictError.show && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
       <div className="flex items-start">
        <svg
         className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0"
         fill="none"
         stroke="currentColor"
         viewBox="0 0 24 24"
        >
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
         />
        </svg>
        <div className="flex-1">
         <p className="text-sm font-medium text-red-800 mb-1">
          Không thể đăng nhập
         </p>
         <p className="text-sm text-red-700 mb-2">
          {deviceConflictError.message}
         </p>

         {deviceConflictError.activeDevice && (
          <div className="bg-red-100 p-2 rounded border text-xs text-red-700 mb-2">
           <p>
            <strong>Thiết bị đang hoạt động:</strong>{" "}
            {deviceConflictError.activeDevice.deviceName}
           </p>
           <p>
            <strong>Đăng nhập lúc:</strong>{" "}
            {new Date(
             deviceConflictError.activeDevice.loginTime
            ).toLocaleString("vi-VN")}
           </p>
           <p>
            <strong>Hoạt động cuối:</strong>{" "}
            {new Date(
             deviceConflictError.activeDevice.lastActive
            ).toLocaleString("vi-VN")}
           </p>
          </div>
         )}

         <p className="text-xs text-red-600">
          💡 <strong>Giải pháp:</strong> Đăng xuất khỏi thiết bị khác hoặc liên
          hệ admin để thu hồi phiên đăng nhập.
         </p>
        </div>
       </div>
      </div>
     )}{" "}
     {error && !deviceConflictError.show && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
       {error}
      </div>
     )}
     {/* Phone Number Input */}
     <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
       Số điện thoại
      </label>
      <div className="relative">
       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
         className="h-5 w-5 text-gray-400"
         fill="none"
         viewBox="0 0 24 24"
         stroke="currentColor"
        >
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
         />
        </svg>
       </div>
       <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        className="input-field pl-10"
        placeholder="Nhập số điện thoại"
       />
      </div>
     </div>
     {/* Password Input */}
     <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
       Mật khẩu
      </label>
      <div className="relative">
       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
         className="h-5 w-5 text-gray-400"
         fill="none"
         viewBox="0 0 24 24"
         stroke="currentColor"
        >
         <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
         />
        </svg>
       </div>
       <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        className="input-field pl-10 pr-10"
        placeholder="Nhập mật khẩu"
       />
       <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
       >
        {" "}
        <svg
         className="h-5 w-5 text-gray-400"
         fill="none"
         viewBox="0 0 24 24"
         stroke="currentColor"
        >
         {showPassword ? (
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415"
          />
         ) : (
          <>
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
           />
           <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
           />
          </>
         )}
        </svg>
       </button>
      </div>
     </div>{" "}
     {/* Submit Button */}
     <button type="submit" disabled={isLoading} className="btn-primary w-full">
      {isLoading ? (
       <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Đang đăng nhập...
       </div>
      ) : (
       "Đăng nhập"
      )}
     </button>
     {/* Support Section */}
     <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="text-center">
       <p className="text-sm text-gray-600 mb-3">Cần hỗ trợ?</p>

       {/* Hotline Zalo */}
       <div className="flex items-center justify-center mb-3">
        <div className="flex items-center bg-blue-50 rounded-lg px-3 py-2">
         <svg
          className="w-5 h-5 text-blue-600 mr-2"
          fill="currentColor"
          viewBox="0 0 24 24"
         >
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
         </svg>
         <span className="text-sm font-medium text-blue-600">
          Zalo: 094 348 79 68
         </span>
        </div>
       </div>

       {/* Facebook Link */}
       <div className="flex items-center justify-center">
        <button
         onClick={() =>
          chrome.tabs.create({
           url: "https://www.facebook.com/1001thuocphimhay/",
          })
         }
         className="flex items-center bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition-colors"
        >
         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
         </svg>
         <span className="text-sm font-medium">Facebook Support</span>
        </button>
       </div>
      </div>
     </div>
    </form>
   </div>
  </div>
 );
};

export default LoginForm;
