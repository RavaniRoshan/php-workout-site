// Animation Controller - Manages GSAP animations and timeline cleanup
import { gsapConfig, animationPresets, shouldReduceMotion, isMobileDevice, monitorPerformance } from '../utils/gsap-config.js';

class AnimationController {
  constructor() {
    this.masterTimeline = null;
    this.scrollTriggers = [];
    this.activeAnimations = new Set();
    this.isInitialized = false;
    
    // Performance monitoring
    this.performanceMode = isMobileDevice() ? 'mobile' : 'desktop';
    this.reducedMotion = shouldReduceMotion();
    
    this.init();
  }
  
  async init() {
    try {
      // Dynamically import GSAP core
      const { gsap } = await import('gsap');
      this.gsap = gsap;
      
      // Set GSAP defaults
      gsap.defaults(gsapConfig.defaults);
      
      // Load ScrollTrigger if needed
      if (this.needsScrollTrigger()) {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        this.ScrollTrigger = ScrollTrigger;
      }
      
      // Initialize master timeline
      this.masterTimeline = gsap.timeline({
        paused: true,
        onComplete: () => this.onMasterTimelineComplete()
      });
      
      // Start performance monitoring
      if (this.performanceMode === 'mobile') {
        monitorPerformance();
      }
      
      this.isInitialized = true;
      this.dispatchEvent('animationControllerReady');
      
    } catch (error) {
      console.error('Failed to initialize AnimationController:', error);
      this.fallbackToCSS();
    }
  }
  
  // Check if ScrollTrigger is needed based on page content
  needsScrollTrigger() {
    return document.querySelector('[data-scroll-trigger]') !== null ||
           document.querySelector('.gsap-scroll-trigger') !== null;
  }
  
  // Fallback to CSS animations if GSAP fails
  fallbackToCSS() {
    document.body.classList.add('gsap-fallback');
    console.warn('GSAP failed to load, falling back to CSS animations');
  }
  
  // Create and manage animations
  createAnimation(target, properties, options = {}) {
    if (!this.isInitialized || this.reducedMotion) {
      return this.createReducedMotionAnimation(target, properties);
    }
    
    const animation = this.gsap.to(target, {
      ...properties,
      ...options,
      onComplete: () => {
        this.activeAnimations.delete(animation);
        if (options.onComplete) options.onComplete();
      }
    });
    
    this.activeAnimations.add(animation);
    return animation;
  }
  
  // Reduced motion alternative
  createReducedMotionAnimation(target, properties) {
    // Apply final state immediately for reduced motion
    const elements = this.gsap.utils.toArray(target);
    elements.forEach(el => {
      if (properties.opacity !== undefined) el.style.opacity = properties.opacity;
      if (properties.x !== undefined) el.style.transform = `translateX(${properties.x}px)`;
      if (properties.y !== undefined) el.style.transform = `translateY(${properties.y}px)`;
      if (properties.scale !== undefined) el.style.transform = `scale(${properties.scale})`;
    });
    
    return { kill: () => {} }; // Return mock animation object
  }
  
  // Staggered animations with performance optimization
  createStaggerAnimation(targets, properties, staggerOptions = {}) {
    if (!this.isInitialized) return;
    
    const stagger = this.performanceMode === 'mobile' ? 
      Math.max(staggerOptions.amount || 0.1, 0.05) : // Slower stagger on mobile
      staggerOptions.amount || 0.1;
    
    return this.gsap.to(targets, {
      ...properties,
      stagger: {
        amount: stagger,
        from: staggerOptions.from || "start",
        ...staggerOptions
      }
    });
  }
  
  // ScrollTrigger animations with cleanup
  createScrollTrigger(trigger, animation, options = {}) {
    if (!this.ScrollTrigger || this.reducedMotion) return;
    
    const scrollTrigger = this.ScrollTrigger.create({
      trigger,
      ...gsapConfig.scrollTrigger,
      ...options,
      animation,
      onRefresh: () => {
        // Handle responsive changes
        if (options.onRefresh) options.onRefresh();
      }
    });
    
    this.scrollTriggers.push(scrollTrigger);
    return scrollTrigger;
  }
  
  // Preset animations for common use cases
  animateHeroTitle(target) {
    const preset = animationPresets.heroTitle;
    return this.createAnimation(target, {
      opacity: 1,
      y: 0,
      duration: preset.duration,
      ease: preset.ease,
      stagger: preset.stagger
    });
  }
  
  animateCardReveal(targets) {
    const preset = animationPresets.cardReveal;
    return this.createStaggerAnimation(targets, {
      opacity: 1,
      y: 0,
      duration: preset.duration,
      ease: preset.ease
    }, { amount: preset.stagger });
  }
  
  animateCounter(target, endValue, options = {}) {
    if (!this.isInitialized) return;
    
    const obj = { value: 0 };
    return this.gsap.to(obj, {
      value: endValue,
      duration: animationPresets.counterUp.duration,
      ease: animationPresets.counterUp.ease,
      onUpdate: () => {
        target.textContent = Math.round(obj.value);
      },
      ...options
    });
  }
  
  // Form step transitions
  animateStepTransition(outElement, inElement, direction = 'forward') {
    if (!this.isInitialized) return Promise.resolve();
    
    const preset = animationPresets.stepTransition;
    const xOffset = direction === 'forward' ? 50 : -50;
    
    const tl = this.gsap.timeline();
    
    // Animate out
    tl.to(outElement, {
      opacity: 0,
      x: -xOffset,
      duration: preset.duration,
      ease: preset.ease
    });
    
    // Animate in
    tl.fromTo(inElement, 
      { opacity: 0, x: xOffset },
      { 
        opacity: 1, 
        x: 0, 
        duration: preset.duration,
        ease: preset.ease 
      },
      "-=0.2"
    );
    
    return tl;
  }
  
  // Achievement celebration animation
  celebrateAchievement(target) {
    if (!this.isInitialized) return;
    
    const preset = animationPresets.achievement;
    const tl = this.gsap.timeline();
    
    tl.to(target, {
      scale: preset.scale,
      rotation: preset.rotation,
      duration: preset.duration,
      ease: preset.ease
    })
    .to(target, {
      scale: 1,
      rotation: 0,
      duration: preset.duration * 0.6,
      ease: "bounce.out"
    });
    
    return tl;
  }
  
  // Cleanup methods
  killAnimation(animation) {
    if (animation && animation.kill) {
      animation.kill();
      this.activeAnimations.delete(animation);
    }
  }
  
  killAllAnimations() {
    this.activeAnimations.forEach(animation => {
      if (animation.kill) animation.kill();
    });
    this.activeAnimations.clear();
  }
  
  refreshScrollTriggers() {
    if (this.ScrollTrigger) {
      this.ScrollTrigger.refresh();
    }
  }
  
  // Complete cleanup on page unload
  cleanup() {
    // Kill all active animations
    this.killAllAnimations();
    
    // Kill master timeline
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
    
    // Kill all ScrollTriggers
    this.scrollTriggers.forEach(st => st.kill());
    this.scrollTriggers = [];
    
    // Kill all ScrollTriggers globally
    if (this.ScrollTrigger) {
      this.ScrollTrigger.killAll();
    }
  }
  
  // Event handling
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
  
  // Master timeline completion handler
  onMasterTimelineComplete() {
    this.dispatchEvent('masterTimelineComplete');
  }
  
  // Utility methods
  isReady() {
    return this.isInitialized;
  }
  
  getPerformanceMode() {
    return this.performanceMode;
  }
  
  isReducedMotion() {
    return this.reducedMotion;
  }
}

// Create singleton instance
const animationController = new AnimationController();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  animationController.cleanup();
});

// Handle reduced motion preference changes
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', (e) => {
    animationController.reducedMotion = e.matches;
  });
}

export default animationController;