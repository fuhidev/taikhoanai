"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";

const Player = dynamic(
 () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
 {
  ssr: false,
  loading: () => (
   <div className="w-full h-full bg-muted animate-pulse rounded" />
  ),
 }
);

interface LottiePlayerProps extends ComponentProps<typeof Player> {
 src: string;
}

export function LottiePlayer({ src, ...props }: LottiePlayerProps) {
 return <Player src={src} {...props} autoplay loop />;
}
// AI-themed Lottie animations with fallback URLs
export const AIBrainAnimation = ({ className }: { className?: string }) => {
 return (
  <LottiePlayer
   src="/lotties/Animation - 1748578687351.json"
   className={className}
   speed={0.8}
  />
 );
};

export const RobotAnimation = ({ className }: { className?: string }) => {
 return (
  <LottiePlayer
   src="/lotties/robothello.json"
   className={className}
   speed={1.2}
  />
 );
};

export const LoadingAIAnimation = ({ className }: { className?: string }) => {
 // Fallback to CSS animation if Lottie fails
 return (
  <div className={`relative ${className}`}>
   <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-spin">
    <div className="absolute inset-2 bg-primary rounded-full flex items-center justify-center">
     <div className="w-8 h-8 bg-secondary rounded-full animate-pulse"></div>
    </div>
   </div>
   <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
   </div>
  </div>
 );
};
