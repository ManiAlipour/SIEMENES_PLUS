"use client";

import React from "react";

type FixedBgOptions = {
  backgroundImage: string; // path from public or absolute URL
  overlayColor?: string; // e.g. rgba(0,0,0,0.5) or tailwind-like hex
  overlayOpacity?: number; // 0..1 if overlayColor has no alpha
  className?: string; // extra classes for the outer section
  minHeight?: string; // e.g. "60vh"
};

export function withFixedBg<P extends object>(
  Wrapped: React.ComponentType<P>,
  options: FixedBgOptions
) {
  const {
    backgroundImage,
    overlayColor = "#000000",
    overlayOpacity = 0.35,
    className = "",
    minHeight = "60vh",
  } = options;

  const FixedBgSection: React.FC<P> = (props) => {
    return (
      <section
        className={`relative w-full bg-fixed bg-center bg-no-repeat bg-cover ${className}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          minHeight,
        }}
      >
        {/* overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />

        {/* content */}
        <div className="relative z-10">
          <Wrapped {...(props as P)} />
        </div>
      </section>
    );
  };

  FixedBgSection.displayName = `withFixedBg(${Wrapped.displayName || Wrapped.name || "Component"})`;

  return FixedBgSection;
}

export default withFixedBg;


