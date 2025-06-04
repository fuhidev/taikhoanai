import { getActiveAdvertisements } from "@/lib/advertisementService";
import { Advertisement } from "@/types/advertisement";
import { useEffect, useState } from "react";

interface DismissedAds {
 [adId: string]: number; // timestamp
}

const DISMISSED_ADS_KEY = "dismissedAds";
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 giờ

export const useAdvertisements = () => {
 const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [currentAdIndex, setCurrentAdIndex] = useState(0);
 const [showPopup, setShowPopup] = useState(false);

 // Lấy danh sách ads đã bị dismiss
 const getDismissedAds = (): DismissedAds => {
  if (typeof window === "undefined") return {};
  try {
   const dismissed = localStorage.getItem(DISMISSED_ADS_KEY);
   return dismissed ? JSON.parse(dismissed) : {};
  } catch {
   return {};
  }
 };

 // Lưu ad đã bị dismiss
 const dismissAd = (adId: string) => {
  if (typeof window === "undefined") return;

  const dismissedAds = getDismissedAds();
  dismissedAds[adId] = Date.now();

  try {
   localStorage.setItem(DISMISSED_ADS_KEY, JSON.stringify(dismissedAds));
  } catch (error) {
   console.error("Error saving dismissed ad:", error);
  }

  setShowPopup(false);
  findNextAvailableAd();
 };

 // Kiểm tra ad có bị dismiss trong 24h không
 const isAdDismissed = (adId: string): boolean => {
  const dismissedAds = getDismissedAds();
  const dismissTime = dismissedAds[adId];

  if (!dismissTime) return false;

  const now = Date.now();
  const timeDiff = now - dismissTime;

  // Nếu đã quá 24h, xóa khỏi localStorage
  if (timeDiff > DISMISS_DURATION) {
   const updatedDismissed = { ...dismissedAds };
   delete updatedDismissed[adId];
   try {
    localStorage.setItem(DISMISSED_ADS_KEY, JSON.stringify(updatedDismissed));
   } catch (error) {
    console.error("Error updating dismissed ads:", error);
   }
   return false;
  }

  return true;
 };

 // Tìm ad tiếp theo có thể hiển thị
 const findNextAvailableAd = () => {
  let nextIndex = currentAdIndex;
  let foundAvailable = false;

  // Tìm ad tiếp theo chưa bị dismiss
  for (let i = 0; i < advertisements.length; i++) {
   nextIndex = (currentAdIndex + i + 1) % advertisements.length;
   const ad = advertisements[nextIndex];

   if (ad && !isAdDismissed(ad.id)) {
    foundAvailable = true;
    break;
   }
  }

  if (foundAvailable) {
   setCurrentAdIndex(nextIndex);
   // Delay 5s trước khi hiển thị ad tiếp theo
   setTimeout(() => {
    setShowPopup(true);
   }, 5000);
  }
 };

 // Load advertisements từ Firebase
 const loadAdvertisements = async () => {
  try {
   setLoading(true);
   const ads = await getActiveAdvertisements();

   // Filter ra những ads chưa bị dismiss
   const availableAds = ads.filter((ad) => !isAdDismissed(ad.id));

   setAdvertisements(ads);

   if (availableAds.length > 0) {
    // Tìm index của ad đầu tiên chưa bị dismiss
    const firstAvailableIndex = ads.findIndex((ad) => !isAdDismissed(ad.id));
    if (firstAvailableIndex !== -1) {
     setCurrentAdIndex(firstAvailableIndex);
     // Delay 5s trước khi hiển thị popup đầu tiên
     setTimeout(() => {
      setShowPopup(true);
     }, 5000);
    }
   }
  } catch (err) {
   setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadAdvertisements();
 }, []);

 const currentAd = advertisements[currentAdIndex] || null;

 return {
  advertisements,
  currentAd,
  loading,
  error,
  showPopup,
  dismissAd,
  setShowPopup,
 };
};
