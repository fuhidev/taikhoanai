import { db } from "@/lib/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// PUT: Cập nhật version
export async function PUT(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
  const { id } = params;
  const body = await request.json();
  const { releaseNotes, forceUpdate, downloadUrl } = body;

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

  await updateDoc(versionRef, {
   releaseNotes: releaseNotes || "",
   forceUpdate: forceUpdate || false,
   downloadUrl: downloadUrl || "",
   updatedAt: new Date(),
  });

  return NextResponse.json({
   success: true,
   message: "Version updated successfully",
  });
 } catch (error) {
  console.error("Error updating version:", error);
  return NextResponse.json(
   {
    success: false,
    error: "Failed to update version",
   },
   { status: 500 }
  );
 }
}

// DELETE: Xóa version
export async function DELETE(
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

  const versionData = versionDoc.data();
  if (versionData.isCurrent) {
   return NextResponse.json(
    {
     success: false,
     error: "Cannot delete current version",
    },
    { status: 400 }
   );
  }

  await deleteDoc(versionRef);

  return NextResponse.json({
   success: true,
   message: "Version deleted successfully",
  });
 } catch (error) {
  console.error("Error deleting version:", error);
  return NextResponse.json(
   {
    success: false,
    error: "Failed to delete version",
   },
   { status: 500 }
  );
 }
}
