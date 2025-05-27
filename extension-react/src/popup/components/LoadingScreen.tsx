import React from "react";

const LoadingScreen: React.FC = () => {
 return (
  <div className="h-full flex flex-col items-center justify-center p-6">
   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
   <p className="text-gray-600 text-sm">Đang tải...</p>
  </div>
 );
};

export default LoadingScreen;
