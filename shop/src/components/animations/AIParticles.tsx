"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export const AIParticles = () => {
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  if (!containerRef.current) return;

  // Create floating particles
  const particles = Array.from({ length: 20 }, (_, i) => {
   const particle = document.createElement("div");
   particle.className =
    "absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-70";
   particle.style.left = `${Math.random() * 100}%`;
   particle.style.top = `${Math.random() * 100}%`;
   containerRef.current?.appendChild(particle);
   return particle;
  });

  // Animate particles
  particles.forEach((particle, i) => {
   gsap.set(particle, {
    scale: Math.random() * 0.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
   });

   gsap.to(particle, {
    x: `random(-100, 100)`,
    y: `random(-100, 100)`,
    duration: `random(3, 6)`,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    delay: i * 0.1,
   });

   gsap.to(particle, {
    opacity: `random(0.2, 0.8)`,
    duration: `random(2, 4)`,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
    delay: i * 0.05,
   });
  });
  // Create connecting lines
  const createConnections = () => {
   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
   svg.setAttribute(
    "class",
    "absolute inset-0 w-full h-full pointer-events-none"
   );
   svg.style.zIndex = "1";

   particles.forEach((particle1, i) => {
    particles.slice(i + 1).forEach((particle2) => {
     const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
     );
     line.setAttribute("stroke", "rgba(59, 130, 246, 0.2)");
     line.setAttribute("stroke-width", "1");

     const updateLine = () => {
      const rect1 = particle1.getBoundingClientRect();
      const rect2 = particle2.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
       const x1 = rect1.left - containerRect.left + rect1.width / 2;
       const y1 = rect1.top - containerRect.top + rect1.height / 2;
       const x2 = rect2.left - containerRect.left + rect2.width / 2;
       const y2 = rect2.top - containerRect.top + rect2.height / 2;

       const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

       if (distance < 150) {
        line.setAttribute("x1", x1.toString());
        line.setAttribute("y1", y1.toString());
        line.setAttribute("x2", x2.toString());
        line.setAttribute("y2", y2.toString());
        line.setAttribute("opacity", (1 - distance / 150).toString());
       } else {
        line.setAttribute("opacity", "0");
       }
      }
     };

     svg.appendChild(line);
     gsap.ticker.add(updateLine);
    });
   });

   containerRef.current?.appendChild(svg);
  };

  setTimeout(createConnections, 100);

  return () => {
   particles.forEach((particle) => particle.remove());
  };
 }, []);

 return (
  <div
   ref={containerRef}
   className="absolute inset-0 overflow-hidden pointer-events-none"
   style={{ zIndex: 0 }}
  />
 );
};
