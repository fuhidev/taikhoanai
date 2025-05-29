import { validateUserSession } from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
  const { sessionId, deviceId } = await request.json();

  if (!sessionId || !deviceId) {
   return NextResponse.json({
    success: false,
    valid: false,
    message: "Thiếu thông tin session",
   });
  }

  const validation = await validateUserSession(sessionId, deviceId);

  return NextResponse.json({
   success: true,
   valid: validation.valid,
   message: validation.message,
  });
 } catch (error) {
  console.error("Session validation error:", error);
  return NextResponse.json({
   success: false,
   valid: false,
   message: "Lỗi server",
  });
 }
}
