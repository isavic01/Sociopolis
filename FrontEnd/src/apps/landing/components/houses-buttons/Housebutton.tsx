import { motion } from 'framer-motion';

export type HotspotProps = {
  id: string;
  ariaLabel: string;
  icon: React.ReactNode;       // SVG/JSX for the button
  onClick?: () => void;
  selected?: boolean;
  progress?: number;           // optional 0..1 — if provided, show ring
  badge?: React.ReactNode;     // optional custom badge overlay
  className?: string;          // optional wrapper classes
};

export function Hotspot({
  id, ariaLabel, icon, onClick, selected, progress, badge, className,
}: HotspotProps) {
  const pct = typeof progress === 'number' ? Math.round(progress * 100) : null;

  return (
    <button
      aria-label={ariaLabel}
      data-id={id}
      onClick={onClick}
      className={`relative outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black ${className ?? ''}`}
    >
      {/* Icon with subtle motion */}
      <motion.div
        initial={{ scale: 1, opacity: 0.95 }}
        animate={{ scale: selected ? 1.04 : 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="pointer-events-none"
      >
        {icon}
      </motion.div>

      {/* Optional radial progress ring */}
      {typeof progress === 'number' && (
        <div className="absolute -top-2 -right-2">
          <RadialProgress value={progress} label={`${pct}%`} />
        </div>
      )}

      {/* Optional custom badge */}
      {badge}
    </button>
  );
}

// Lightweight SVG progress ring (size = 36px)
function RadialProgress({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(1, value));
  const size = 36, stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Progress ${label ?? ''}`}>
      <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} fill="none" opacity="0.2" stroke="currentColor" />
      <motion.circle
        cx={size/2} cy={size/2} r={r} strokeWidth={stroke} fill="none"
        stroke="currentColor" strokeLinecap="round"
        initial={false}
        animate={{ strokeDasharray: c, strokeDashoffset: offset }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
      />
      {label && (
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight={600}>
          {label}
        </text>
      )}
    </svg>
  );
}
