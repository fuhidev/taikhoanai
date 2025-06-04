import { Page } from "@/types";
import {
 addDoc,
 collection,
 deleteDoc,
 doc,
 getDoc,
 getDocs,
 orderBy,
 query,
 Timestamp,
 updateDoc,
 where,
} from "firebase/firestore";
import { db } from "./firebase";

export const getAllPages = async (): Promise<Page[]> => {
 try {
  const q = query(collection(db, "pages"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  const pages: Page[] = [];
  querySnapshot.forEach((doc) => {
   const data = doc.data();
   pages.push({
    id: doc.id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    isPublished: data.isPublished || false,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
   });
  });

  return pages;
 } catch (error) {
  console.error("Error getting pages:", error);
  return [];
 }
};

export const getPageById = async (id: string): Promise<Page | null> => {
 try {
  const docRef = doc(db, "pages", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
   const data = docSnap.data();
   return {
    id: docSnap.id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    isPublished: data.isPublished || false,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
   };
  } else {
   return null;
  }
 } catch (error) {
  console.error("Error getting page by id:", error);
  return null;
 }
};

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
 try {
  const q = query(collection(db, "pages"), where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
   return null;
  }

  const data = querySnapshot.docs[0].data();
  return {
   id: querySnapshot.docs[0].id,
   slug: data.slug,
   title: data.title,
   content: data.content,
   isPublished: data.isPublished || false,
   createdAt: data.createdAt.toDate(),
   updatedAt: data.updatedAt.toDate(),
  };
 } catch (error) {
  console.error("Error getting page by slug:", error);
  return null;
 }
};

export const createNewPage = async (
 page: Omit<Page, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
 try {
  const now = new Date();
  const docRef = await addDoc(collection(db, "pages"), {
   ...page,
   createdAt: Timestamp.fromDate(now),
   updatedAt: Timestamp.fromDate(now),
  });

  return docRef.id;
 } catch (error) {
  console.error("Error creating page:", error);
  throw error;
 }
};

export const updatePage = async (
 id: string,
 page: Partial<Omit<Page, "id" | "createdAt" | "updatedAt">>
): Promise<void> => {
 try {
  const docRef = doc(db, "pages", id);
  await updateDoc(docRef, {
   ...page,
   updatedAt: Timestamp.fromDate(new Date()),
  });
 } catch (error) {
  console.error("Error updating page:", error);
  throw error;
 }
};

export const deletePage = async (id: string): Promise<void> => {
 try {
  await deleteDoc(doc(db, "pages", id));
 } catch (error) {
  console.error("Error deleting page:", error);
  throw error;
 }
};
