"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
 const router = useRouter();

 useEffect(() => {
  // Chuyển hướng tự động sang trang orders
  router.replace("/orders");
 }, [router]);

 // Hiển thị loading trong lúc chuyển hướng
 return (
  <div
   style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh",
   }}
  >
   <p>Đang chuyển hướng...</p>
  </div>
 );
}
