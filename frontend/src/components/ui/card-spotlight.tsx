"use client";

import React from "react";
import { cn } from "../../lib/utils";

export const CardSpotlight = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-neutral-800 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl group",
        className
      )}
      {...props}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-600/30 via-purple-500/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}; 