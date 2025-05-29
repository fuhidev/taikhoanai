import { authenticateAdmin } from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
  const body = await request.json();
  const { phoneNumber, password } = body;

  if (!phoneNumber || !password) {
   return NextResponse.json(
    { success: false, message: "Thiếu số điện thoại hoặc mật khẩu" },
    { status: 400 }
   );
  }

  const result = await authenticateAdmin({ phoneNumber, password });

  if (result.success) {
   // Set session cookie
   const response = NextResponse.json(result);
   response.cookies.set("admin-session", result.user?.id || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
   });
   return response;
  }

  return NextResponse.json(result, { status: 401 });
 } catch (error) {
  console.error("Admin login error:", error);
  return NextResponse.json(
   { success: false, message: "Có lỗi xảy ra" },
   { status: 500 }
  );
 }
}
