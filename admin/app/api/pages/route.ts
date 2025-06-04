import { createNewPage, getAllPages } from "@/lib/pageService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
 try {
  const pages = await getAllPages();
  return NextResponse.json({ success: true, pages });
 } catch (error) {
  console.error("Error fetching pages:", error);
  return NextResponse.json(
   { success: false, error: "Failed to fetch pages" },
   { status: 500 }
  );
 }
}

export async function POST(request: NextRequest) {
 try {
  const body = await request.json();
  const { title, slug, content, isPublished } = body;

  if (!title || !slug || !content) {
   return NextResponse.json(
    { success: false, error: "Missing required fields" },
    { status: 400 }
   );
  }

  const pageId = await createNewPage({
   title,
   slug,
   content,
   isPublished: isPublished || false,
  });

  return NextResponse.json({
   success: true,
   message: "Page created successfully",
   pageId,
  });
 } catch (error) {
  console.error("Error creating page:", error);
  return NextResponse.json(
   { success: false, error: "Failed to create page" },
   { status: 500 }
  );
 }
}
