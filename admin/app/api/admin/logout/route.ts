import { NextResponse } from "next/server";

export async function POST() {
 const response = NextResponse.json({ success: true });

 // Clear admin session cookie
 response.cookies.set("admin-session", "", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 0, // Expire immediately
 });

 return response;
}
