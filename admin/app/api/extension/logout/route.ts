import { revokeSession } from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
  const { sessionId } = await request.json();

  if (!sessionId) {
   return NextResponse.json(
    { success: false, error: "Session ID is required" },
    { status: 400 }
   );
  }

  await revokeSession(sessionId, "user");

  return NextResponse.json({ success: true });
 } catch (error) {
  console.error("Error logging out:", error);
  return NextResponse.json(
   { success: false, error: "Failed to logout" },
   { status: 500 }
  );
 }
}
