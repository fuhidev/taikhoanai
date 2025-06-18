import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
 // Kiểm tra nếu đang truy cập trang admin (trừ login)
 if (
  request.nextUrl.pathname.startsWith("/") &&
  request.nextUrl.pathname !== "/login" &&
  !request.nextUrl.pathname.startsWith("/api")
 ) {
  const adminSession = request.cookies.get("admin-session");

  if (!adminSession) {
   // Redirect to login page
   return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect từ trang chủ "/" sang "/orders"
  if (request.nextUrl.pathname === "/") {
   return NextResponse.redirect(new URL("/orders", request.url));
  }
 }

 return NextResponse.next();
}

export const config = {
 matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
