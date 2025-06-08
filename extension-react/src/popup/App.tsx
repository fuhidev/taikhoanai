import React, { useEffect, useState } from "react";
import { ApiService } from "../shared/api";
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
  try {
   // Gọi API logout nếu có sessionId
   if (userData?.sessionId) {
    await ApiService.logout(userData.sessionId);
   }
  } catch (error) {
   console.error("Logout API error:", error);
   // Vẫn tiếp tục clear local data dù API lỗi
  }

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
