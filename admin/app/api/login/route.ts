import { authenticateUser } from "@/lib/firebaseService";
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

  const result = await authenticateUser({ phoneNumber, password });

  return NextResponse.json(result);
 } catch (error) {
  console.error("Login error:", error);
  return NextResponse.json(
   { success: false, message: "Có lỗi xảy ra" },
   { status: 500 }
  );
 }
}
