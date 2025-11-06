import React from "react";

export type HotspotProps = {
  id: string;
  ariaLabel: string;
  icon: React.ReactNode;     // JSX element, e.g. <House />
  onClick?: () => void;
  selected?: boolean;
  progress?: number;         // 0..1
  badge?: React.ReactNode;
  className?: string;
};

export function Hotspot({
  id, ariaLabel, icon, onClick, selected, progress, badge, className,
}: HotspotProps) {
  const pct = typeof progress === "number" ? Math.round(progress * 100) : null;

  return (
    <button
  onClick={onClick}
  className="
    p-0 m-0 bg-transparent border-none
    outline-none
    focus:outline-none
    focus-visible:outline-none
    focus:ring-0 focus-visible:ring-0
    ring-0
  "
  style={{
    background: "transparent",
    border: "none",
    WebkitTapHighlightColor: "transparent", // mobile Safari tap highlight
  }}
>
  {icon}
</button>


  );
}
