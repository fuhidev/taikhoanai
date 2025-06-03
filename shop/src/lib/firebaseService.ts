import { Product } from "@/types";
import {
 collection,
 doc,
 getDoc,
 getDocs,
 orderBy,
 query,
 where,
} from "firebase/firestore";
import { db } from "./firebase";

export const getProducts = async (): Promise<Product[]> => {
 try {
  const q = query(
   collection(db, "products"),
   orderBy("createdAt", "desc"),
   where("image", ">", "")
  );
  const querySnapshot = await getDocs(q);

  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
   const data = doc.data();
   products.push({
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
   } as Product);
  });

  return products;
 } catch (error) {
  console.error("Error fetching products:", error);
  return [];
 }
};

export const getProductById = async (id: string): Promise<Product | null> => {
 try {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
   const data = docSnap.data();
   return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
   } as Product;
  } else {
   return null;
  }
 } catch (error) {
  console.error("Error fetching product:", error);
  return null;
 }
};
