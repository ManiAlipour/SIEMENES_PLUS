"use client";

/**
 * ░ INDUSTRIAL DIVIDER – Siemens / Lux v2 Design ░
 * -------------------------------------------------
 * Visual purpose:
 * Used between page sections to build cold mechanical rhythm.
 * The gradient line fades from transparent → slate → transparent,
 * mimicking brushed aluminum highlight.
 */

export default function Divider() {
  return (
    <div
      aria-hidden="true"
      className="
        w-full h-px 
        bg-gradient-to-r
        from-transparent
        via-slate-300/50
        to-transparent
        my-12
        md:my-16
      "
    />
  );
}
