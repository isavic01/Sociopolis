import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { HamburgerButton } from '../components/hamburgerbutton';
import { SideMenu } from '../components/sidemenu';
import { Background } from '../components/background';
import { LeaderboardRankMonitor } from '../components/leaderboardrankmonitor';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebaseConfig';
import { useAuthContext } from '../../auth/components/authProvider';

import { REGIONS } from '@/apps/landing/components/houses-buttons/RegionDef';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const navigate = useNavigate();
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create a <lottie-player> element and append it to the ref container.
    // This uses the lottie web component we added to index.html.
    if (!lottieContainerRef.current) return;

    // Remove any previously mounted landing lottie players to avoid duplicates
    try {
      document.querySelectorAll('lottie-player[data-landing-lottie]').forEach((n) => n.remove());
    } catch (err) {
      // ignore
    }

    const el = document.createElement('lottie-player');
    el.setAttribute('src', '/src/assets/lottie/walk_cycle.json');
    el.setAttribute('data-landing-lottie', 'true');
    el.setAttribute('background', 'transparent');
    el.setAttribute('speed', '1');
    el.setAttribute('loop', 'true');
    el.setAttribute('autoplay', 'true'); // play animation from the start

    // Position it so it appears above everything on this page (bottom-right)
    el.style.position = 'absolute';
    // place center of the player on the 90% dynamic viewport height line
    // use dvh to account for mobile address bars and translate to center
    el.style.top = '90dvh';
    // start anchored near the right edge (2rem offset) but use `left` so we can animate X
    el.style.left = 'calc(100% - 2rem - 120px)';
    el.style.transform = 'translateY(-50%)';
    el.style.transformOrigin = 'center center';
    el.style.zIndex = '9999';
    el.style.width = '240px';
    el.style.height = '240px';
    // smooth transition for both step movement and flips (matches THINK_DELAY for fluidity)
    el.style.transition = 'left 350ms ease, transform 120ms ease';
    // Allow pointer interactions directly on the player while container remains pointer-events: none
    el.style.pointerEvents = 'auto';

    lottieContainerRef.current.appendChild(el);

    // Toggle horizontal reflection based on pointer movement along X.
    // If the cursor moves left (negative deltaX) we mirror the player (scaleX(-1)).
    let lastX: number | null = null;
    let isReflected = false;
    let targetX: number | null = null;
    let currentX: number | null = null;
    let currentY: number | null = null;
    let thinkTimeoutId: number | null = null;
    let lastCursorX: number | null = null; // track most recent cursor X
    // buffer recent pointer positions so we can follow the cursor with a delay
    const DELAY_MS = 1000; // 1 second delay
    const posBuffer: Array<{ x: number; t: number }> = [];
    const STEPSIZE = 24;
    const THINK_DELAY = 400; // milliseconds between steps (higher = slower, less snappy)



    const applyReflection = (reflect: boolean) => {
      isReflected = reflect;

      // Clear buffer and immediately set target to current cursor (not delayed)
      posBuffer.length = 0;
      if (lastCursorX !== null) {
        targetX = lastCursorX - (el.offsetWidth / 2);
      }

      el.style.transform = `translateY(-50%)`;

      el.style.willChange = 'transform';
      el.style.backfaceVisibility = 'hidden';
      // try to flip the internal svg/canvas inside the lottie-player's shadow root
      try {
        const inner = (el as any).shadowRoot?.querySelector('svg, canvas, div') || el;
        if (inner) {
          (inner as HTMLElement).style.transformOrigin = 'center center';
          (inner as HTMLElement).style.transformBox = 'fill-box';
          (inner as HTMLElement).style.willChange = 'transform';
          (inner as HTMLElement).style.backfaceVisibility = 'hidden';
          (inner as HTMLElement).style.transform = `scaleX(${reflect ? -1 : 1})`;
          return;
        }
      } catch (err) {
        // ignore if shadowRoot access is restricted
      }

      // Fallback: apply mirror on host only
      el.style.transform = `translateY(-50%) scaleX(${reflect ? -1 : 1})`;
    };

    const onPointerMove = (ev: PointerEvent) => {
      const x = ev.clientX;
      const y = ev.clientY;
      lastCursorX = x; // always track current cursor

      if (lastX === null) lastX = x;
      const dx = x - lastX;

      // small deadzone to avoid jitter for reflection
      if (dx < -2 && !isReflected) applyReflection(true);
      else if (dx > 2 && isReflected) applyReflection(false);
      lastX = x;

      // push timestamped position into buffer
      posBuffer.push({ x, t: performance.now() });
      // prune old entries to keep buffer small
      const pruneBefore = performance.now() - (DELAY_MS);
      while (posBuffer.length && posBuffer[0].t < pruneBefore) posBuffer.shift();
      // kick the Think loop if it's not already running
      if (thinkTimeoutId === null) {
        think();
      }
    };

    // Step-based movement loop (like Neko) using setTimeout
    const think = () => {
      // determine the delayed reference time
      const refTime = performance.now() - DELAY_MS;

      // find the latest buffered position at or before refTime
      let chosen: { x: number; t: number } | null = null;
      for (let i = posBuffer.length - 1; i >= 0; i--) {
        if (posBuffer[i].t <= refTime) {
          chosen = posBuffer[i];
          break;
        }
      }

      // if none found, use the earliest available (we're still within the initial delay window)
      if (!chosen && posBuffer.length) chosen = posBuffer[0];

      if (!chosen) {
        // nothing to follow
        thinkTimeoutId = null;
        return;
      }

      // compute new targetX from chosen buffer entry (center player on cursor)
      targetX = chosen.x - (el.offsetWidth / 2);

      if (currentX === null) {
        // initialize from computed layout
        const rect = el.getBoundingClientRect();
        currentX = rect.left;
        currentY = rect.top;
        el.style.left = `${currentX}px`;
      }

      // Calculate distance and take one step toward target (Neko-style)
      const distX = targetX - currentX;

      // Calculate distance-based speed boost: if distance from player > 10dvw, speed up exponentially
      const playerRect = el.getBoundingClientRect();
      const playerCenterX = playerRect.left + playerRect.width / 2;
      const distanceFromCursor = Math.abs(targetX - playerCenterX);
      const tenDvw = (window.innerWidth / 100) * 5; // 10% of viewport width
      
      let dynamicStepsize = STEPSIZE;
      let dynamicThinkDelay = THINK_DELAY;

      if (distanceFromCursor > tenDvw) {
        // exponential speed boost: further = faster
        const excessDistance = distanceFromCursor - tenDvw;
        const speedMultiplier = 1 + (excessDistance / (window.innerWidth / 2)); // scales up to ~2x at screen edge
        dynamicStepsize = Math.round(STEPSIZE * speedMultiplier);
        dynamicThinkDelay = Math.round(THINK_DELAY / speedMultiplier);
        // also increase animation playback speed by adjusting lottie speed
        el.setAttribute('speed', String(0.5 + speedMultiplier * 0.5)); // speed ranges from 0.5 to ~1.5
      } else {
        el.setAttribute('speed', '1');
      }

      // Move one step closer (or settle if within threshold)
      if (Math.abs(distX) > 1) {
        const dx = (distX > 0 ? 1 : -1) * dynamicStepsize;
        currentX += dx;
        el.style.left = `${currentX}px`;
      } else {
        // settle at target
        currentX = targetX;
        el.style.left = `${currentX}px`;
      }

      // continue looping via setTimeout (Think pattern) with dynamic delay
      if (Math.abs(targetX - currentX) > 1) {
        thinkTimeoutId = window.setTimeout(think, dynamicThinkDelay) as unknown as number;
      } else {
        thinkTimeoutId = null;
        el.setAttribute('speed', '1'); // reset speed when settled
      }
    };

    // Listen on document so movement anywhere controls the player
    document.addEventListener('pointermove', onPointerMove);
    


    // Attach freeze/unfreeze functions to element so they can be called externally
    return () => {
      if (lottieContainerRef.current && el.parentNode === lottieContainerRef.current) {
        lottieContainerRef.current.removeChild(el);
      }
      document.removeEventListener('pointermove', onPointerMove);
      if (thinkTimeoutId !== null) {
        try { window.clearTimeout(thinkTimeoutId); } catch { }
        thinkTimeoutId = null;
      }
      // ensure any leftovers are removed
      try {
        document.querySelectorAll('lottie-player[data-landing-lottie]').forEach((n) => n.remove());
      } catch (err) {
        // ignore
      }
    };
  }, []);

  const handleClick = (lessonId: string) => {
    console.log(`Navigating to lesson: ${lessonId}`);
    navigate(`/lesson/${lessonId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div ref={lottieContainerRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} />
      <SideMenu isOpen={menuOpen} />
      <Background />
      {REGIONS.map((region) => (
        <div
          key={region.id}
          className="absolute"
          style={{
            left: region.x,
            top: region.y,
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
          }}
          onMouseEnter={() => setHoveredRegion(region.id)}
          onMouseLeave={() => setHoveredRegion(null)}
        >
          <motion.button
            aria-label={region.ariaLabel}
            onClick={() => handleClick(region.lessonId)}
            className="relative cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-white/80 rounded-full"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* House Icon */}
            <div className="w-24 h-24 drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300 filter hover:brightness-110">
              {React.isValidElement(region.icon)
                ? region.icon
                : region.icon}
            </div>

            <div className="absolute inset-0 -z-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="2"
                  strokeDasharray={`${region.initialProgress * 3.01} 301`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
          </motion.button>

          <AnimatePresence>
            {hoveredRegion === region.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 min-w-[250px] border-2 border-white/50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {region.title}
                    </h3>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(region.difficulty)}`}>
                      {region.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {region.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Click to start lesson
                    </span>
                    <svg 
                      className="w-5 h-5 text-blue-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-t-2 border-l-2 border-white/50"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
