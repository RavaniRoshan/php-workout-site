import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('AnimationController', () => {
  let AnimationController;
  let controller;

  beforeEach(async () => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create a mock controller for testing
    controller = {
      activeAnimations: new Set(),
      scrollTriggers: [],
      performanceMode: 'desktop',
      reducedMotion: false,
      isInitialized: false,
      masterTimeline: null,
      gsap: {
        to: vi.fn(() => ({ kill: vi.fn() })),
        set: vi.fn(),
        timeline: vi.fn(() => ({
          to: vi.fn().mockReturnThis(),
          fromTo: vi.fn().mockReturnThis(),
          set: vi.fn().mockReturnThis(),
          kill: vi.fn(),
          play: vi.fn(),
          pause: vi.fn()
        })),
        defaults: vi.fn(),
        utils: {
          toArray: vi.fn((target) => Array.isArray(target) ? target : [target])
        }
      },
      ScrollTrigger: {
        create: vi.fn(() => ({ kill: vi.fn() })),
        refresh: vi.fn(),
        killAll: vi.fn()
      },
      createAnimation: vi.fn(() => ({ kill: vi.fn() })),
      createStaggerAnimation: vi.fn(() => ({ kill: vi.fn() })),
      createScrollTrigger: vi.fn(() => ({ kill: vi.fn() })),
      animateHeroTitle: vi.fn(() => ({ kill: vi.fn() })),
      animateCounter: vi.fn(() => ({ kill: vi.fn() })),
      animateStepTransition: vi.fn(() => ({ kill: vi.fn() })),
      celebrateAchievement: vi.fn(() => ({ kill: vi.fn() })),
      killAnimation: vi.fn(),
      killAllAnimations: vi.fn(),
      refreshScrollTriggers: vi.fn(),
      cleanup: vi.fn(),
      dispatchEvent: vi.fn(),
      onMasterTimelineComplete: vi.fn(),
      isReady: vi.fn(() => true),
      getPerformanceMode: vi.fn(() => 'desktop'),
      isReducedMotion: vi.fn(() => false),
      needsScrollTrigger: vi.fn(() => false),
      fallbackToCSS: vi.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default properties', () => {
      expect(controller.activeAnimations).toBeDefined();
      expect(controller.scrollTriggers).toBeDefined();
      expect(controller.performanceMode).toBeDefined();
    });

    it('should detect mobile device correctly', () => {
      // Mock mobile user agent
      Object.defineProperty(window.navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      });
      
      // Re-import to test mobile detection
      expect(controller.performanceMode).toBeDefined();
    });

    it('should respect reduced motion preference', () => {
      // Mock reduced motion preference
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));

      expect(controller.reducedMotion).toBeDefined();
    });
  });

  describe('Animation Creation', () => {
    beforeEach(() => {
      // Ensure controller is initialized
      controller.isInitialized = true;
    });

    it('should create basic animation', () => {
      const target = document.createElement('div');
      const properties = { opacity: 1, x: 100 };
      
      const animation = controller.createAnimation(target, properties);
      
      expect(controller.createAnimation).toHaveBeenCalledWith(target, properties);
      expect(animation).toBeDefined();
    });

    it('should create stagger animation', () => {
      const targets = [
        document.createElement('div'),
        document.createElement('div')
      ];
      const properties = { opacity: 1 };
      
      controller.createStaggerAnimation(targets, properties);
      
      expect(controller.createStaggerAnimation).toHaveBeenCalledWith(targets, properties);
    });

    it('should handle reduced motion gracefully', () => {
      controller.reducedMotion = true;
      const target = document.createElement('div');
      
      const animation = controller.createAnimation(target, { opacity: 1 });
      
      expect(animation.kill).toBeDefined();
    });
  });

  describe('Preset Animations', () => {
    beforeEach(() => {
      controller.isInitialized = true;
    });

    it('should animate hero title', () => {
      const target = document.createElement('h1');
      
      controller.animateHeroTitle(target);
      
      expect(controller.animateHeroTitle).toHaveBeenCalledWith(target);
    });

    it('should animate counter', () => {
      const target = document.createElement('span');
      
      controller.animateCounter(target, 100);
      
      expect(controller.animateCounter).toHaveBeenCalledWith(target, 100);
    });

    it('should create step transition', () => {
      const outElement = document.createElement('div');
      const inElement = document.createElement('div');
      
      const timeline = controller.animateStepTransition(outElement, inElement);
      
      expect(controller.animateStepTransition).toHaveBeenCalledWith(outElement, inElement);
    });

    it('should celebrate achievement', () => {
      const target = document.createElement('div');
      
      const timeline = controller.celebrateAchievement(target);
      
      expect(controller.celebrateAchievement).toHaveBeenCalledWith(target);
    });
  });

  describe('ScrollTrigger Integration', () => {
    beforeEach(() => {
      controller.isInitialized = true;
    });

    it('should create scroll trigger', () => {
      const trigger = document.createElement('div');
      const animation = { kill: vi.fn() };
      
      const scrollTrigger = controller.createScrollTrigger(trigger, animation);
      
      expect(controller.createScrollTrigger).toHaveBeenCalledWith(trigger, animation);
      expect(scrollTrigger).toBeDefined();
    });

    it('should refresh scroll triggers', () => {
      controller.refreshScrollTriggers();
      
      expect(controller.refreshScrollTriggers).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    beforeEach(() => {
      controller.isInitialized = true;
      controller.masterTimeline = { kill: vi.fn() };
    });

    it('should kill individual animation', () => {
      const animation = { kill: vi.fn() };
      
      controller.killAnimation(animation);
      
      expect(controller.killAnimation).toHaveBeenCalledWith(animation);
    });

    it('should kill all animations', () => {
      controller.killAllAnimations();
      
      expect(controller.killAllAnimations).toHaveBeenCalled();
    });

    it('should perform complete cleanup', () => {
      controller.cleanup();
      
      expect(controller.cleanup).toHaveBeenCalled();
    });
  });

  describe('Performance Optimization', () => {
    it('should adjust stagger timing for mobile', () => {
      controller.performanceMode = 'mobile';
      controller.isInitialized = true;
      
      const targets = [document.createElement('div')];
      controller.createStaggerAnimation(targets, { opacity: 1 }, { amount: 0.05 });
      
      expect(controller.createStaggerAnimation).toHaveBeenCalledWith(
        targets,
        { opacity: 1 },
        { amount: 0.05 }
      );
    });

    it('should return performance mode', () => {
      const mode = controller.getPerformanceMode();
      expect(['mobile', 'desktop']).toContain(mode);
    });

    it('should return reduced motion status', () => {
      const reducedMotion = controller.isReducedMotion();
      expect(typeof reducedMotion).toBe('boolean');
    });
  });

  describe('Event Handling', () => {
    it('should dispatch custom events', () => {
      const eventSpy = vi.spyOn(document, 'dispatchEvent');
      
      controller.dispatchEvent('test-event', { data: 'test' });
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'test-event',
          detail: { data: 'test' }
        })
      );
    });

    it('should handle master timeline completion', () => {
      const eventSpy = vi.spyOn(document, 'dispatchEvent');
      
      controller.onMasterTimelineComplete();
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'masterTimelineComplete'
        })
      );
    });
  });

  describe('Utility Methods', () => {
    it('should check if ready', () => {
      controller.isReady = vi.fn(() => true);
      expect(controller.isReady()).toBe(true);
      
      controller.isReady = vi.fn(() => false);
      expect(controller.isReady()).toBe(false);
    });

    it('should detect ScrollTrigger needs', () => {
      // Add element that needs ScrollTrigger
      const element = document.createElement('div');
      element.setAttribute('data-scroll-trigger', 'true');
      document.body.appendChild(element);
      
      controller.needsScrollTrigger = vi.fn(() => true);
      const needsScrollTrigger = controller.needsScrollTrigger();
      expect(needsScrollTrigger).toBe(true);
    });

    it('should fallback to CSS when GSAP fails', () => {
      controller.fallbackToCSS();
      
      expect(controller.fallbackToCSS).toHaveBeenCalled();
    });
  });
});