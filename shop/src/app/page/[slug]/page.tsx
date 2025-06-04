"use client";

import { getPageBySlug } from "@/lib/firebaseService";
import { Page } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function CustomPage() {
 const { slug } = useParams<{ slug: string }>();
 const [page, setPage] = useState<Page | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchPage = async () => {
   try {
    setLoading(true);
    const pageData = await getPageBySlug(slug);
    if (pageData) {
     setPage(pageData);
    } else {
     setError("Trang không tồn tại hoặc chưa được xuất bản");
    }
   } catch (err) {
    setError("Đã xảy ra lỗi khi tải trang");
    console.error("Error fetching page:", err);
   } finally {
    setLoading(false);
   }
  };

  if (slug) {
   fetchPage();
  }
 }, [slug]);

 return (
  <div className="min-h-screen bg-background">
   {/* Hero Section */}
   {loading ? (
    <div className="py-12">
     <div className="container mx-auto px-4">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
       <div className="w-3/5 h-10 bg-gray-200 rounded-md animate-pulse"></div>
       <div className="w-full h-[300px] bg-gray-200 rounded-md animate-pulse"></div>
      </div>
     </div>
    </div>
   ) : error ? (
    <div className="py-20">
     <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 max-w-4xl mx-auto">
       <h1 className="text-red-600 text-4xl mb-4 font-bold">404</h1>
       <div className="text-xl text-gray-700">{error}</div>
      </div>
     </div>
    </div>
   ) : page ? (
    <>
     {/* Hero Section */}
     <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
       <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{page.title}</h1>
       </div>
      </div>
     </div>{" "}
     {/* Content Section */}
     <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
       <div className="max-w-4xl mx-auto bg-card rounded-2xl p-6 sm:p-8 shadow-lg">
        <div
         className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-bold prose-headings:text-foreground prose-headings:mb-4 
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-muted-foreground prose-p:leading-7 
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:font-medium prose-blockquote:bg-gray-50/50 prose-blockquote:py-2 prose-blockquote:rounded-r-sm
          prose-img:rounded-xl prose-img:shadow-md 
          prose-hr:my-8 prose-hr:border-gray-200
          prose-ul:list-disc prose-ol:list-decimal prose-li:my-1
          prose-table:border prose-table:border-collapse prose-td:p-2 prose-td:border prose-th:p-2 prose-th:border prose-th:bg-gray-50 prose-th:text-foreground
          prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm          prose-pre:bg-gray-900 prose-pre:text-gray-50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
        >
         <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
           h1: ({ ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
           ),
           h2: ({ ...props }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
           ),
           h3: ({ ...props }) => (
            <h3 className="text-xl font-bold mt-5 mb-2" {...props} />
           ),
           p: ({ ...props }) => <p className="mb-4 text-gray-700" {...props} />,
           ul: ({ ...props }) => (
            <ul className="list-disc ml-6 mb-4" {...props} />
           ),
           ol: ({ ...props }) => (
            <ol className="list-decimal ml-6 mb-4" {...props} />
           ),
           li: ({ ...props }) => <li className="my-1" {...props} />,
           blockquote: ({ ...props }) => (
            <blockquote
             className="border-l-4 border-primary pl-4 py-2 my-4 bg-gray-50 rounded-r"
             {...props}
            />
           ),
           a: ({ href, ...props }) => (
            <a
             href={href}
             className="text-primary hover:underline"
             target={href?.startsWith("http") ? "_blank" : undefined}
             rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
             {...props}
            />
           ),
           img: ({ ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img
             className="rounded-lg shadow-md my-4 max-w-full h-auto"
             {...props}
            />
           ),
           table: ({ ...props }) => (
            <table className="border-collapse w-full my-4" {...props} />
           ),
           th: ({ ...props }) => (
            <th className="border border-gray-300 bg-gray-100 p-2" {...props} />
           ),
           td: ({ ...props }) => (
            <td className="border border-gray-300 p-2" {...props} />
           ),
           hr: ({ ...props }) => (
            <hr className="my-8 border-t border-gray-200" {...props} />
           ),
           strong: ({ ...props }) => (
            <strong className="font-bold" {...props} />
           ),
          }}
         >
          {page.content}
         </ReactMarkdown>
        </div>
       </div>
      </div>
     </div>
    </>
   ) : null}
  </div>
 );
}
