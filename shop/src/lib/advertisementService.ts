import { Advertisement } from "@/types/advertisement";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const getActiveAdvertisements = async (): Promise<Advertisement[]> => {
 try {
  const q = query(
   collection(db, "advertisements"),
   where("isActive", "==", true),
   orderBy("priority", "desc"),
   orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    name: data.name,
    imageUrl: data.imageUrl,
    isActive: data.isActive,
    priority: data.priority || 0,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
   };
  });
 } catch (error) {
  console.error("Error getting active advertisements:", error);
  throw error;
 }
};
