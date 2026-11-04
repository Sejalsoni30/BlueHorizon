import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      if (target?.closest('button, a, input, [role="button"], .magnetic-target')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let frameId: number;
    const follow = () => {
      setTrailing((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.25,
        y: prev.y + (pos.y - prev.y) * 0.25,
      }));
      frameId = requestAnimationFrame(follow);
    };
    frameId = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(frameId);
    };
  }, [pos]);

  if (!isVisible) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full mix-blend-screen transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`,
          width: '8px',
          height: '8px',
          backgroundColor: '#22D3EE',
          boxShadow: '0 0 10px #22D3EE',
        }}
      />
      <div
        className="pointer-events-none fixed top-0 left-0 z-[99] rounded-full border border-cyan/40 transition-all duration-150 ease-out"
        style={{
          transform: `translate3d(${trailing.x - (isHovered ? 20 : 14)}px, ${trailing.y - (isHovered ? 20 : 14)}px, 0) scale(${isHovered ? 1.4 : 1})`,
          width: isHovered ? '40px' : '28px',
          height: isHovered ? '40px' : '28px',
          backgroundColor: isHovered ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
        }}
      />
    </>
  );
};

