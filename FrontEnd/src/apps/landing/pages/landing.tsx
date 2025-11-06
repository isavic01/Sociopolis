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

  // temp place for the reports
  const [reportText, setReportText] = useState('');
  const [status, setStatus] = useState('');

  const handleClick = (id: string) => {
    console.log(`Clicked: ${id}`);
    // later: open modal, navigate, or trigger progress animation
  };

  async function handleReport() {
    const user = auth.currentUser;
    const trimmed = reportText.trim();
    const wordCount = trimmed === '' ? 0 : trimmed.split(/\s+/).length;

    if (wordCount === 0) return setStatus('please write something');
    if (wordCount > 500) return setStatus('too long (max 500 words)');

    try {
      await addDoc(collection(db, 'reports'), {
        message: trimmed,
        wordCount,
        sourcePage: 'landing',
        uid: user?.uid ?? null,
        email: user?.email ?? null,
        displayName: user?.displayName ?? null,
        createdAt: serverTimestamp(),
      });
      setReportText('');
      setStatus('success');
    } catch (err) {
      console.error('error submitting report', err);
      setStatus('failed to submit');
    }
  }

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

      {/* ✍️ Feedback section */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-md max-w-md w-[90%]">
        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="write your feedback/report here (max 500 words)"
          rows={5}
          className="w-full border border-gray-300 rounded p-2"
        />
        <button
          onClick={handleReport}
          className="w-full mt-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Report to Developer
        </button>
        <p className="text-sm text-gray-600 mt-2">{status}</p>
        <p className="text-sm text-gray-500">
          Word count:{' '}
          {reportText.trim() === '' ? 0 : reportText.trim().split(/\s+/).length}
          /500
        </p>
      </div>
    </div>
  );
}
