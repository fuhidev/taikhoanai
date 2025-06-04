import { getPageById, updatePage } from "@/lib/pageService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 const id = params.id;

 try {
  const page = await getPageById(id);

  if (!page) {
   return NextResponse.json(
    { success: false, error: "Page not found" },
    { status: 404 }
   );
  }

  await updatePage(id, {
   isPublished: !page.isPublished,
  });

  return NextResponse.json({
   success: true,
   message: page.isPublished
    ? "Page unpublished successfully"
    : "Page published successfully",
  });
 } catch (error) {
  console.error("Error toggling page publish status:", error);
  return NextResponse.json(
   { success: false, error: "Failed to update page status" },
   { status: 500 }
  );
 }
}
