import { deletePage, getPageById, updatePage } from "@/lib/pageService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

  return NextResponse.json({ success: true, page });
 } catch (error) {
  console.error("Error fetching page:", error);
  return NextResponse.json(
   { success: false, error: "Failed to fetch page" },
   { status: 500 }
  );
 }
}

export async function PUT(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 const id = params.id;
 const body = await request.json();
 const { title, slug, content, isPublished } = body;

 try {
  const existingPage = await getPageById(id);

  if (!existingPage) {
   return NextResponse.json(
    { success: false, error: "Page not found" },
    { status: 404 }
   );
  }

  await updatePage(id, {
   title,
   slug,
   content,
   isPublished,
  });

  return NextResponse.json({
   success: true,
   message: "Page updated successfully",
  });
 } catch (error) {
  console.error("Error updating page:", error);
  return NextResponse.json(
   { success: false, error: "Failed to update page" },
   { status: 500 }
  );
 }
}

export async function DELETE(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 const id = params.id;

 try {
  const existingPage = await getPageById(id);

  if (!existingPage) {
   return NextResponse.json(
    { success: false, error: "Page not found" },
    { status: 404 }
   );
  }

  await deletePage(id);
  return NextResponse.json({
   success: true,
   message: "Page deleted successfully",
  });
 } catch (error) {
  console.error("Error deleting page:", error);
  return NextResponse.json(
   { success: false, error: "Failed to delete page" },
   { status: 500 }
  );
 }
}
