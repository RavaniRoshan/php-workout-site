// GSAP Configuration and Utilities
// Optimized imports and lazy loading configuration

// Core GSAP configuration
export const gsapConfig = {
  defaults: {
    duration: 0.6,
    ease: "power2.out"
  },
  scrollTrigger: {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  },
  // Fitness-appropriate easing curves
  easings: {
    elastic: "elastic.out(1, 0.3)",
    bounce: "bounce.out",
    power: "power2.out",
    back: "back.out(1.7)",
    smooth: "power1.inOut"
  },
  // Animation durations for different contexts
  durations: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
    counter: 2.0
  }
};

// Lazy loading configuration for GSAP plugins
export const lazyLoadPlugins = {
  scrollTrigger: () => import('gsap/ScrollTrigger'),
  textPlugin: () => import('gsap/TextPlugin'),
  morphSVG: () => import('gsap/MorphSVGPlugin'),
  drawSVG: () => import('gsap/DrawSVGPlugin')
};

// Performance optimization settings
export const performanceConfig = {
  // Reduce motion for users who prefer it
  respectReducedMotion: true,
  // Battery optimization for mobile
  optimizeForMobile: true,
  // Frame rate targets
  targetFPS: 60,
  // Memory management
  autoCleanup: true
};

// Common animation presets for fitness theme
export const animationPresets = {
  // Hero section animations
  heroTitle: {
    duration: 1.2,
    ease: gsapConfig.easings.back,
    stagger: 0.1
  },
  
  // Card reveal animations
  cardReveal: {
    duration: 0.8,
    ease: gsapConfig.easings.power,
    stagger: 0.15,
    y: 50,
    opacity: 0
  },
  
  // Button hover effects
  buttonHover: {
    duration: 0.3,
    ease: gsapConfig.easings.back,
    scale: 1.05,
    y: -2
  },
  
  // Counter animations
  counterUp: {
    duration: gsapConfig.durations.counter,
    ease: gsapConfig.easings.power
  },
  
  // Form step transitions
  stepTransition: {
    duration: 0.5,
    ease: gsapConfig.easings.smooth,
    x: 50,
    opacity: 0
  },
  
  // Achievement celebrations
  achievement: {
    duration: 0.6,
    ease: gsapConfig.easings.elastic,
    scale: 1.2,
    rotation: 5
  }
};

// Utility function to check for reduced motion preference
export function shouldReduceMotion() {
  if (!performanceConfig.respectReducedMotion) return false;
  
  return window.matchMedia && 
         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utility function to optimize animations for mobile
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Performance monitoring utility
export function monitorPerformance() {
  if (!performanceConfig.optimizeForMobile) return;
  
  let frameCount = 0;
  let lastTime = performance.now();
  
  function checkFrameRate() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      if (fps < performanceConfig.targetFPS * 0.8) {
        console.warn(`Low FPS detected: ${fps}fps. Consider reducing animation complexity.`);
        // Trigger performance optimization
        document.body.classList.add('reduce-animations');
      }
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(checkFrameRate);
  }
  
  requestAnimationFrame(checkFrameRate);
}