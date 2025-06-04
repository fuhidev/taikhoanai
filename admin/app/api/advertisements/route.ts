import {
 createAdvertisement,
 getActiveAdvertisements,
 getAdvertisements,
} from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
 try {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";

  const advertisements = activeOnly
   ? await getActiveAdvertisements()
   : await getAdvertisements();

  return NextResponse.json(advertisements);
 } catch (error) {
  console.error("Error fetching advertisements:", error);
  return NextResponse.json(
   { error: "Failed to fetch advertisements" },
   { status: 500 }
  );
 }
}

export async function POST(request: NextRequest) {
 try {
  const body = await request.json();
  const { name, imageUrl, priority } = body;

  if (!name || !imageUrl) {
   return NextResponse.json(
    { error: "Name and imageUrl are required" },
    { status: 400 }
   );
  }

  const id = await createAdvertisement(name, imageUrl, priority || 0);
  return NextResponse.json({
   id,
   message: "Advertisement created successfully",
  });
 } catch (error) {
  console.error("Error creating advertisement:", error);
  return NextResponse.json(
   { error: "Failed to create advertisement" },
   { status: 500 }
  );
 }
}
