import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: "primary" | "secondary" | "outline" | "ghost";
 size?: "sm" | "md" | "lg";
 children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
 variant = "primary",
 size = "md",
 children,
 className = "",
 ...props
}) => {
 const baseClasses =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 cursor-pointer focus:ring-offset-2";
 const variantClasses = {
  primary:
   "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
  secondary:
   "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary",
  outline:
   "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
 };

 const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
 };

 return (
  <button
   className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
   {...props}
  >
   {children}
  </button>
 );
};
