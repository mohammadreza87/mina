/**
 * 🎬 Design System Animations (2025 Bold Retro)
 * GSAP-powered animation library
 */

import { gsap } from 'gsap';

// ⏱️ Standard durations
export const DURATION = {
  instant: 0.15,
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  lazy: 1.2,
} as const;

// 🎭 Standard easing functions
export const EASE = {
  smooth: 'power2.out',
  strong: 'power3.out',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'back.out(1.7)',
  expo: 'expo.inOut',
} as const;

/**
 * 1️⃣ FADE IN UP (Default Enter Animation)
 * Use for: Cards, sections, content appearing
 */
export const fadeInUp = (
  element: gsap.TweenTarget,
  options: { duration?: number; delay?: number; stagger?: number } = {}
) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || DURATION.normal,
      delay: options.delay || 0,
      stagger: options.stagger || 0,
      ease: EASE.smooth,
    }
  );
};

/**
 * 2️⃣ SCALE BOUNCE (Button Hover/Click)
 * Use for: Buttons, interactive elements
 */
export const scaleBounce = (element: gsap.TweenTarget) => {
  return gsap.fromTo(
    element,
    { scale: 0.95 },
    {
      scale: 1,
      duration: DURATION.fast,
      ease: EASE.bounce,
    }
  );
};

/**
 * 3️⃣ KINETIC TYPOGRAPHY (Bold Text Reveal)
 * Use for: Hero titles, section headings
 * Requires: Split text into individual elements (words/chars)
 */
export const kineticTypography = (
  elements: gsap.TweenTarget,
  options: { stagger?: number; duration?: number } = {}
) => {
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: options.stagger || 0.05,
      duration: options.duration || DURATION.slow,
      ease: EASE.strong,
    }
  );
};

/**
 * 4️⃣ NEON GLOW PULSE (Accent Elements)
 * Use for: CTAs, highlighted items, attention grabbers
 */
export const neonGlowPulse = (
  element: gsap.TweenTarget,
  color: 'purple' | 'cyan' | 'pink' = 'purple'
) => {
  const colors = {
    purple: 'rgba(139, 92, 246, 0.8)',
    cyan: 'rgba(6, 182, 212, 0.8)',
    pink: 'rgba(236, 72, 153, 0.8)',
  };

  return gsap.to(element, {
    boxShadow: `0 0 20px ${colors[color]}`,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

/**
 * 5️⃣ GLITCH EFFECT (Hover/Interaction)
 * Use for: Retro hover effects, error states
 */
export const glitchEffect = (element: gsap.TweenTarget) => {
  const tl = gsap.timeline();

  // Shake horizontally with random offsets
  tl.to(element, {
    x: () => gsap.utils.random(-2, 2),
    duration: 0.05,
    repeat: 3,
    yoyo: true,
    ease: 'power1.inOut',
  });

  // Optional: Add color shift
  tl.to(
    element,
    {
      filter: 'hue-rotate(90deg)',
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    },
    0
  );

  return tl;
};

/**
 * 6️⃣ SLIDE IN FROM SIDE (Modal/Drawer)
 * Use for: Modals, sidebars, notifications
 */
export const slideInFromSide = (
  element: gsap.TweenTarget,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'right'
) => {
  const positions = {
    left: { x: '-100%', y: 0 },
    right: { x: '100%', y: 0 },
    top: { x: 0, y: '-100%' },
    bottom: { x: 0, y: '100%' },
  };

  return gsap.fromTo(
    element,
    positions[direction],
    {
      x: 0,
      y: 0,
      duration: DURATION.normal,
      ease: EASE.strong,
    }
  );
};

/**
 * 7️⃣ FLOAT ANIMATION (Continuous)
 * Use for: Decorative elements, icons
 */
export const floatContinuous = (
  element: gsap.TweenTarget,
  distance: number = 10
) => {
  return gsap.to(element, {
    y: -distance,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

/**
 * 8️⃣ STAGGERED LIST REVEAL
 * Use for: Lists, grids, cards appearing
 */
export const staggeredReveal = (
  elements: gsap.TweenTarget,
  options: { stagger?: number; direction?: 'up' | 'down' } = {}
) => {
  const yStart = options.direction === 'down' ? -20 : 20;

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: yStart,
    },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.normal,
      stagger: options.stagger || 0.1,
      ease: EASE.smooth,
    }
  );
};

/**
 * 9️⃣ SCALE ROTATE IN (Logo/Icon Entrance)
 * Use for: Logos, icons, badges
 */
export const scaleRotateIn = (element: gsap.TweenTarget) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0,
      rotation: -180,
    },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: DURATION.slow,
      ease: EASE.bounce,
    }
  );
};

/**
 * 🔟 GRADIENT SHIFT ANIMATION
 * Use for: Backgrounds, cards, interactive elements
 */
export const gradientShift = (element: gsap.TweenTarget) => {
  return gsap.to(element, {
    backgroundPosition: '200% center',
    duration: 3,
    repeat: -1,
    ease: 'none',
  });
};

/**
 * 1️⃣1️⃣ PAGE TRANSITION (Enter)
 * Use for: Route changes, page loads
 */
export const pageTransitionEnter = (element: gsap.TweenTarget) => {
  const tl = gsap.timeline();

  tl.fromTo(
    element,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.slow,
      ease: EASE.expo,
    }
  );

  return tl;
};

/**
 * 1️⃣2️⃣ PAGE TRANSITION (Exit)
 * Use for: Route changes, page unloads
 */
export const pageTransitionExit = (element: gsap.TweenTarget) => {
  return gsap.to(element, {
    opacity: 0,
    y: -30,
    duration: DURATION.normal,
    ease: EASE.expo,
  });
};

/**
 * 1️⃣3️⃣ HOVER LIFT (Card Effect)
 * Use for: Cards, clickable items
 */
export const hoverLift = (element: Element) => {
  const onEnter = () => {
    gsap.to(element, {
      y: -4,
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  const onLeave = () => {
    gsap.to(element, {
      y: 0,
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  element.addEventListener('mouseenter', onEnter);
  element.addEventListener('mouseleave', onLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', onEnter);
    element.removeEventListener('mouseleave', onLeave);
  };
};

/**
 * 1️⃣4️⃣ ATTENTION SEEKER (Shake)
 * Use for: Errors, required fields
 */
export const shake = (element: gsap.TweenTarget) => {
  return gsap.to(element, {
    x: -10,
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    ease: 'power1.inOut',
  });
};

/**
 * 🎯 UTILITY: Kill all animations on element
 */
export const killAnimations = (element: gsap.TweenTarget) => {
  gsap.killTweensOf(element);
};

/**
 * 🎯 UTILITY: Create scroll-triggered animation
 * Requires: GSAP ScrollTrigger plugin
 */
export const scrollReveal = (
  element: gsap.TweenTarget,
  options: {
    trigger?: string | Element;
    start?: string;
    end?: string;
  } = {}
) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.slow,
      ease: EASE.smooth,
      scrollTrigger: {
        trigger: options.trigger || element,
        start: options.start || 'top 80%',
        end: options.end || 'top 20%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

/**
 * 🎬 PRESET TIMELINES
 */

// Hero section entrance
export const createHeroTimeline = (
  title: gsap.TweenTarget,
  subtitle: gsap.TweenTarget,
  cta: gsap.TweenTarget
) => {
  const tl = gsap.timeline();

  tl.add(kineticTypography(title, { stagger: 0.03 }))
    .add(fadeInUp(subtitle, { duration: DURATION.slow }), '-=0.5')
    .add(scaleBounce(cta), '-=0.3');

  return tl;
};

// Card grid entrance
export const createGridTimeline = (cards: gsap.TweenTarget) => {
  return staggeredReveal(cards, { stagger: 0.1, direction: 'up' });
};

// Modal appearance
export const createModalTimeline = (
  backdrop: gsap.TweenTarget,
  modal: gsap.TweenTarget
) => {
  const tl = gsap.timeline();

  tl.fromTo(
    backdrop,
    { opacity: 0 },
    { opacity: 1, duration: DURATION.fast }
  ).add(fadeInUp(modal, { duration: DURATION.normal }), '-=0.2');

  return tl;
};
