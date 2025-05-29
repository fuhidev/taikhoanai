import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET: Lấy version hiện tại (cho extension check)
export async function GET() {
 try {
  const versionsRef = collection(db, "extensionVersions");
  const q = query(versionsRef, where("isCurrent", "==", true));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
   return NextResponse.json(
    {
     error: "No current version found",
    },
    { status: 404 }
   );
  }

  const currentVersion = snapshot.docs[0].data();

  return NextResponse.json({
   version: currentVersion.version,
   downloadUrl: currentVersion.downloadUrl,
   releaseNotes: currentVersion.releaseNotes,
   required: currentVersion.forceUpdate,
   publishedAt: currentVersion.publishedAt,
  });
 } catch (error) {
  console.error("Error getting current version:", error);
  return NextResponse.json(
   {
    error: "Failed to fetch current version",
   },
   { status: 500 }
  );
 }
}
