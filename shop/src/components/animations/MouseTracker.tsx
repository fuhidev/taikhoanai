"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export const MouseTracker = () => {
 const cursorRef = useRef<HTMLDivElement>(null);
 const followerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  if (!cursorRef.current || !followerRef.current) return;

  const cursor = cursorRef.current;
  const follower = followerRef.current;

  const onMouseMove = (e: MouseEvent) => {
   gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0,
   });

   gsap.to(follower, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.3,
   });
  };

  const onMouseEnterLink = () => {
   gsap.to(cursor, {
    scale: 0.8,
    opacity: 0.8,
    duration: 0.2,
   });
   gsap.to(follower, {
    scale: 3,
    opacity: 0.3,
    duration: 0.2,
   });
  };

  const onMouseLeaveLink = () => {
   gsap.to(cursor, {
    scale: 1,
    opacity: 1,
    duration: 0.2,
   });
   gsap.to(follower, {
    scale: 1,
    opacity: 0.5,
    duration: 0.2,
   });
  };

  document.addEventListener("mousemove", onMouseMove);

  // Add hover effects to interactive elements
  const interactiveElements = document.querySelectorAll(
   "a, button, .cursor-pointer"
  );
  interactiveElements.forEach((el) => {
   el.addEventListener("mouseenter", onMouseEnterLink);
   el.addEventListener("mouseleave", onMouseLeaveLink);
  });

  return () => {
   document.removeEventListener("mousemove", onMouseMove);
   interactiveElements.forEach((el) => {
    el.removeEventListener("mouseenter", onMouseEnterLink);
    el.removeEventListener("mouseleave", onMouseLeaveLink);
   });
  };
 }, []);

 return (
  <>
   <div
    ref={cursorRef}
    className="fixed w-4 h-4 bg-secondary rounded-full pointer-events-none z-[9999] mix-blend-difference"
    style={{ transform: "translate(-50%, -50%)" }}
   />
   <div
    ref={followerRef}
    className="fixed w-8 h-8 border-2 border-secondary rounded-full pointer-events-none z-[9998] opacity-50"
    style={{ transform: "translate(-50%, -50%)" }}
   />
  </>
 );
};
