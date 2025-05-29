import { getAllUsers } from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
 try {
  const users = await getAllUsers();
  return NextResponse.json(users);
 } catch (error) {
  console.error("Error fetching users:", error);
  return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
 }
}
