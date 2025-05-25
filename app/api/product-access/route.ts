import { getUserProductAccess } from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
 try {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
   return NextResponse.json(
    { success: false, message: "Thiếu userId" },
    { status: 400 }
   );
  }

  const productAccess = await getUserProductAccess(userId);

  return NextResponse.json({
   success: true,
   data: productAccess,
  });
 } catch (error) {
  console.error("Get product access error:", error);
  return NextResponse.json(
   { success: false, message: "Có lỗi xảy ra" },
   { status: 500 }
  );
 }
}
