import React, { useEffect, useState } from 'react';
import { usePreferences } from '../../context/PreferencesContext';

export const CustomCursor: React.FC = () => {
  const { lowBandwidth, prefersReducedMotion } = usePreferences();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<'default' | 'hover' | 'card' | 'drought'>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lowBandwidth || prefersReducedMotion) {
      setIsVisible(false);
      return;
    }

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;

      if (target?.closest('[data-theme="drought"], .drought-accent')) {
        setMode('drought');
      } else if (target?.closest('.glass-panel, .glass-card, [data-cursor="view"]')) {
        setMode('card');
      } else if (target?.closest('button, a, input, select, textarea, [role="button"]')) {
        setMode('hover');
      } else {
        setMode('default');
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
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22,
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
  }, [pos, lowBandwidth, prefersReducedMotion]);

  if (!isVisible || lowBandwidth || prefersReducedMotion) return null;

  const isEmber = mode === 'drought';
  const isCard = mode === 'card';
  const isHover = mode === 'hover';

  const dotColor = isEmber ? '#FF7A2F' : '#5CFFB1';
  const ringSize = isCard ? 48 : isHover ? 38 : 26;

  return (
    <>
      {/* Inner Lead Dot */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full mix-blend-screen transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x - 3.5}px, ${pos.y - 3.5}px, 0)`,
          width: '7px',
          height: '7px',
          backgroundColor: dotColor,
          boxShadow: `0 0 12px ${dotColor}`,
        }}
      />

      {/* Outer Lagging Aura / View Pill */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[99] rounded-full border transition-all duration-150 ease-out flex items-center justify-center font-mono text-[9px] uppercase tracking-wider font-bold"
        style={{
          transform: `translate3d(${trailing.x - ringSize / 2}px, ${trailing.y - ringSize / 2}px, 0)`,
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          borderColor: isEmber ? 'rgba(255, 122, 47, 0.45)' : 'rgba(92, 255, 177, 0.45)',
          backgroundColor: isCard
            ? 'rgba(14, 15, 16, 0.65)'
            : isHover
            ? isEmber
              ? 'rgba(255, 122, 47, 0.12)'
              : 'rgba(92, 255, 177, 0.12)'
            : 'transparent',
          color: isEmber ? '#FF7A2F' : '#5CFFB1',
          backdropFilter: isCard ? 'blur(6px)' : 'none',
        }}
      >
        {isCard && <span className="opacity-90">View</span>}
      </div>
    </>
  );
};
