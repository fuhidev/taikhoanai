import { db } from "@/lib/firebase";
import {
 addDoc,
 collection,
 getDocs,
 orderBy,
 query,
 Timestamp,
 updateDoc,
 where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// GET: Lấy tất cả versions (cho admin)
export async function GET() {
 try {
  const versionsRef = collection(db, "extensionVersions");
  const q = query(versionsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const versions = snapshot.docs.map((doc) => ({
   id: doc.id,
   ...doc.data(),
   createdAt: doc.data().createdAt?.toDate(),
   publishedAt: doc.data().publishedAt?.toDate(),
  }));

  return NextResponse.json({
   success: true,
   versions,
  });
 } catch (error) {
  console.error("Error fetching versions:", error);
  return NextResponse.json(
   {
    success: false,
    error: "Failed to fetch versions",
   },
   { status: 500 }
  );
 }
}

// POST: Tạo version mới
export async function POST(request: NextRequest) {
 try {
  const body = await request.json();
  const {
   version,
   downloadUrl,
   releaseNotes,
   forceUpdate = false,
   publishNow = false,
  } = body;

  // Validate version format
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
   return NextResponse.json(
    {
     success: false,
     error: "Invalid version format. Use x.y.z",
    },
    { status: 400 }
   );
  }

  // Check if version already exists
  const versionsRef = collection(db, "extensionVersions");
  const existingQuery = query(versionsRef, where("version", "==", version));
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
   return NextResponse.json(
    {
     success: false,
     error: "Version already exists",
    },
    { status: 400 }
   );
  }

  // Nếu publish ngay, set version cũ thành false
  if (publishNow) {
   const currentQuery = query(versionsRef, where("isCurrent", "==", true));
   const currentSnapshot = await getDocs(currentQuery);

   for (const doc of currentSnapshot.docs) {
    await updateDoc(doc.ref, { isCurrent: false });
   }
  }

  const newVersionData = {
   version,
   downloadUrl: downloadUrl || "",
   releaseNotes: releaseNotes || "",
   forceUpdate,
   isCurrent: publishNow,
   publishedAt: publishNow ? Timestamp.now() : null,
   createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(versionsRef, newVersionData);

  return NextResponse.json({
   success: true,
   version: { id: docRef.id, ...newVersionData },
  });
 } catch (error) {
  console.error("Error creating version:", error);
  return NextResponse.json(
   {
    success: false,
    error: "Failed to create version",
   },
   { status: 500 }
  );
 }
}
