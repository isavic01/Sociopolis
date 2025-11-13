import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { HamburgerButton } from '../components/hamburgerbutton';
import { SideMenu } from '../components/sidemenu';
import { Background } from '../components/background';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebaseConfig';

import { REGIONS } from '@/apps/landing/components/houses-buttons/RegionDef';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const navigate = useNavigate();

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
      {/* 🧭 Navigation and background */}
      <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} />
      <SideMenu isOpen={menuOpen} />
      <Background /> {/* ✅ Kept intact and in full view */}

      {/* 🏠 Clickable SVG Houses with Enhanced Styling */}
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

            {/* Progress Ring (optional - can be connected to actual progress later) */}
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

          {/* Tooltip on Hover */}
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
                {/* Tooltip Arrow */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-t-2 border-l-2 border-white/50"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
