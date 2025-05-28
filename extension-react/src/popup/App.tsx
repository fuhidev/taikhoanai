import React, { useEffect, useState } from "react";
import { StorageService } from "../shared/storage";
import { StoredUserData } from "../shared/types";
import Dashboard from "./components/Dashboard";
import LoadingScreen from "./components/LoadingScreen";
import LoginForm from "./components/LoginForm";

const App: React.FC = () => {
 const [isLoading, setIsLoading] = useState(true);
 const [userData, setUserData] = useState<StoredUserData | null>(null);
 const [updateStatus, setUpdateStatus] = useState<{
  required: boolean;
  timeLeft?: number;
 }>({ required: false });

 useEffect(() => {
  checkLoginStatus();
  checkUpdateStatus();

  // Kiểm tra update status mỗi phút
  const updateInterval = setInterval(checkUpdateStatus, 60000);

  return () => clearInterval(updateInterval);
 }, []);

 const checkLoginStatus = async () => {
  try {
   const storedData = await StorageService.getUserData();

   if (storedData && (await StorageService.isLoginValid(storedData))) {
    setUserData(storedData);
   } else {
    await StorageService.clearUserData();
    setUserData(null);
   }
  } catch (error) {
   console.error("Check login status error:", error);
   setUserData(null);
  } finally {
   setIsLoading(false);
  }
 };

 const checkUpdateStatus = async () => {
  try {
   const stored = await chrome.storage.local.get([
    "updateNotified",
    "updateDeadline",
   ]);

   if (stored.updateNotified && stored.updateDeadline) {
    const timeLeft = stored.updateDeadline - Date.now();

    setUpdateStatus({
     required: true,
     timeLeft: Math.max(0, timeLeft),
    });

    // Nếu hết hạn, clear data
    if (timeLeft <= 0) {
     setUserData(null);
     await StorageService.clearUserData();
    }
   }
  } catch (error) {
   console.error("Check update status error:", error);
  }
 };

 const handleLoginSuccess = (data: StoredUserData) => {
  setUserData(data);
 };
 const handleLogout = async () => {
  await StorageService.clearUserData();
  setUserData(null);
 };

 // Callback để cập nhật userData khi refresh product list
 const handleUserDataUpdate = (newUserData: StoredUserData) => {
  setUserData(newUserData);
 };

 if (isLoading) {
  return <LoadingScreen />;
 }

 // Hiển thị thông báo cập nhật nếu cần
 if (updateStatus.required && updateStatus.timeLeft !== undefined) {
  const minutesLeft = Math.ceil(updateStatus.timeLeft / 60000);

  return (
   <div className="p-6 h-full flex flex-col items-center justify-center">
    <div className="text-center">
     <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
       className="w-8 h-8 text-yellow-600"
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
     </div>
     <h2 className="text-lg font-bold text-gray-900 mb-2">
      Cập nhật Extension
     </h2>
     <p className="text-gray-600 mb-4">
      Extension cần được cập nhật để tiếp tục hoạt động.
     </p>
     {minutesLeft > 0 ? (
      <p className="text-yellow-600 font-medium mb-4">
       Thời gian còn lại: {minutesLeft} phút
      </p>
     ) : (
      <p className="text-red-600 font-medium mb-4">
       Đã hết hạn! Dữ liệu đã bị xóa.
      </p>
     )}
     <button
      onClick={() =>
       chrome.tabs.create({ url: "https://aigiaren.vn/downloads" })
      }
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
     >
      Tải xuống bản cập nhật
     </button>
    </div>
   </div>
  );
 }
 return (
  <div className="w-full h-full bg-gray-50">
   {userData ? (
    <Dashboard
     userData={userData}
     onLogout={handleLogout}
     onUserDataUpdate={handleUserDataUpdate}
    />
   ) : (
    <LoginForm onLoginSuccess={handleLoginSuccess} />
   )}
  </div>
 );
};

export default App;
