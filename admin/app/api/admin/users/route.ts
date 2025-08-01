import { getAllUsers } from "@/lib/firebaseService";
import { NextResponse } from "next/server";

export async function GET() {
 try {
  const users = await getAllUsers();
  return NextResponse.json(users);
 } catch (error) {
  console.error("Error fetching users:", error);
  return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
 }
}
