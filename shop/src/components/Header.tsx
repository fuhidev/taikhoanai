"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/Button";

export const Header: React.FC = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);

 const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
 };

 const handleContactClick = () => {
  // Scroll to contact section or navigate to contact page
  const contactSection = document.getElementById("contact");
  if (contactSection) {
   contactSection.scrollIntoView({ behavior: "smooth" });
  } else {
   window.location.href = "/contact";
  }
 };

 return (
  <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
   <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
     {/* Logo */}
     <Link href="/" className="flex items-center space-x-2">
      <Image
       src="/icon.png"
       alt="taikhoanai.io.vn logo"
       width={32}
       height={32}
       className="w-8 h-8"
      />
      <span className="text-xl font-bold text-primary">taikhoanai.io.vn</span>
     </Link>{" "}
     {/* Desktop Navigation */}
     <nav className="hidden md:flex items-center space-x-6">
      <Link
       href="/"
       className="text-foreground hover:text-primary transition-colors"
      >
       Trang chủ
      </Link>
      <Link
       href="/products"
       className="text-foreground hover:text-primary transition-colors"
      >
       Sản phẩm
      </Link>
      <Link
       href="/extension"
       className="text-foreground hover:text-primary transition-colors"
      >
       Extension
      </Link>
      <Link
       href="/about"
       className="text-foreground hover:text-primary transition-colors"
      >
       Giới thiệu
      </Link>
      <Link
       href="/page/affiliate"
       className="text-foreground hover:text-primary transition-colors"
      >
       Affiliate
      </Link>
      <Link
       href="/contact"
       className="text-foreground hover:text-primary transition-colors"
      >
       Liên hệ
      </Link>
     </nav>
     {/* Desktop CTA Buttons */}
     <div className="hidden md:flex items-center space-x-4">
      <Link href="/products">
       <Button variant="outline" size="sm">
        Xem sản phẩm
       </Button>
      </Link>
      <Button onClick={handleContactClick} size="sm">
       Liên hệ ngay
      </Button>
     </div>
     {/* Mobile menu button */}
     <button
      className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
      onClick={toggleMenu}
      aria-label="Toggle menu"
     >
      {isMenuOpen ? (
       <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
       >
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={2}
         d="M6 18L18 6M6 6l12 12"
        />
       </svg>
      ) : (
       <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
       >
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={2}
         d="M4 6h16M4 12h16M4 18h16"
        />
       </svg>
      )}
     </button>
    </div>{" "}
    {/* Mobile Navigation */}
    {isMenuOpen && (
     <div className="md:hidden border-t border-border bg-background">
      <nav className="py-4 space-y-2">
       <Link
        href="/"
        className="block px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
        onClick={() => setIsMenuOpen(false)}
       >
        Trang chủ
       </Link>{" "}
       <Link
        href="/products"
        className="block px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
        onClick={() => setIsMenuOpen(false)}
       >
        Sản phẩm
       </Link>
       <Link
        href="/extension"
        className="block px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
        onClick={() => setIsMenuOpen(false)}
       >
        Extension
       </Link>
       <Link
        href="/about"
        className="block px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
        onClick={() => setIsMenuOpen(false)}
       >
        Giới thiệu
       </Link>
       <Link
        href="/contact"
        className="block px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
        onClick={() => setIsMenuOpen(false)}
       >
        Liên hệ
       </Link>
       {/* Mobile CTA Buttons */}
       <div className="px-4 pt-4 space-y-2">
        <Link
         href="/products"
         className="block"
         onClick={() => setIsMenuOpen(false)}
        >
         <Button variant="outline" size="sm" className="w-full">
          Xem sản phẩm
         </Button>
        </Link>
        <Button
         onClick={() => {
          handleContactClick();
          setIsMenuOpen(false);
         }}
         size="sm"
         className="w-full"
        >
         Liên hệ ngay
        </Button>
       </div>
      </nav>
     </div>
    )}
   </div>
  </header>
 );
};
