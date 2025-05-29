import { db } from "@/lib/firebase";
import {
 collection,
 deleteDoc,
 doc,
 getDoc,
 getDocs,
 query,
 serverTimestamp,
 updateDoc,
 where,
 writeBatch,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
  const userId = params.id;
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
   return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
   id: userDoc.id,
   ...userDoc.data(),
  });
 } catch (error) {
  console.error("Error fetching user:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 }
}

export async function PUT(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
  const { phoneNumber, fullName, isAdmin } = await request.json();
  const userId = params.id;

  // Cập nhật thông tin user trong Firestore
  const userRef = doc(db, "users", userId);
  const updateData: any = {
   phoneNumber,
   updatedAt: serverTimestamp(),
  };

  if (fullName !== undefined) {
   updateData.fullName = fullName;
  }

  if (isAdmin !== undefined) {
   updateData.isAdmin = isAdmin;
  }

  await updateDoc(userRef, updateData);

  return NextResponse.json({ success: true });
 } catch (error) {
  console.error("Error updating user:", error);
  return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
 }
}

export async function DELETE(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
  const userId = params.id;

  // Xóa user từ Firestore
  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);

  // Xóa tất cả sessions của user
  const sessionsQuery = query(
   collection(db, "userSessions"),
   where("userId", "==", userId)
  );
  const sessionsSnapshot = await getDocs(sessionsQuery);

  const batch = writeBatch(db);
  sessionsSnapshot.docs.forEach((docSnap) => {
   batch.delete(docSnap.ref);
  });
  await batch.commit();

  return NextResponse.json({ success: true });
 } catch (error) {
  console.error("Error deleting user:", error);
  return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
 }
}
