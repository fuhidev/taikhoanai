import { db } from "@/lib/firebase";
import {
 collection,
 doc,
 getDoc,
 getDocs,
 query,
 Timestamp,
 updateDoc,
 where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// POST: Publish version (set as current)
export async function POST(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
  const { id } = params;

  const versionRef = doc(db, "extensionVersions", id);
  const versionDoc = await getDoc(versionRef);

  if (!versionDoc.exists()) {
   return NextResponse.json(
    {
     success: false,
     error: "Version not found",
    },
    { status: 404 }
   );
  }

  // Set tất cả version khác thành false
  const versionsRef = collection(db, "extensionVersions");
  const currentQuery = query(versionsRef, where("isCurrent", "==", true));
  const currentSnapshot = await getDocs(currentQuery);

  for (const doc of currentSnapshot.docs) {
   await updateDoc(doc.ref, { isCurrent: false });
  }

  // Set version này thành current
  await updateDoc(versionRef, {
   isCurrent: true,
   publishedAt: Timestamp.now(),
  });

  const versionData = versionDoc.data();

  return NextResponse.json({
   success: true,
   message: `Version ${versionData.version} is now current`,
  });
 } catch (error) {
  console.error("Error publishing version:", error);
  return NextResponse.json(
   {
    success: false,
    error: "Failed to publish version",
   },
   { status: 500 }
  );
 }
}
