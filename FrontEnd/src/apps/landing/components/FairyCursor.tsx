import React, { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export function FairyCursor() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [fairyPosition, setFairyPosition] = useState<Position>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth fairy following with lag
  useEffect(() => {
    const animationFrame = () => {
      setFairyPosition(prev => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        
        // Smooth interpolation with lag (0.1 = more lag, 0.3 = less lag)
        const lerp = 0.15;
        
        return {
          x: prev.x + dx * lerp,
          y: prev.y + dy * lerp
        };
      });
    };

    const interval = setInterval(animationFrame, 16); // 60fps
    return () => clearInterval(interval);
  }, [mousePosition]);

  if (!isVisible) return null;

  return (
    <div
      className="fairy-cursor"
      style={{
        position: 'fixed',
        left: fairyPosition.x - 12, // Center the fairy
        top: fairyPosition.y - 12,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'opacity 0.3s ease',
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Fairy with sparkle trail */}
      <div className="fairy-container">
        {/* Main fairy body */}
        <div className="fairy-body">
          ✨
        </div>
        
        {/* Sparkle trail */}
        <div className="sparkle-trail">
          <span className="sparkle sparkle-1">⭐</span>
          <span className="sparkle sparkle-2">✦</span>
          <span className="sparkle sparkle-3">⋆</span>
        </div>
      </div>

      <style jsx>{`
        .fairy-container {
          position: relative;
          animation: float 2s ease-in-out infinite;
        }

        .fairy-body {
          font-size: 24px;
          animation: glow 1.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));
        }

        .sparkle-trail {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .sparkle {
          position: absolute;
          font-size: 12px;
          animation: sparkle 1s ease-in-out infinite;
          opacity: 0;
        }

        .sparkle-1 {
          top: -15px;
          left: -10px;
          animation-delay: 0s;
          color: #FFD700;
        }

        .sparkle-2 {
          top: 5px;
          left: -20px;
          animation-delay: 0.3s;
          color: #FF69B4;
        }

        .sparkle-3 {
          top: -5px;
          left: 15px;
          animation-delay: 0.6s;
          color: #87CEEB;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(2deg); }
        }

        @keyframes glow {
          0% { filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8)) brightness(1); }
          100% { filter: drop-shadow(0 0 12px rgba(255, 215, 0, 1)) brightness(1.2); }
        }

        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
          100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}