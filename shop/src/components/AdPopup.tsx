"use client";

import { Advertisement } from "@/types/advertisement";
import Image from "next/image";
import React from "react";

interface AdPopupProps {
 advertisement: Advertisement;
 isVisible: boolean;
 onClose: () => void;
}

const AdPopup: React.FC<AdPopupProps> = ({
 advertisement,
 isVisible,
 onClose,
}) => {
 if (!isVisible || !advertisement) return null;

 const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
   onClose();
  }
 };

 return (
  <div
   className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm"
   onClick={handleBackdropClick}
  >
   <div className="relative max-w-2xl max-h-[80vh] p-4">
    {/* Close button */}
    <button
     onClick={onClose}
     className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
     aria-label="Đóng quảng cáo"
    >
     <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
     >
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       strokeWidth={2}
       d="M6 18L18 6M6 6l12 12"
      />
     </svg>
    </button>

    {/* Advertisement image */}
    <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
     <Image
      src={advertisement.imageUrl}
      alt={advertisement.name}
      width={800}
      height={600}
      className="w-full h-auto object-contain"
      priority
      onError={(e) => {
       console.error("Error loading advertisement image:", e);
      }}
     />
    </div>
   </div>
  </div>
 );
};

export default AdPopup;
