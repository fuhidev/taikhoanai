import {
 deleteAdvertisement,
 updateAdvertisement,
} from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
  const body = await request.json();
  const { name, imageUrl, isActive, priority } = body;

  const updates: Record<string, string | number> = {};
  if (name !== undefined) updates.name = name;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (isActive !== undefined) updates.isActive = isActive;
  if (priority !== undefined) updates.priority = priority;

  await updateAdvertisement(params.id, updates);
  return NextResponse.json({ message: "Advertisement updated successfully" });
 } catch (error) {
  console.error("Error updating advertisement:", error);
  return NextResponse.json(
   { error: "Failed to update advertisement" },
   { status: 500 }
  );
 }
}

export async function DELETE(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
  await deleteAdvertisement(params.id);
  return NextResponse.json({ message: "Advertisement deleted successfully" });
 } catch (error) {
  console.error("Error deleting advertisement:", error);
  return NextResponse.json(
   { error: "Failed to delete advertisement" },
   { status: 500 }
  );
 }
}
