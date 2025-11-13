import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { HamburgerButton } from '../components/hamburgerbutton';
import { SideMenu } from '../components/sidemenu';
import { Background } from '../components/background';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebaseConfig';

import { REGIONS } from '@/apps/landing/components/houses-buttons/RegionDef';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleClick = (id: string) => {
    console.log(`Clicked: ${id}`);
    // later: open modal, navigate, or trigger progress animation
  };
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🧭 Navigation and background */}
      <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} />
      <SideMenu isOpen={menuOpen} />
      <Background /> {/* ✅ Kept intact and in full view */}

      {/* 🏠 Clickable SVG Houses */}
      {REGIONS.map((region) => (
        <motion.button
          key={region.id}
          aria-label={region.ariaLabel}
          onClick={() => handleClick(region.id)}
          className="absolute cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black/80"
          style={{
            left: region.x,
            top: region.y,
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
          }}
          // whileHover={{ scale: 1.08 }}
          // whileTap={{ scale: 0.95 }}
        >
          <div className="w-20 h-20">
            {React.isValidElement(region.icon)
              ? React.cloneElement(region.icon as React.ReactElement, {
                  // className: 'w-full h-full',
                })
              : region.icon}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
