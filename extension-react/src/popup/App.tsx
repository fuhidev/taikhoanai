import React, { useEffect, useState } from "react";
import { StorageService } from "../shared/storage";
import { StoredUserData } from "../shared/types";
import Dashboard from "./components/Dashboard";
import LoadingScreen from "./components/LoadingScreen";
import LoginForm from "./components/LoginForm";

const App: React.FC = () => {
 const [isLoading, setIsLoading] = useState(true);
 const [userData, setUserData] = useState<StoredUserData | null>(null);

 useEffect(() => {
  checkLoginStatus();
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

 const handleLoginSuccess = (data: StoredUserData) => {
  setUserData(data);
 };

 const handleLogout = async () => {
  await StorageService.clearUserData();
  setUserData(null);
 };

 if (isLoading) {
  return <LoadingScreen />;
 }

 return (
  <div className="w-full h-full bg-gray-50">
   {userData ? (
    <Dashboard userData={userData} onLogout={handleLogout} />
   ) : (
    <LoginForm onLoginSuccess={handleLoginSuccess} />
   )}
  </div>
 );
};

export default App;
