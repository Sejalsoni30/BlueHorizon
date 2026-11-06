export const MOTION_CONFIG = {
  ease: [0.16, 1, 0.3, 1] as const,
  easeString: 'cubic-bezier(0.16, 1, 0.3, 1)',
  durations: {
    micro: 0.2,
    ui: 0.4,
    reveal: 0.9,
    hero: 1.4,
  },
  stagger: {
    fast: 0.04,
    medium: 0.08,
    cards: 0.12,
  },
};

export const fadeInReveal = {
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: {
    duration: MOTION_CONFIG.durations.reveal,
    ease: MOTION_CONFIG.ease,
  },
};

export const pageCurtainVariants = {
  initial: { scaleY: 1, originY: 0 },
  animate: { scaleY: 0, originY: 0, transition: { duration: 0.65, ease: MOTION_CONFIG.ease } },
  exit: { scaleY: 1, originY: 1, transition: { duration: 0.5, ease: MOTION_CONFIG.ease } },
};

