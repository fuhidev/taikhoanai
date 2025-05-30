"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
 gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationsProps {
 children: React.ReactNode;
 className?: string;
}

export const ScrollAnimations = ({
 children,
 className,
}: ScrollAnimationsProps) => {
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  if (!containerRef.current) return;

  const ctx = gsap.context(() => {
   // Animate sections on scroll
   gsap.utils.toArray(".animate-on-scroll").forEach((element: any) => {
    gsap.fromTo(
     element,
     {
      opacity: 0,
      y: 50,
     },
     {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
       trigger: element,
       start: "top 80%",
       end: "bottom 20%",
       toggleActions: "play none none reverse",
      },
     }
    );
   });

   // Animate cards with stagger
   gsap.utils.toArray(".stagger-cards").forEach((container: any) => {
    const cards = container.querySelectorAll(".card-item");
    gsap.fromTo(
     cards,
     {
      opacity: 0,
      y: 30,
      scale: 0.9,
     },
     {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1,
      scrollTrigger: {
       trigger: container,
       start: "top 85%",
       end: "bottom 15%",
       toggleActions: "play none none reverse",
      },
     }
    );
   });

   // Progress bar animation
   gsap.utils.toArray(".progress-bar").forEach((element: any) => {
    gsap.fromTo(
     element,
     { scaleX: 0 },
     {
      scaleX: 1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
       trigger: element,
       start: "top 90%",
       end: "bottom 10%",
       toggleActions: "play none none reverse",
      },
     }
    );
   });
  }, containerRef);

  return () => ctx.revert();
 }, []);

 return (
  <div ref={containerRef} className={className}>
   {children}
  </div>
 );
};
