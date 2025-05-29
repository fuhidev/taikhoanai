import { getAllActiveSessions, getAllSessions } from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
 try {
  // TODO: Add admin authentication check

  const url = new URL(request.url);
  const showAll = url.searchParams.get("all") === "true";

  // Lấy tất cả sessions hoặc chỉ active sessions
  const sessions = showAll
   ? await getAllSessions()
   : await getAllActiveSessions();

  return NextResponse.json({
   success: true,
   sessions,
  });
 } catch (error) {
  console.error("Error fetching sessions:", error);
  return NextResponse.json({
   success: false,
   message: "Lỗi server",
  });
 }
}
