"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

interface HeroAnimationsProps {
 children: React.ReactNode;
}

export const HeroAnimations = ({ children }: HeroAnimationsProps) => {
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  if (!containerRef.current) return;

  const ctx = gsap.context(() => {
   // Set initial states
   gsap.set(".hero-title", { opacity: 0, y: 50 });
   gsap.set(".hero-subtitle", { opacity: 0, y: 30 });
   gsap.set(".hero-description", { opacity: 0, y: 20 });
   gsap.set(".hero-buttons", { opacity: 0, y: 20 });

   // Create timeline
   const tl = gsap.timeline({ delay: 0.5 });

   // Animate title
   tl
    .to(".hero-title", {
     opacity: 1,
     y: 0,
     duration: 1,
     ease: "power3.out",
    })
    // Animate subtitle with typing effect
    .to(
     ".hero-subtitle",
     {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
     },
     "-=0.3"
    )
    // Add glowing effect to AI text
    .to(
     ".ai-text",
     {
      textShadow:
       "0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
     },
     "-=0.5"
    )
    // Animate description
    .to(
     ".hero-description",
     {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
     },
     "-=0.5"
    )
    // Animate buttons
    .to(
     ".hero-buttons",
     {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
     },
     "-=0.3"
    );

   // Floating animation for buttons
   gsap.to(".hero-button", {
    y: -5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    stagger: 0.3,
   });
  }, containerRef);

  return () => ctx.revert();
 }, []);

 return <div ref={containerRef}>{children}</div>;
};
