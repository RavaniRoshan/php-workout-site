/**
 * Animation utility functions for common effects (fade, slide, scale)
 * These utilities work with the AnimationController for consistent animations
 */

import animationController from '../components/AnimationController.js';
import { animationPresets, shouldReduceMotion } from './gsap-config.js';

/**
 * Fade animations
 */
export const fadeAnimations = {
  /**
   * Fade in element
   */
  fadeIn(target, options = {}) {
    const defaults = {
      duration: 0.6,
      ease: "power2.out",
      opacity: 1,
      ...options
    };
    
    return animationController.createAnimation(target, defaults);
  },

  /**
   * Fade out element
   */
  fadeOut(target, options = {}) {
    const defaults = {
      duration: 0.4,
      ease: "power2.in",
      opacity: 0,
      ...options
    };
    
    return animationController.createAnimation(target, defaults);
  },

  /**
   * Fade toggle (fade in if hidden, fade out if visible)
   */
  fadeToggle(target, options = {}) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    const isVisible = window.getComputedStyle(element).opacity !== '0';
    
    return isVisible ? 
      this.fadeOut(target, options) : 
      this.fadeIn(target, options);
  }
};

/**
 * Slide animations
 */
export const slideAnimations = {
  /**
   * Slide in from direction
   */
  slideIn(target, direction = 'up', options = {}) {
    const directions = {
      up: { y: 50 },
      down: { y: -50 },
      left: { x: 50 },
      right: { x: -50 }
    };
    
    const fromProps = {
      opacity: 0,
      ...directions[direction]
    };
    
    const toProps = {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      ...options
    };
    
    // Set initial state
    if (animationController.isReady()) {
      animationController.gsap.set(target, fromProps);
      return animationController.createAnimation(target, toProps);
    }
  },

  /**
   * Slide out to direction
   */
  slideOut(target, direction = 'up', options = {}) {
    const directions = {
      up: { y: -50 },
      down: { y: 50 },
      left: { x: -50 },
      right: { x: 50 }
    };
    
    const toProps = {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      ...directions[direction],
      ...options
    };
    
    return animationController.createAnimation(target, toProps);
  },

  /**
   * Slide reveal (like accordion)
   */
  slideReveal(target, options = {}) {
    const defaults = {
      height: 'auto',
      duration: 0.5,
      ease: "power2.out",
      ...options
    };
    
    return animationController.createAnimation(target, defaults);
  },

  /**
   * Slide hide (collapse height)
   */
  slideHide(target, options = {}) {
    const defaults = {
      height: 0,
      duration: 0.4,
      ease: "power2.in",
      ...options
    };
    
    return animationController.createAnimation(target, defaults);
  }
};

/**
 * Scale animations
 */
export const scaleAnimations = {
  /**
   * Scale in (grow from small)
   */
  scaleIn(target, options = {}) {
    const fromProps = {
      opacity: 0,
      scale: 0.8
    };
    
    const toProps = {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      ...options
    };
    
    if (animationController.isReady()) {
      animationController.gsap.set(target, fromProps);
      return animationController.createAnimation(target, toProps);
    }
  },

  /**
   * Scale out (shrink to small)
   */
  scaleOut(target, options = {}) {
    const toProps = {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      ...options
    };
    
    return animationController.createAnimation(target, toProps);
  },

  /**
   * Scale pulse (grow and shrink back)
   */
  scalePulse(target, options = {}) {
    const defaults = {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      ...options
    };
    
    return animationController.createAnimation(target, defaults);
  },

  /**
   * Scale bounce (elastic scale effect)
   */
  scaleBounce(target, options = {}) {
    const defaults = {
      scale: 1.2,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
      yoyo: true,
      repeat: 1,
      ...options
    };
    
    return animationController.createAnimation(target, defaults);
  }
};

/**
 * Rotation animations
 */
export const rotationAnimations = {
  /**
   * Rotate element
   */
  rotate(target, degrees = 360, options = {}) {
    const defaults = {
      rotation: degrees,
      duration: 1,
      ease: "power2.inOut",
      ...options
    };
    
    return animationController.createAnimation(target, defaults);
  },

  /**
   * Spin continuously
   */
  spin(target, options = {}) {
    const defaults = {
      rotation: 360,
      duration: 2,
      ease: "none",
      repeat: -1,
      ...options
    };
    
    return animationController.createAnimation(target, defaults);
  },

  /**
   * Wobble effect
   */
  wobble(target, options = {}) {
    if (!animationController.isReady()) return;
    
    const tl = animationController.gsap.timeline({ repeat: options.repeat || 0 });
    
    tl.to(target, { rotation: 15, duration: 0.1 })
      .to(target, { rotation: -10, duration: 0.1 })
      .to(target, { rotation: 5, duration: 0.1 })
      .to(target, { rotation: -5, duration: 0.1 })
      .to(target, { rotation: 0, duration: 0.1 });
    
    return tl;
  }
};

/**
 * Morphing animations
 */
export const morphAnimations = {
  /**
   * Morph between two states
   */
  morph(target, fromState, toState, options = {}) {
    if (!animationController.isReady()) return;
    
    const tl = animationController.gsap.timeline();
    
    // Set initial state
    tl.set(target, fromState);
    
    // Animate to final state
    tl.to(target, {
      ...toState,
      duration: 0.6,
      ease: "power2.inOut",
      ...options
    });
    
    return tl;
  },

  /**
   * Flip card effect
   */
  flipCard(target, options = {}) {
    if (!animationController.isReady()) return;
    
    const tl = animationController.gsap.timeline();
    
    tl.to(target, {
      rotationY: 90,
      duration: 0.3,
      ease: "power2.in"
    })
    .call(() => {
      // Change content in the middle of flip
      if (options.onFlip) options.onFlip();
    })
    .to(target, {
      rotationY: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    
    return tl;
  }
};

/**
 * Stagger utilities
 */
export const staggerAnimations = {
  /**
   * Stagger fade in
   */
  staggerFadeIn(targets, options = {}) {
    const defaults = {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1
    };
    
    return animationController.createStaggerAnimation(targets, defaults, {
      amount: options.stagger || 0.1,
      from: options.from || "start"
    });
  },

  /**
   * Stagger scale in
   */
  staggerScaleIn(targets, options = {}) {
    if (!animationController.isReady()) return;
    
    // Set initial state
    animationController.gsap.set(targets, { opacity: 0, scale: 0.8 });
    
    return animationController.createStaggerAnimation(targets, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, {
      amount: options.stagger || 0.1,
      from: options.from || "start"
    });
  },

  /**
   * Stagger slide in
   */
  staggerSlideIn(targets, direction = 'up', options = {}) {
    if (!animationController.isReady()) return;
    
    const directions = {
      up: { y: 50 },
      down: { y: -50 },
      left: { x: 50 },
      right: { x: -50 }
    };
    
    // Set initial state
    animationController.gsap.set(targets, {
      opacity: 0,
      ...directions[direction]
    });
    
    return animationController.createStaggerAnimation(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, {
      amount: options.stagger || 0.15,
      from: options.from || "start"
    });
  }
};

/**
 * Scroll-triggered animations
 */
export const scrollAnimations = {
  /**
   * Reveal on scroll
   */
  revealOnScroll(target, options = {}) {
    if (!animationController.ScrollTrigger) return;
    
    const animation = animationController.gsap.fromTo(target, 
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }
    );
    
    return animationController.createScrollTrigger(target, animation, {
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      ...options
    });
  },

  /**
   * Parallax effect
   */
  parallax(target, speed = 0.5, options = {}) {
    if (!animationController.ScrollTrigger) return;
    
    return animationController.createScrollTrigger(target, null, {
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const y = self.progress * speed * 100;
        animationController.gsap.set(target, { y: `${y}%` });
      },
      ...options
    });
  },

  /**
   * Counter animation on scroll
   */
  counterOnScroll(target, endValue, options = {}) {
    if (!animationController.ScrollTrigger) return;
    
    const obj = { value: 0 };
    const animation = animationController.gsap.to(obj, {
      value: endValue,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        target.textContent = Math.round(obj.value);
      }
    });
    
    return animationController.createScrollTrigger(target, animation, {
      start: "top 80%",
      toggleActions: "play none none reverse",
      ...options
    });
  }
};

/**
 * Utility function to create custom animation sequences
 */
export function createSequence(animations) {
  if (!animationController.isReady()) return;
  
  const tl = animationController.gsap.timeline();
  
  animations.forEach((anim, index) => {
    const { target, props, options = {} } = anim;
    const position = options.position || (index === 0 ? 0 : ">");
    
    tl.to(target, props, position);
  });
  
  return tl;
}

/**
 * Utility to animate CSS custom properties
 */
export function animateCSS(target, cssProps, options = {}) {
  if (!animationController.isReady()) return;
  
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  return animationController.createAnimation(element, {
    ...cssProps,
    duration: 0.6,
    ease: "power2.out",
    ...options
  });
}

/**
 * Performance-aware animation wrapper
 */
export function performantAnimate(target, props, options = {}) {
  // Check for reduced motion
  if (shouldReduceMotion()) {
    // Apply final state immediately
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    Object.assign(element.style, {
      opacity: props.opacity,
      transform: `translate(${props.x || 0}px, ${props.y || 0}px) scale(${props.scale || 1})`
    });
    return Promise.resolve();
  }
  
  // Use appropriate animation based on performance mode
  const performanceMode = animationController.getPerformanceMode();
  const optimizedProps = performanceMode === 'mobile' ? 
    { ...props, duration: (props.duration || 0.6) * 0.8 } : // Faster on mobile
    props;
  
  return animationController.createAnimation(target, optimizedProps, options);
}

// Export all animation utilities
export default {
  fade: fadeAnimations,
  slide: slideAnimations,
  scale: scaleAnimations,
  rotation: rotationAnimations,
  morph: morphAnimations,
  stagger: staggerAnimations,
  scroll: scrollAnimations,
  createSequence,
  animateCSS,
  performantAnimate
};